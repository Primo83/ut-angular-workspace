#!/usr/bin/env python3
import argparse
import json
import os
import re
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Set, Tuple


ALLOWED_STATUSES: Set[str] = {
    "proposal",
    "to-do",
    "planning",
    "planned",
    "in-progress",
    "on-hold",
    "done",
}

EXPECTED_TASKS_HEADER: List[str] = [
    "ID-T",
    "Status",
    "Agent",
    "Rodzic",
    "Zadanie",
    "Opis",
    "Utworzono",
    "Zaktualizowano",
    "Co zrobiono do tej pory",
]

AUDIT_PLAN_MARKER = "audit-gate:plan-v1"
AUDIT_PLAN_CLAUDE_GLOB = "*-plan-audit-claude.md"
AUDIT_PLAN_SUBAGENT_GLOB = "*-plan-audit-subagent-*.md"
AUDIT_PLAN_GEMINI_GLOB = "*-plan-audit-gemini.md"
AUDIT_PLAN_FILENAME_RE = re.compile(
    r"^(?P<ts>\d{8}-\d{4})-plan-audit-(?P<kind>claude|gemini|subagent-\d+)\.md$",
    flags=re.IGNORECASE,
)
BLOCKER_MARKER_RE = re.compile(r"\[BLOCKER\]", flags=re.IGNORECASE)
UI_TASK_MARKER_RE = re.compile(r"^\s*-\s*\[x\]\s*UI/UX\b", flags=re.IGNORECASE | re.MULTILINE)
TEST_ACCOUNTS_ENV_FILE = ".env.test-accounts"
TEST_ACCOUNTS_ENV_KEYS: Tuple[str, ...] = (
    "ATK_BROWSER_BASE_URL",
    "ATK_BROWSER_TEST_USER",
    "ATK_BROWSER_TEST_PASS",
)

COLOR_RESET = "\033[0m"
COLOR_RED = "\033[91m"
COLOR_YELLOW = "\033[93m"


def _color_enabled(stream: object) -> bool:
    if os.environ.get("NO_COLOR") is not None:
        return False
    if os.environ.get("TERM") == "dumb":
        return False
    try:
        return bool(stream.isatty())
    except Exception:
        return False


def _colorize(text: str, color: str, *, stream: object) -> str:
    if not _color_enabled(stream):
        return text
    code = {"red": COLOR_RED, "yellow": COLOR_YELLOW}.get(color)
    if code is None:
        return text
    return f"{code}{text}{COLOR_RESET}"


def _tag(tag: str, *, color: str, stream: object) -> str:
    return _colorize(f"[{tag}]", color=color, stream=stream)


def _print_tag(tag: str, message: str, *, color: str, stream: object = sys.stdout) -> None:
    print(f"{_tag(tag, color=color, stream=stream)} {message}", file=stream)


@dataclass(frozen=True)
class Issue:
    level: str  # "error" | "warn"
    path: Path
    line: Optional[int]
    message: str


class Reporter:
    def __init__(self) -> None:
        self.issues: List[Issue] = []

    def error(self, path: Path, message: str, *, line: Optional[int] = None) -> None:
        self.issues.append(Issue("error", path, line, message))

    def warn(self, path: Path, message: str, *, line: Optional[int] = None) -> None:
        self.issues.append(Issue("warn", path, line, message))

    def has_errors(self) -> bool:
        return any(i.level == "error" for i in self.issues)

    def has_warnings(self) -> bool:
        return any(i.level == "warn" for i in self.issues)

    def _rel_path(self, path: Path, *, root: Path) -> str:
        try:
            return path.resolve().relative_to(root).as_posix()
        except Exception:
            try:
                return path.as_posix()
            except Exception:
                return str(path)

    def print(self) -> None:
        for issue in self.issues:
            loc = f":{issue.line}" if issue.line is not None else ""
            if issue.level == "error":
                prefix = _tag("error", color="red", stream=sys.stdout)
            else:
                prefix = _tag("warn", color="yellow", stream=sys.stdout)
            print(f"{prefix} {issue.path}{loc}: {issue.message}")

    def print_json(self, *, root: Path) -> None:
        payload = {
            "summary": {
                "errors": sum(1 for i in self.issues if i.level == "error"),
                "warnings": sum(1 for i in self.issues if i.level == "warn"),
                "total": len(self.issues),
            },
            "issues": [
                {
                    "level": i.level,
                    "path": self._rel_path(i.path, root=root),
                    "line": i.line,
                    "message": i.message,
                }
                for i in self.issues
            ],
        }
        print(json.dumps(payload, ensure_ascii=False))


@dataclass(frozen=True)
class MarkdownTableRow:
    line: int
    cells: List[str]


@dataclass(frozen=True)
class MarkdownTable:
    header_line: int
    header: List[str]
    rows: List[MarkdownTableRow]


def _split_md_table_row(line: str) -> List[str]:
    raw = line.strip()
    if raw.startswith("|"):
        raw = raw[1:]
    if raw.endswith("|"):
        raw = raw[:-1]
    return [cell.strip() for cell in raw.split("|")]


_TABLE_SEPARATOR_RE = re.compile(r"^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$")


def parse_first_markdown_table(lines: Sequence[str]) -> Optional[MarkdownTable]:
    for idx in range(len(lines) - 1):
        header_line = lines[idx]
        sep_line = lines[idx + 1]
        if "|" not in header_line:
            continue
        if not _TABLE_SEPARATOR_RE.match(sep_line):
            continue

        header_cells = _split_md_table_row(header_line)
        rows: List[MarkdownTableRow] = []
        for row_idx in range(idx + 2, len(lines)):
            row_line = lines[row_idx]
            if "|" not in row_line:
                break
            if row_line.strip().startswith("<!--"):
                continue
            row_cells = _split_md_table_row(row_line)
            if not any(c.strip() for c in row_cells):
                break
            rows.append(MarkdownTableRow(line=row_idx + 1, cells=row_cells))
        return MarkdownTable(header_line=idx + 1, header=header_cells, rows=rows)
    return None


def parse_dt(value: str) -> Optional[datetime]:
    try:
        return datetime.strptime(value.strip(), "%Y-%m-%d %H:%M")
    except ValueError:
        return None


_ID_T_RE = re.compile(r"^\d{2}(?:-\d{2})*$")


@dataclass
class TaskRow:
    id_t: str
    status: str
    agent: str
    parent: str
    created: str
    updated: str
    notes: str
    line: int


@dataclass
class TaskTable:
    path: Path
    header_line: int
    rows: List[TaskRow]
    by_id: Dict[str, TaskRow]


def _task_kind(task_dir: Path) -> str:
    name = task_dir.name
    if task_dir.parent.name == "_archive":
        return "archived"
    if name == "template-task_proposal" or name.startswith("template-"):
        return "template"
    if name.startswith("example"):
        return "example"
    return "active"


def _parse_task_dir_status(task_dir_name: str) -> Optional[str]:
    if "_" not in task_dir_name:
        return None
    suffix = task_dir_name.rsplit("_", 1)[-1]
    return suffix if suffix in ALLOWED_STATUSES else None


def _collect_plan_audit_rounds(notes_dir: Path) -> Dict[str, Dict[str, List[Path]]]:
    rounds: Dict[str, Dict[str, List[Path]]] = {}
    if not notes_dir.is_dir():
        return rounds

    for report in sorted(notes_dir.glob("*-plan-audit-*.md")):
        match = AUDIT_PLAN_FILENAME_RE.match(report.name)
        if not match:
            continue
        ts = match.group("ts")
        kind_raw = match.group("kind").lower()
        kind = "subagent" if kind_raw.startswith("subagent-") else kind_raw
        bucket = rounds.setdefault(ts, {"claude": [], "gemini": [], "subagent": []})
        bucket[kind].append(report)

    return rounds


def _complete_plan_audit_round_ids(rounds: Dict[str, Dict[str, List[Path]]]) -> List[str]:
    complete: List[str] = []
    for ts, reports in rounds.items():
        if len(reports.get("claude", [])) < 1:
            continue
        if len(reports.get("gemini", [])) < 1:
            continue
        if len(reports.get("subagent", [])) < 2:
            continue
        complete.append(ts)
    return sorted(complete)


def _report_has_p0_p1_findings(report: Path) -> bool:
    try:
        text = report.read_text(encoding="utf-8")
    except Exception:
        return True

    for raw_line in text.splitlines():
        line = raw_line.strip().lower()
        if not line:
            continue
        if "severity(p0/p1/p2)" in line or "| severity" in line:
            continue

        match_table_count = re.search(r"\|\s*p([01])\s*\|\s*(\d+)\s*\|", line)
        if match_table_count:
            if int(match_table_count.group(2)) > 0:
                return True
            continue

        match_count = re.search(r"\bp([01])\s*[:=]\s*(\d+)\b", line)
        if match_count:
            if int(match_count.group(2)) > 0:
                return True
            continue

        if line.startswith("|") and ("| p0 |" in line or "| p1 |" in line):
            if "brak findings" in line or "brak uwag" in line or "brak zastrzezen" in line:
                continue
            return True

    return False


def _task_has_open_rows(table: TaskTable) -> bool:
    return any(row.status not in {"done", "on-hold"} for row in table.rows)


def _validate_decision_complete_fail_safe(task_dir: Path, *, kind: str, table: TaskTable, r: Reporter) -> None:
    if kind != "active":
        return

    implementation_rows = [row for row in table.rows if row.id_t != "01" and row.status == "in-progress"]
    if not implementation_rows:
        return

    tasks_text = table.path.read_text(encoding="utf-8")
    if AUDIT_PLAN_MARKER not in tasks_text:
        return

    row_01 = table.by_id.get("01")
    if row_01 is None or row_01.status != "done":
        for row in implementation_rows:
            r.error(
                table.path,
                "Fail-safe gate `decision-complete`: nie wolno uruchamiać `in-progress` dla `ID-T != 01` "
                "przed `ID-T = 01` ze statusem `done`.",
                line=row.line,
            )
        return

    notes_dir = task_dir / "additional-notes"
    rounds = _collect_plan_audit_rounds(notes_dir)
    complete_rounds = _complete_plan_audit_round_ids(rounds)
    if not complete_rounds:
        for row in implementation_rows:
            r.error(
                table.path,
                "Fail-safe gate `decision-complete`: brak kompletnej rundy plan-audit "
                "(2 subagent + Claude + Gemini ze wspolnym TS) przed startem implementacji.",
                line=row.line,
            )
        return

    blocker_files = sorted(notes_dir.glob("*-audit-blockers.md")) if notes_dir.is_dir() else []
    blocker_in_notes = any(BLOCKER_MARKER_RE.search(row.notes) for row in table.rows)
    if blocker_files or blocker_in_notes:
        details_parts: List[str] = []
        if blocker_files:
            details_parts.append(", ".join(p.name for p in blocker_files))
        if blocker_in_notes:
            details_parts.append("[BLOCKER] w kolumnie `Co zrobiono do tej pory`")
        details = "; ".join(details_parts)
        for row in implementation_rows:
            r.error(
                table.path,
                "Fail-safe gate `decision-complete`: aktywny blocker (" + details + ").",
                line=row.line,
            )
        return

    latest_ts = complete_rounds[-1]
    latest_reports = (
        rounds[latest_ts].get("claude", [])
        + rounds[latest_ts].get("gemini", [])
        + rounds[latest_ts].get("subagent", [])
    )
    blocking_reports: List[str] = []
    for report in latest_reports:
        if _report_has_p0_p1_findings(report):
            try:
                rel = report.relative_to(task_dir).as_posix()
            except ValueError:
                rel = report.name
            blocking_reports.append(rel)

    if blocking_reports:
        details = ", ".join(blocking_reports)
        for row in implementation_rows:
            r.error(
                table.path,
                "Fail-safe gate `decision-complete`: wykryto P1/P0 w raportach plan-audit "
                f"(runda {latest_ts}): {details}.",
                line=row.line,
            )


def _validate_ui_browser_test_accounts(task_dir: Path, *, kind: str, table: TaskTable, root: Path, r: Reporter) -> None:
    if kind != "active" or not _task_has_open_rows(table):
        return

    additional_contexts = task_dir / "additional-contexts.md"
    if not additional_contexts.exists():
        return

    try:
        text = additional_contexts.read_text(encoding="utf-8")
    except Exception as e:
        r.warn(additional_contexts, f"Nie mogę odczytać pliku: {e}")
        return

    if not UI_TASK_MARKER_RE.search(text):
        return

    if "/.env.test-accounts" not in text:
        r.error(
            additional_contexts,
            "Task UI/przeglądarkowy wymaga referencji do globalnego pliku `/.env.test-accounts`.",
        )

    missing_context_keys = [key for key in TEST_ACCOUNTS_ENV_KEYS if key not in text]
    if missing_context_keys:
        r.error(
            additional_contexts,
            "Task UI/przeglądarkowy wymaga skrótu danych kont testowych w `additional-contexts.md`; "
            f"brakuje: {', '.join(missing_context_keys)}.",
        )

    env_path = root / TEST_ACCOUNTS_ENV_FILE
    if not env_path.is_file():
        r.error(
            env_path,
            "Brak globalnego pliku `/.env.test-accounts` (wymagany dla tasków UI/przeglądarkowych).",
        )
        return

    try:
        env_text = env_path.read_text(encoding="utf-8")
    except Exception as e:
        r.error(env_path, f"Nie mogę odczytać pliku: {e}")
        return

    for key in TEST_ACCOUNTS_ENV_KEYS:
        if not re.search(rf"(?m)^\s*{re.escape(key)}\s*=\s*\S.*$", env_text):
            r.error(env_path, f"Brak klucza `{key}` lub pusta wartość w `/.env.test-accounts`.")


def _validate_id_t_01_guardrails(
    task_dir: Path,
    *,
    kind: str,
    status_suffix: Optional[str],
    table: TaskTable,
    r: Reporter,
) -> None:
    if kind == "archived":
        return

    row_01 = table.by_id.get("01")
    if row_01 is None:
        r.warn(
            table.path,
            "Brak wiersza `ID-T = 01` (twarda zasada procesu: 01 = doprecyzowanie `additional-contexts.md` + plan techniczny).",
        )
        return

    if status_suffix == "in-progress" and row_01.status in {"planning", "to-do"}:
        r.warn(
            table.path,
            f"Katalog zadania ma sufiks `_in-progress`, ale `ID-T = 01` ma `Status = {row_01.status}` (zwykle 01 powinno być `done`).",
            line=row_01.line,
        )

    if kind == "active" and row_01.status == "done":
        tasks_text = table.path.read_text(encoding="utf-8")
        if AUDIT_PLAN_MARKER in tasks_text:
            notes_dir = task_dir / "additional-notes"
            rounds = _collect_plan_audit_rounds(notes_dir)
            complete_rounds = _complete_plan_audit_round_ids(rounds)
            claude_reports = sum(len(v.get("claude", [])) for v in rounds.values())
            subagent_reports = sum(len(v.get("subagent", [])) for v in rounds.values())
            gemini_reports = sum(len(v.get("gemini", [])) for v in rounds.values())
            if not complete_rounds:
                r.warn(
                    table.path,
                    "Brak kompletu raportow audytu planu dla `ID-T = 01` "
                    f"(claude={claude_reports}, subagent={subagent_reports}, gemini={gemini_reports}, "
                    f"pelne-rundy={len(complete_rounds)}).",
                    line=row_01.line,
                )


def load_agent_ids(agent_profiles_md: Path, r: Reporter) -> Set[str]:
    if not agent_profiles_md.exists():
        r.warn(agent_profiles_md, "Brak pliku AGENT_PROFILES.md – pomijam walidację kolumny `Agent`.")
        return set()

    lines = agent_profiles_md.read_text(encoding="utf-8").splitlines()
    table = parse_first_markdown_table(lines)
    if table is None:
        r.warn(agent_profiles_md, "Nie znaleziono tabeli Markdown – pomijam walidację kolumny `Agent`.")
        return set()

    try:
        col_idx = table.header.index("AGENT_ID")
    except ValueError:
        r.warn(agent_profiles_md, "Brak kolumny `AGENT_ID` w tabeli – pomijam walidację kolumny `Agent`.")
        return set()

    agent_ids: Set[str] = set()
    for row in table.rows:
        if col_idx >= len(row.cells):
            continue
        value = row.cells[col_idx].strip()
        if value:
            agent_ids.add(value)
    return agent_ids


def load_tasks_table(tasks_md: Path, *, kind: str, agent_ids: Set[str], r: Reporter) -> Optional[TaskTable]:
    if not tasks_md.exists():
        r.error(tasks_md, "Brak pliku `tasks.md`.")
        return None

    lines = tasks_md.read_text(encoding="utf-8").splitlines()
    table = parse_first_markdown_table(lines)
    if table is None:
        r.error(tasks_md, "Nie znaleziono tabeli Markdown w `tasks.md`.")
        return None

    if [h.strip() for h in table.header] != EXPECTED_TASKS_HEADER:
        r.error(
            tasks_md,
            "Niepoprawne kolumny tabeli (oczekiwano: "
            + ", ".join(EXPECTED_TASKS_HEADER)
            + f"; jest: {', '.join(table.header)})",
            line=table.header_line,
        )
        return None

    rows: List[TaskRow] = []
    by_id: Dict[str, TaskRow] = {}

    for row in table.rows:
        if len(row.cells) != len(EXPECTED_TASKS_HEADER):
            r.error(
                tasks_md,
                f"Niepoprawna liczba kolumn w wierszu tabeli (oczekiwano {len(EXPECTED_TASKS_HEADER)}, jest {len(row.cells)}).",
                line=row.line,
            )
            continue

        cells = dict(zip(EXPECTED_TASKS_HEADER, row.cells))
        id_t = cells["ID-T"].strip()
        status = cells["Status"].strip()
        agent = cells["Agent"].strip()
        parent = cells["Rodzic"].strip()
        created = cells["Utworzono"].strip()
        updated = cells["Zaktualizowano"].strip()
        notes = cells["Co zrobiono do tej pory"].strip()

        if not id_t:
            r.error(tasks_md, "Puste `ID-T`.", line=row.line)
            continue
        if id_t in by_id:
            r.error(tasks_md, f"Duplikat `ID-T = {id_t}`.", line=row.line)
        if not _ID_T_RE.match(id_t):
            r.warn(tasks_md, f"Nietypowy format `ID-T = {id_t}` (oczekiwano np. `01`, `02-01`).", line=row.line)

        if status not in ALLOWED_STATUSES:
            r.error(
                tasks_md,
                f"Nieznany `Status = {status}` (dozwolone: {', '.join(sorted(ALLOWED_STATUSES))}).",
                line=row.line,
            )

        if agent and agent_ids and agent not in agent_ids:
            r.warn(tasks_md, f"`Agent = {agent}` nie występuje w `AGENT_PROFILES.md`.", line=row.line)

        if parent and not _ID_T_RE.match(parent):
            r.warn(tasks_md, f"Nietypowy format `Rodzic = {parent}`.", line=row.line)

        created_dt = parse_dt(created)
        updated_dt = parse_dt(updated)
        if created_dt is None:
            if kind == "template":
                r.warn(tasks_md, f"Niepoprawna data `Utworzono = {created}` (szablon).", line=row.line)
            else:
                r.error(tasks_md, f"Niepoprawna data `Utworzono = {created}` (format: YYYY-MM-DD HH:MM).", line=row.line)
        if updated_dt is None:
            if kind == "template":
                r.warn(tasks_md, f"Niepoprawna data `Zaktualizowano = {updated}` (szablon).", line=row.line)
            else:
                r.error(tasks_md, f"Niepoprawna data `Zaktualizowano = {updated}` (format: YYYY-MM-DD HH:MM).", line=row.line)
        if created_dt is not None and updated_dt is not None and updated_dt < created_dt:
            r.warn(tasks_md, "`Zaktualizowano` jest wcześniejsze niż `Utworzono`.", line=row.line)

        tr = TaskRow(
            id_t=id_t,
            status=status,
            agent=agent,
            parent=parent,
            created=created,
            updated=updated,
            notes=notes,
            line=row.line,
        )
        rows.append(tr)
        by_id[id_t] = tr

    table_obj = TaskTable(path=tasks_md, header_line=table.header_line, rows=rows, by_id=by_id)
    _validate_task_table_relations(table_obj, r=r)
    _validate_handoff(task_dir=tasks_md.parent, table=table_obj, kind=kind, r=r)
    return table_obj


def _validate_task_table_relations(table: TaskTable, *, r: Reporter) -> None:
    for row in table.rows:
        if row.parent and row.parent not in table.by_id:
            r.error(table.path, f"`Rodzic = {row.parent}` wskazuje na nieistniejący `ID-T`.", line=row.line)

        if "-" in row.id_t:
            expected_parent = row.id_t.rsplit("-", 1)[0]
            if row.parent and row.parent != expected_parent:
                r.warn(
                    table.path,
                    f"`Rodzic = {row.parent}` nie pasuje do prefiksu `ID-T = {row.id_t}` (typowo: {expected_parent}).",
                    line=row.line,
                )


_HANDOFF_RE = re.compile(r"\[(?P<label>handoff)\s*:\s*(?P<body>[^\]]+)\]", flags=re.IGNORECASE)


def _extract_handoff_markers(text: str) -> List[Tuple[str, str, str]]:
    markers: List[Tuple[str, str, str]] = []
    for m in _HANDOFF_RE.finditer(text):
        markers.append((m.group(0), m.group("label"), m.group("body")))
    return markers


def _parse_handoff_ids(body: str) -> List[str]:
    parts = [p.strip() for p in body.split(",")]
    return [p for p in parts if p]


def _dedupe_preserve_order(items: List[str]) -> List[str]:
    seen: Set[str] = set()
    out: List[str] = []
    for item in items:
        if item in seen:
            continue
        seen.add(item)
        out.append(item)
    return out


def _canonicalize_handoff_markers(text: str) -> Tuple[str, bool, List[str]]:
    ids_all: List[str] = []
    changed = False

    def repl(match: re.Match) -> str:
        nonlocal changed
        body = match.group("body")
        ids = [x.strip() for x in _parse_handoff_ids(body) if x.strip()]
        ids_all.extend(ids)
        canonical = f"[HANDOFF: {', '.join(ids)}]"
        if match.group(0) != canonical:
            changed = True
        return canonical

    new_text = _HANDOFF_RE.sub(repl, text)
    return new_text, changed, _dedupe_preserve_order(ids_all)


def _ensure_additional_contexts(task_dir: Path) -> bool:
    path = task_dir / "additional-contexts.md"
    if path.exists():
        return False
    path.write_text(
        "# Additional contexts\n\n"
        "TODO: uzupełnij kontekst dla tego zadania (linki, ograniczenia, wymagania).\n",
        encoding="utf-8",
    )
    return True


def _fix_tasks_md_and_handoff_notes(task_dir: Path, *, kind: str) -> bool:
    tasks_md = task_dir / "tasks.md"
    if not tasks_md.exists():
        return False

    raw = tasks_md.read_text(encoding="utf-8")
    lines = raw.splitlines()
    table = parse_first_markdown_table(lines)
    if table is None:
        return False

    if [h.strip() for h in table.header] != EXPECTED_TASKS_HEADER:
        return False

    notes_idx = EXPECTED_TASKS_HEADER.index("Co zrobiono do tej pory")
    id_idx = EXPECTED_TASKS_HEADER.index("ID-T")

    changed = False

    for row in table.rows:
        line_idx = row.line - 1
        if line_idx < 0 or line_idx >= len(lines):
            continue

        cells = _split_md_table_row(lines[line_idx])
        if len(cells) != len(EXPECTED_TASKS_HEADER):
            continue

        id_t = cells[id_idx].strip()
        notes = cells[notes_idx]

        new_notes, notes_changed, handoff_ids = _canonicalize_handoff_markers(notes)
        if notes_changed:
            cells[notes_idx] = new_notes
            lines[line_idx] = "| " + " | ".join(cells) + " |"
            changed = True

        if kind == "template":
            continue
        if not handoff_ids or not id_t:
            continue

        notes_dir = task_dir / "additional-notes"
        notes_dir.mkdir(parents=True, exist_ok=True)
        notes_file = notes_dir / f"{id_t}.md"
        marker = f"[HANDOFF: {', '.join(handoff_ids)}]"

        if not notes_file.exists():
            notes_file.write_text(f"# {id_t}\n\n{marker}\n", encoding="utf-8")
            changed = True
            continue

        text = notes_file.read_text(encoding="utf-8")
        text2, text_changed, _ = _canonicalize_handoff_markers(text)
        if not re.search(r"\[HANDOFF:\s*[^\]]+\]", text2, flags=re.IGNORECASE):
            text2 = f"{marker}\n\n{text2}"
            text_changed = True

        if text_changed:
            notes_file.write_text(text2.rstrip() + "\n", encoding="utf-8")
            changed = True

    if changed:
        tasks_md.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")

    return changed


def _apply_fixes(task_dirs: List[Path]) -> bool:
    any_changed = False
    for task_dir in task_dirs:
        kind = _task_kind(task_dir)
        if kind != "template":
            any_changed |= _ensure_additional_contexts(task_dir)
        any_changed |= _fix_tasks_md_and_handoff_notes(task_dir, kind=kind)
    return any_changed


def _validate_handoff(task_dir: Path, table: TaskTable, *, kind: str, r: Reporter) -> None:
    if kind == "template":
        return

    for row in table.rows:
        markers = _extract_handoff_markers(row.notes)
        if not markers:
            continue

        for marker_text, label, body in markers:
            if label != "HANDOFF":
                r.warn(table.path, f"Marker HANDOFF powinien mieć postać `[HANDOFF: ...]` (jest: `{marker_text}`).", line=row.line)

            ids = _parse_handoff_ids(body)
            if any(not _ID_T_RE.match(id_t) for id_t in ids):
                r.warn(table.path, f"Marker HANDOFF zawiera nietypowe ID-T: `{marker_text}`.", line=row.line)
            else:
                canonical = f"[HANDOFF: {', '.join(ids)}]"
                if marker_text != canonical:
                    r.warn(table.path, f"Niekanoniczny zapis markera HANDOFF (oczekiwano: `{canonical}`).", line=row.line)

            for id_t in ids:
                if id_t not in table.by_id:
                    r.error(table.path, f"HANDOFF wskazuje na nieistniejący `ID-T = {id_t}`.", line=row.line)

            notes_file = task_dir / "additional-notes" / f"{row.id_t}.md"
            if not notes_file.exists():
                r.error(table.path, f"Brak pliku `{notes_file.relative_to(task_dir)}` dla HANDOFF z `ID-T = {row.id_t}`.", line=row.line)
            else:
                content = notes_file.read_text(encoding="utf-8")
                if not re.search(r"\[HANDOFF:\s*[^\]]+\]", content, flags=re.IGNORECASE):
                    r.warn(notes_file, "Brak markera `[HANDOFF: ...]` w pliku (zalecane dla spójności z `tasks.md`).")

    tasks_md_text = table.path.read_text(encoding="utf-8")
    for m in re.finditer(r"`(additional-notes/[^`]+?)`", tasks_md_text):
        rel = m.group(1).strip()
        if "<" in rel or ">" in rel:
            continue
        ref_path = task_dir / rel
        if not ref_path.exists():
            r.error(table.path, f"Referencja do nieistniejącego pliku `{rel}`.")

    notes_dir = task_dir / "additional-notes"
    if notes_dir.is_dir():
        for notes_file in sorted(notes_dir.glob("*.md")):
            if notes_file.name == "README.md":
                continue
            if not re.match(r"^\d{2}(?:-\d{2})*\.md$", notes_file.name):
                continue
            try:
                text = notes_file.read_text(encoding="utf-8")
            except Exception as e:
                r.warn(notes_file, f"Nie mogę odczytać pliku: {e}")
                continue
            for _marker_text, _label, body in _extract_handoff_markers(text):
                for id_t in _parse_handoff_ids(body):
                    if id_t not in table.by_id:
                        r.error(notes_file, f"HANDOFF wskazuje na nieistniejący `ID-T = {id_t}`.")


@dataclass(frozen=True)
class Session:
    path: Path
    agent_id: Optional[str]
    current_task: str
    current_id_t: str
    last_updated: str


def _parse_session_file(path: Path, r: Reporter) -> Optional[Session]:
    raw_lines = path.read_text(encoding="utf-8").splitlines()
    if len(raw_lines) != 3:
        r.error(path, "Niepoprawny format – oczekiwano dokładnie 3 linii (current-task, current-id-t, last-updated).")
        return None

    def parse_kv(line: str) -> Tuple[str, str]:
        if ":" not in line:
            return "", ""
        key, value = line.split(":", 1)
        return key.strip(), value.strip()

    k1, v1 = parse_kv(raw_lines[0])
    k2, v2 = parse_kv(raw_lines[1])
    k3, v3 = parse_kv(raw_lines[2])

    if (k1, k2, k3) != ("current-task", "current-id-t", "last-updated"):
        r.error(path, "Niepoprawne klucze lub kolejność (oczekiwano: current-task, current-id-t, last-updated).")
        return None

    if parse_dt(v3) is None:
        r.error(path, f"Niepoprawna data `last-updated = {v3}` (format: YYYY-MM-DD HH:MM).")

    agent_id = None
    m = re.match(r"^SESSION_(?P<id>.+)\.md$", path.name)
    if m:
        agent_id = m.group("id")

    if (v1 == "none") != (v2 == "none"):
        r.warn(path, "Tylko jedno z pól `current-task` / `current-id-t` ma wartość `none` (zwykle oba).")

    return Session(path=path, agent_id=agent_id, current_task=v1, current_id_t=v2, last_updated=v3)


def main() -> None:
    p = argparse.ArgumentParser(description="Walidator procesu agents-tasks-knowledge (SESSION, tasks.md, HANDOFF).")
    p.add_argument("workspace_root", nargs="?", default=".", help="Katalog root workspace (np. katalog projektu).")
    p.add_argument("--include-examples", action="store_true", help="Waliduj także katalogi `tasks/example*`.")
    p.add_argument("--include-templates", action="store_true", help="Waliduj także katalog `tasks/template-task_proposal`.")
    p.add_argument("--include-archive", action="store_true", help="Waliduj także `tasks/_archive/*`.")
    p.add_argument("--strict", action="store_true", help="Traktuj ostrzeżenia jako błąd (exit code != 0).")
    p.add_argument("--json", action="store_true", help="Wypisz raport jako JSON na stdout (do CI / narzędzi).")
    p.add_argument("--fix", action="store_true", help="Zastosuj bezpieczne auto-poprawki (m.in. canonical HANDOFF, brakujące pliki).")
    args = p.parse_args()

    r = Reporter()
    root = Path(args.workspace_root).resolve()
    atk = root / "agents-tasks-knowledge"
    tasks_root = atk / "tasks"

    if not atk.is_dir():
        if args.json:
            r.error(atk, f"Brak katalogu: {atk}")
            r.print_json(root=root)
        else:
            _print_tag("error", f"Brak katalogu: {atk}", color="red", stream=sys.stderr)
        raise SystemExit(2)

    if not tasks_root.is_dir():
        if args.json:
            r.error(tasks_root, f"Brak katalogu: {tasks_root}")
            r.print_json(root=root)
        else:
            _print_tag("error", f"Brak katalogu: {tasks_root}", color="red", stream=sys.stderr)
        raise SystemExit(2)

    agent_ids = load_agent_ids(atk / "AGENT_PROFILES.md", r)

    sessions: List[Session] = []
    for path in sorted(atk.glob("SESSION*.md")):
        sess = _parse_session_file(path, r)
        if sess is not None:
            sessions.append(sess)

    table_cache: Dict[Path, TaskTable] = {}

    def get_table_for_task_dir(task_dir: Path) -> Optional[TaskTable]:
        tasks_md = task_dir / "tasks.md"
        kind = _task_kind(task_dir)
        if tasks_md in table_cache:
            return table_cache[tasks_md]
        tbl = load_tasks_table(tasks_md, kind=kind, agent_ids=agent_ids, r=r)
        if tbl is not None:
            table_cache[tasks_md] = tbl
        return tbl

    task_dirs: List[Path] = []
    for child in sorted(tasks_root.iterdir()):
        if not child.is_dir():
            continue
        if child.name.startswith("."):
            continue
        kind = _task_kind(child)
        if kind == "archived" and not args.include_archive:
            continue
        if kind == "example" and not args.include_examples:
            continue
        if kind == "template" and not args.include_templates:
            continue
        if child.name == "_archive" and not args.include_archive:
            continue
        if child.name == "_archive" and args.include_archive:
            for arch in sorted(child.iterdir()):
                if not arch.is_dir():
                    continue
                task_dirs.append(arch)
            continue
        task_dirs.append(child)

    if args.fix:
        _apply_fixes(task_dirs)

    for task_dir in task_dirs:
        kind = _task_kind(task_dir)

        status_suffix = _parse_task_dir_status(task_dir.name)
        if status_suffix is None:
            r.warn(task_dir, f"Nazwa katalogu zadania nie wygląda jak `<ID-Z>_<status>` (statusy: {', '.join(sorted(ALLOWED_STATUSES))}).")

        additional_contexts = task_dir / "additional-contexts.md"
        if not additional_contexts.exists():
            r.error(task_dir, "Brak pliku `additional-contexts.md`.")
        tbl = get_table_for_task_dir(task_dir)
        if tbl is None:
            continue

        _validate_id_t_01_guardrails(task_dir, kind=kind, status_suffix=status_suffix, table=tbl, r=r)
        _validate_decision_complete_fail_safe(task_dir, kind=kind, table=tbl, r=r)
        _validate_ui_browser_test_accounts(task_dir, kind=kind, table=tbl, root=root, r=r)

        if kind != "template":
            for row in tbl.rows:
                if row.status == "in-progress" and not row.agent:
                    r.warn(tbl.path, f"`ID-T = {row.id_t}` ma `Status = in-progress`, ale pustą kolumnę `Agent`.", line=row.line)

    for sess in sessions:
        if sess.agent_id and agent_ids and sess.agent_id not in agent_ids:
            r.warn(sess.path, f"AGENT_ID z nazwy pliku (`{sess.agent_id}`) nie występuje w `AGENT_PROFILES.md`.")

        if sess.current_task == "none" or sess.current_id_t == "none":
            continue

        task_dir = tasks_root / sess.current_task
        if not task_dir.is_dir():
            r.error(sess.path, f"`current-task = {sess.current_task}` nie wskazuje na istniejący katalog w `tasks/`.")
            continue

        tbl = get_table_for_task_dir(task_dir)
        if tbl is None:
            continue

        if sess.current_id_t not in tbl.by_id:
            r.error(sess.path, f"`current-id-t = {sess.current_id_t}` nie występuje w `{task_dir / 'tasks.md'}`.")
            continue

        row = tbl.by_id[sess.current_id_t]
        if row.status in {"done", "on-hold"}:
            r.warn(sess.path, f"Wskazywany `ID-T = {sess.current_id_t}` ma `Status = {row.status}` (zwykle SESSION powinien wskazywać aktywne kroki).")

        if sess.agent_id and row.agent and sess.agent_id != row.agent:
            r.warn(sess.path, f"Wskazywany wiersz ma `Agent = {row.agent}`, ale plik sesji jest dla `{sess.agent_id}`.")

    key_to_agents: Dict[Tuple[str, str], List[str]] = {}
    for sess in sessions:
        if not sess.agent_id:
            continue
        if sess.current_task == "none" or sess.current_id_t == "none":
            continue
        task_dir = tasks_root / sess.current_task
        if not task_dir.is_dir():
            continue
        tbl = get_table_for_task_dir(task_dir)
        if tbl is None:
            continue
        row = tbl.by_id.get(sess.current_id_t)
        if row is None or row.status != "in-progress":
            continue
        key = (sess.current_task, sess.current_id_t)
        key_to_agents.setdefault(key, []).append(sess.agent_id)

    for (task_name, id_t), agents in sorted(key_to_agents.items()):
        if len(agents) > 1:
            r.error(
                atk / f"tasks/{task_name}/tasks.md",
                f"Konflikt multi-agent: {', '.join(sorted(agents))} mają `SESSION_*` na tym samym `ID-T = {id_t}` (Status = in-progress).",
            )

    if args.json:
        r.print_json(root=root)
    else:
        r.print()

    if r.has_errors() or (args.strict and r.has_warnings()):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
