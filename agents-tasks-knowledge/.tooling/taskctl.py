#!/usr/bin/env python3
import argparse
import contextlib
import io
import json
import os
import re
import shutil
import sys
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

import doctor


_ID_T_RE = re.compile(r"^\d{2}(?:-\d{2})*$")
_FIXED_NOW_RE = re.compile(r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$")


@dataclass(frozen=True)
class Result:
    ok: bool
    action: str
    message: str
    path: Optional[str] = None
    warnings: Optional[List[str]] = None
    validation: Optional[Dict[str, object]] = None


def _now_ts() -> str:
    return _now_dt().strftime("%Y-%m-%d %H:%M")


def _now_dt() -> datetime:
    raw = os.environ.get("TASKCTL_FIXED_NOW")
    if raw:
        raw = raw.strip()
        if _FIXED_NOW_RE.match(raw):
            try:
                return datetime.strptime(raw, "%Y-%m-%d %H:%M")
            except ValueError:
                pass
    return datetime.now()


def _slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "task"


def _ensure_workspace_root(root: Path) -> Path:
    atk = root / "agents-tasks-knowledge"
    if not atk.is_dir():
        raise ValueError(f"Brak katalogu: {atk}")
    tasks_root = atk / "tasks"
    if not tasks_root.is_dir():
        raise ValueError(f"Brak katalogu: {tasks_root}")
    return atk


def _atomic_write(path: Path, content: str) -> None:
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(content, encoding="utf-8")
    tmp.replace(path)


@contextlib.contextmanager
def _patched_argv(argv: List[str]):
    old = sys.argv
    sys.argv = argv
    try:
        yield
    finally:
        sys.argv = old


def _run_doctor(root: Path) -> Tuple[int, Dict[str, object], List[str]]:
    stdout = io.StringIO()
    stderr = io.StringIO()
    argv = ["doctor.py", str(root), "--json"]
    try:
        with _patched_argv(argv), contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
            doctor.main()
        exit_code = 0
    except SystemExit as exc:
        if isinstance(exc.code, int):
            exit_code = exc.code
        else:
            exit_code = 0

    payload: Dict[str, object] = {}
    raw = stdout.getvalue().strip()
    if raw:
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError:
            payload = {"raw": raw}

    warnings: List[str] = []
    issues = payload.get("issues") if isinstance(payload, dict) else None
    if isinstance(issues, list):
        for issue in issues:
            if not isinstance(issue, dict):
                continue
            if issue.get("level") == "warn":
                msg = issue.get("message")
                if isinstance(msg, str):
                    warnings.append(msg)

    return exit_code, payload, warnings


def _snapshot_sessions(atk: Path, *, task_name: str) -> Dict[Path, str]:
    backups: Dict[Path, str] = {}
    for session_path in sorted(atk.glob("SESSION*.md")):
        lines = session_path.read_text(encoding="utf-8").splitlines()
        if len(lines) != 3 or not lines[0].startswith("current-task:"):
            continue
        current_task = lines[0].split(":", 1)[1].strip()
        if current_task == task_name:
            backups[session_path] = "\n".join(lines) + "\n"
    return backups


def _restore_sessions(backups: Dict[Path, str]) -> None:
    for path, content in backups.items():
        _atomic_write(path, content)

def _task_kind(task_dir: Path) -> str:
    name = task_dir.name
    if task_dir.parent.name == "_archive":
        return "archived"
    if name == "template-task_proposal" or name.startswith("template-"):
        return "template"
    if name.startswith("example"):
        return "example"
    return "active"


def _copy_template(template_dir: Path, dest_dir: Path) -> None:
    if not template_dir.is_dir():
        raise ValueError(f"Brak template: {template_dir}")
    shutil.copytree(template_dir, dest_dir)


def _patch_task_files(task_dir: Path, *, id_z: str, title: str, now_ts: str) -> None:
    tasks_md = task_dir / "tasks.md"
    if tasks_md.exists():
        text = tasks_md.read_text(encoding="utf-8")
        text = text.replace("<ID-Z>", id_z)
        text = text.replace("<krótki tytuł>", title)
        text = text.replace(" (szablon do skopiowania)", "")
        text = text.replace("YYYY-MM-DD HH:MM", now_ts)
        tasks_md.write_text(text, encoding="utf-8")

    additional_contexts = task_dir / "additional-contexts.md"
    if additional_contexts.exists():
        text = additional_contexts.read_text(encoding="utf-8")
        text = text.replace("<ID-Z>", id_z)
        additional_contexts.write_text(text, encoding="utf-8")


def cmd_new(args: argparse.Namespace) -> Result:
    root = Path(args.root).resolve()
    atk = _ensure_workspace_root(root)
    tasks_root = atk / "tasks"

    slug = _slugify(args.title)
    now_dt = _now_dt()
    date_prefix = now_dt.strftime("%Y%m%d-%H%M")
    id_z = args.id or f"{date_prefix}-{slug}"
    if "/" in id_z or "\\" in id_z or not id_z.strip():
        raise ValueError(f"Niepoprawny ID-Z: {id_z}")
    task_dir = tasks_root / f"{id_z}_proposal"

    if task_dir.exists():
        raise ValueError(f"Katalog już istnieje: {task_dir}")

    template_dir = Path(__file__).parent / "task-templates" / args.template
    _copy_template(template_dir, task_dir)
    _patch_task_files(task_dir, id_z=id_z, title=args.title, now_ts=now_dt.strftime("%Y-%m-%d %H:%M"))

    return Result(ok=True, action="new", message="Utworzono task.", path=str(task_dir))


def _load_tasks_table(task_dir: Path) -> doctor.TaskTable:
    tasks_md = task_dir / "tasks.md"
    r = doctor.Reporter()
    agent_ids = doctor.load_agent_ids(task_dir.parents[1] / "AGENT_PROFILES.md", r)
    table = doctor.load_tasks_table(tasks_md, kind=_task_kind(task_dir), agent_ids=agent_ids, r=r)
    if table is None or r.has_errors():
        r.print()
        raise ValueError("Nie można wczytać tasks.md.")
    return table


def _validate_id_t(table: doctor.TaskTable, id_t: str) -> None:
    if not _ID_T_RE.match(id_t):
        raise ValueError(f"Niepoprawny format ID-T: {id_t}")
    if id_t not in table.by_id:
        raise ValueError(f"ID-T `{id_t}` nie istnieje w {table.path}")


def _update_tasks_row(tasks_md: Path, *, row_line: int, updates: Dict[str, str]) -> None:
    lines = tasks_md.read_text(encoding="utf-8").splitlines()
    idx = row_line - 1
    if idx < 0 or idx >= len(lines):
        raise ValueError(f"Niepoprawny numer linii w tasks.md: {row_line}")

    raw_line = lines[idx]
    parts = [p.strip() for p in raw_line.split("|")]
    if len(parts) < 3:
        raise ValueError(f"Niepoprawny format wiersza: {raw_line}")

    cells = parts[1:-1]
    header = doctor.EXPECTED_TASKS_HEADER
    if len(cells) != len(header):
        raise ValueError(f"Niepoprawna liczba kolumn w wierszu: {raw_line}")

    cells_map = dict(zip(header, cells))
    for key, value in updates.items():
        if key not in cells_map:
            raise ValueError(f"Nieznana kolumna: {key}")
        cells_map[key] = value

    new_cells = [cells_map[h] for h in header]
    lines[idx] = "| " + " | ".join(new_cells) + " |"
    _atomic_write(tasks_md, "\n".join(lines) + "\n")


def _parse_task_dir_status(task_dir: Path) -> Optional[str]:
    name = task_dir.name
    if "_" not in name:
        return None
    return name.rsplit("_", 1)[-1]


def _update_sessions(atk: Path, *, old_task: str, new_task: str) -> None:
    for session_path in sorted(atk.glob("SESSION*.md")):
        lines = session_path.read_text(encoding="utf-8").splitlines()
        if len(lines) != 3:
            continue
        if not lines[0].startswith("current-task:"):
            continue
        current_task = lines[0].split(":", 1)[1].strip()
        if current_task != old_task:
            continue
        lines[0] = f"current-task: {new_task}"
        lines[2] = f"last-updated: {_now_ts()}"
        _atomic_write(session_path, "\n".join(lines) + "\n")


def _clear_sessions(atk: Path, *, task_name: str) -> None:
    for session_path in sorted(atk.glob("SESSION*.md")):
        lines = session_path.read_text(encoding="utf-8").splitlines()
        if len(lines) != 3:
            continue
        if not lines[0].startswith("current-task:"):
            continue
        current_task = lines[0].split(":", 1)[1].strip()
        if current_task != task_name:
            continue
        lines[0] = "current-task: none"
        lines[1] = "current-id-t: none"
        lines[2] = f"last-updated: {_now_ts()}"
        _atomic_write(session_path, "\n".join(lines) + "\n")


def cmd_set_session(args: argparse.Namespace) -> Result:
    root = Path(args.root).resolve()
    atk = _ensure_workspace_root(root)
    tasks_root = atk / "tasks"
    task_dir = tasks_root / args.task
    if not task_dir.is_dir():
        raise ValueError(f"Brak katalogu zadania: {task_dir}")

    table = _load_tasks_table(task_dir)
    _validate_id_t(table, args.id_t)

    session_name = "SESSION.md" if args.agent is None else f"SESSION_{args.agent}.md"
    session_path = atk / session_name

    now_ts = _now_ts()
    content = f"current-task: {args.task}\ncurrent-id-t: {args.id_t}\nlast-updated: {now_ts}\n"
    _atomic_write(session_path, content)

    return Result(ok=True, action="set-session", message="Zaktualizowano SESSION.", path=str(session_path))


def cmd_move_status(args: argparse.Namespace) -> Result:
    root = Path(args.root).resolve()
    atk = _ensure_workspace_root(root)
    tasks_root = atk / "tasks"
    task_dir = tasks_root / args.task
    if not task_dir.is_dir():
        raise ValueError(f"Brak katalogu zadania: {task_dir}")

    new_status = args.to
    if new_status not in doctor.ALLOWED_STATUSES:
        raise ValueError(f"Niepoprawny status: {new_status}")

    old_status = _parse_task_dir_status(task_dir)
    if old_status is None:
        raise ValueError(f"Niepoprawny format katalogu zadania: {task_dir.name}")
    if old_status == new_status:
        raise ValueError(f"Status już ustawiony na {new_status}.")

    id_z = task_dir.name.rsplit("_", 1)[0]
    new_dir = tasks_root / f"{id_z}_{new_status}"
    if new_dir.exists():
        raise ValueError(f"Docelowy katalog już istnieje: {new_dir}")

    touch_id_t_01 = bool(getattr(args, "touch_id_t_01", False))
    row_01 = None
    original_tasks = None
    tasks_md = task_dir / "tasks.md"
    if touch_id_t_01:
        table = _load_tasks_table(task_dir)
        row_01 = table.by_id.get("01")
        if row_01 is None:
            raise ValueError("Brak wiersza ID-T=01 w tasks.md.")
        original_tasks = tasks_md.read_text(encoding="utf-8")
    session_backups = _snapshot_sessions(atk, task_name=task_dir.name)

    try:
        task_dir.rename(new_dir)
    except Exception as exc:
        raise ValueError(f"Nie mogę zmienić nazwy katalogu: {exc}") from exc

    try:
        if touch_id_t_01:
            _update_tasks_row(
                new_dir / "tasks.md",
                row_line=row_01.line,
                updates={"Status": new_status, "Zaktualizowano": _now_ts()},
            )
        _update_sessions(atk, old_task=task_dir.name, new_task=new_dir.name)
    except Exception as exc:
        try:
            if new_dir.exists() and not task_dir.exists():
                new_dir.rename(task_dir)
        except Exception:
            pass
        if original_tasks is not None:
            try:
                if task_dir.exists():
                    _atomic_write(task_dir / "tasks.md", original_tasks)
                else:
                    _atomic_write(new_dir / "tasks.md", original_tasks)
            except Exception:
                pass
        try:
            _restore_sessions(session_backups)
        except Exception:
            pass
        raise ValueError(f"Nie udało się dokończyć zmiany statusu: {exc}") from exc

    return Result(ok=True, action="move-status", message="Zmieniono status zadania.", path=str(new_dir))


def cmd_assign(args: argparse.Namespace) -> Result:
    root = Path(args.root).resolve()
    atk = _ensure_workspace_root(root)
    tasks_root = atk / "tasks"
    task_dir = tasks_root / args.task
    if not task_dir.is_dir():
        raise ValueError(f"Brak katalogu zadania: {task_dir}")

    table = _load_tasks_table(task_dir)
    _validate_id_t(table, args.id_t)

    r = doctor.Reporter()
    agent_ids = doctor.load_agent_ids(atk / "AGENT_PROFILES.md", r)
    if agent_ids and args.agent not in agent_ids:
        print(f"[warn] Agent `{args.agent}` nie występuje w AGENT_PROFILES.md.", file=sys.stderr)

    row = table.by_id[args.id_t]
    _update_tasks_row(
        task_dir / "tasks.md",
        row_line=row.line,
        updates={"Agent": args.agent, "Zaktualizowano": _now_ts()},
    )

    return Result(ok=True, action="assign", message="Zaktualizowano kolumnę Agent.", path=str(task_dir / "tasks.md"))


def cmd_set_id_t_status(args: argparse.Namespace) -> Result:
    root = Path(args.root).resolve()
    atk = _ensure_workspace_root(root)
    tasks_root = atk / "tasks"
    task_dir = tasks_root / args.task
    if not task_dir.is_dir():
        raise ValueError(f"Brak katalogu zadania: {task_dir}")

    new_status = args.to
    if new_status not in doctor.ALLOWED_STATUSES:
        raise ValueError(f"Niepoprawny status: {new_status}")

    table = _load_tasks_table(task_dir)
    _validate_id_t(table, args.id_t)

    row = table.by_id[args.id_t]
    if row.status == new_status:
        raise ValueError(f"Status już ustawiony na {new_status}.")

    updates = {"Status": new_status, "Zaktualizowano": _now_ts()}

    if args.agent is not None:
        if not args.agent.strip():
            raise ValueError("Agent nie może być pusty.")
        r = doctor.Reporter()
        agent_ids = doctor.load_agent_ids(atk / "AGENT_PROFILES.md", r)
        if agent_ids and args.agent not in agent_ids:
            print(f"[warn] Agent `{args.agent}` nie występuje w AGENT_PROFILES.md.", file=sys.stderr)
        updates["Agent"] = args.agent

    _update_tasks_row(
        task_dir / "tasks.md",
        row_line=row.line,
        updates=updates,
    )

    return Result(
        ok=True,
        action="set-id-t-status",
        message="Zmieniono status ID-T.",
        path=str(task_dir / "tasks.md"),
    )


def _parse_handoff_ids(value: str) -> list:
    return [part.strip() for part in value.split(",") if part.strip()]


def _merge_handoff_ids(existing: list, new_ids: list) -> list:
    seen = set()
    merged = []
    for item in existing + new_ids:
        if item in seen:
            continue
        seen.add(item)
        merged.append(item)
    return merged


def _canonical_handoff(ids: list) -> str:
    return "[HANDOFF: " + ", ".join(ids) + "]"


def cmd_handoff_add(args: argparse.Namespace) -> Result:
    root = Path(args.root).resolve()
    atk = _ensure_workspace_root(root)
    tasks_root = atk / "tasks"
    task_dir = tasks_root / args.task
    if not task_dir.is_dir():
        raise ValueError(f"Brak katalogu zadania: {task_dir}")

    table = _load_tasks_table(task_dir)
    _validate_id_t(table, args.id_t)

    row = table.by_id[args.id_t]
    tasks_md = task_dir / "tasks.md"
    line_text = tasks_md.read_text(encoding="utf-8").splitlines()[row.line - 1]
    cells = [p.strip() for p in line_text.split("|")][1:-1]
    notes_idx = doctor.EXPECTED_TASKS_HEADER.index("Co zrobiono do tej pory")
    existing_notes = cells[notes_idx]

    match = re.search(r"\[handoff:\s*([^\]]+)\]", existing_notes, flags=re.IGNORECASE)
    existing_ids = _parse_handoff_ids(match.group(1)) if match else []
    new_ids = _parse_handoff_ids(args.to)
    for target_id in new_ids:
        if target_id not in table.by_id:
            raise ValueError(f"HANDOFF wskazuje na nieistniejący ID-T: {target_id}")
    merged = _merge_handoff_ids(existing_ids, new_ids)
    if not merged:
        raise ValueError("Brak ID-T w --to.")
    canonical = _canonical_handoff(merged)

    if match:
        updated_notes = re.sub(r"\[handoff:\s*[^\]]+\]", canonical, existing_notes, flags=re.IGNORECASE)
    else:
        updated_notes = (existing_notes + " " + canonical).strip()

    _update_tasks_row(
        tasks_md,
        row_line=row.line,
        updates={"Co zrobiono do tej pory": updated_notes, "Zaktualizowano": _now_ts()},
    )

    notes_dir = task_dir / "additional-notes"
    notes_dir.mkdir(parents=True, exist_ok=True)
    notes_file = notes_dir / f"{args.id_t}.md"
    if notes_file.exists():
        txt = notes_file.read_text(encoding="utf-8")
        if re.search(r"\[handoff:\s*[^\]]+\]", txt, flags=re.IGNORECASE):
            txt2 = re.sub(r"\[handoff:\s*[^\]]+\]", canonical, txt, flags=re.IGNORECASE)
        else:
            txt2 = f"{canonical}\n\n{txt}"
    else:
        txt2 = f"{canonical}\n"
    _atomic_write(notes_file, txt2)

    return Result(ok=True, action="handoff-add", message="Dodano HANDOFF.", path=str(tasks_md))


def cmd_archive(args: argparse.Namespace) -> Result:
    root = Path(args.root).resolve()
    atk = _ensure_workspace_root(root)
    tasks_root = atk / "tasks"
    task_dir = tasks_root / args.task
    if not task_dir.is_dir():
        raise ValueError(f"Brak katalogu zadania: {task_dir}")

    status = _parse_task_dir_status(task_dir)
    if status != "done" and not args.force:
        raise ValueError("Archiwizacja dozwolona tylko dla *_done (użyj --force).")

    archive_root = tasks_root / "_archive"
    archive_root.mkdir(parents=True, exist_ok=True)
    dest_dir = archive_root / task_dir.name
    if dest_dir.exists():
        raise ValueError(f"Docelowy katalog już istnieje: {dest_dir}")

    task_dir.rename(dest_dir)
    _clear_sessions(atk, task_name=task_dir.name)

    return Result(ok=True, action="archive", message="Zarchiwizowano zadanie.", path=str(dest_dir))


def _print_result(result: Result, *, as_json: bool) -> None:
    if as_json:
        print(json.dumps(asdict(result), ensure_ascii=False, indent=2, sort_keys=True))
        return
    tag = "[ok]" if result.ok else "[error]"
    if result.path:
        print(f"{tag} {result.action}: {result.message} ({result.path})")
    else:
        print(f"{tag} {result.action}: {result.message}")
    if result.warnings:
        for warning in result.warnings:
            print(f"[warn] {warning}", file=sys.stderr)
    if result.validation and isinstance(result.validation, dict):
        summary = result.validation.get("summary")
        if isinstance(summary, dict):
            errors = summary.get("errors")
            warnings = summary.get("warnings")
            print(f"[validation] errors={errors} warnings={warnings}", file=sys.stderr)


def main(argv: Optional[list] = None) -> int:
    parser = argparse.ArgumentParser(description="taskctl: CLI do zarządzania tasks/SESSION.")
    parser.add_argument("--root", default=".", help="Root workspace (domyślnie: .)")
    parser.add_argument("--json", action="store_true", help="Wypisz wynik jako JSON.")
    sub = parser.add_subparsers(dest="command", required=True)
    preferred_order = ["proposal", "to-do", "planning", "planned", "in-progress", "on-hold", "done"]
    remaining = sorted(set(doctor.ALLOWED_STATUSES) - set(preferred_order))
    allowed_statuses = "/".join([s for s in preferred_order if s in doctor.ALLOWED_STATUSES] + remaining)

    p_new = sub.add_parser("new", help="Utwórz nowe zadanie z template-task_proposal.")
    p_new.add_argument("--title", required=True, help="Tytuł zadania.")
    p_new.add_argument(
        "--id",
        help="ID-Z (np. 20260126-1910-nazwa). Jeśli brak, generowane z daty, godziny i tytułu.",
    )
    p_new.add_argument("--template", default="template-task_proposal", help="Nazwa template w task-templates/.")

    p_set = sub.add_parser("set-session", help="Ustaw current-task/current-id-t w SESSION*.md.")
    p_set.add_argument("--task", required=True, help="Nazwa katalogu zadania (np. 20260126-1910-foo_proposal).")
    p_set.add_argument("--id-t", required=True, dest="id_t", help="ID-T do ustawienia (np. 01).")
    p_set.add_argument("--agent", help="ID agenta (tworzy SESSION_<AGENT>.md).")

    p_move = sub.add_parser(
        "move-status",
        help="Zmień status zadania (zmiana sufiksu katalogu; domyślnie bez edycji ID-T=01).",
    )
    p_move.add_argument("--task", required=True, help="Nazwa katalogu zadania (np. 20260126-1910-foo_proposal).")
    p_move.add_argument("--to", required=True, help=f"Docelowy status ({allowed_statuses}).")
    p_move.add_argument(
        "--touch-id-t-01",
        action="store_true",
        help="Legacy: zaktualizuj wiersz ID-T=01 w tasks.md (status + Zaktualizowano).",
    )

    p_set_id = sub.add_parser("set-id-t-status", help="Zmień Status wiersza ID-T w tasks.md.")
    p_set_id.add_argument("--task", required=True, help="Nazwa katalogu zadania.")
    p_set_id.add_argument("--id-t", required=True, dest="id_t", help="ID-T do aktualizacji (np. 01).")
    p_set_id.add_argument("--to", required=True, help=f"Docelowy status ({allowed_statuses}).")
    p_set_id.add_argument("--agent", help="Opcjonalnie ustaw `Agent` w tym samym kroku.")

    p_assign = sub.add_parser("assign", help="Przypisz agenta do ID-T.")
    p_assign.add_argument("--task", required=True, help="Nazwa katalogu zadania.")
    p_assign.add_argument("--id-t", required=True, dest="id_t", help="ID-T do aktualizacji (np. 01).")
    p_assign.add_argument("--agent", required=True, help="ID agenta (np. api-1).")

    p_handoff = sub.add_parser("handoff", help="Operacje HANDOFF.")
    handoff_sub = p_handoff.add_subparsers(dest="handoff_cmd", required=True)
    p_handoff_add = handoff_sub.add_parser("add", help="Dodaj HANDOFF do wiersza tasks.md.")
    p_handoff_add.add_argument("--task", required=True, help="Nazwa katalogu zadania.")
    p_handoff_add.add_argument("--id-t", required=True, dest="id_t", help="ID-T źródłowy.")
    p_handoff_add.add_argument("--to", required=True, help="Lista ID-T docelowych (np. 02, 03-01).")

    p_archive = sub.add_parser("archive", help="Archiwizuj zadanie do tasks/_archive.")
    p_archive.add_argument("--task", required=True, help="Nazwa katalogu zadania.")
    p_archive.add_argument("--force", action="store_true", help="Pozwól archiwizować zadania bez sufiksu _done.")

    args = parser.parse_args(argv)

    try:
        root = Path(args.root).resolve()
        if args.command == "new":
            result = cmd_new(args)
        elif args.command == "set-session":
            result = cmd_set_session(args)
        elif args.command == "move-status":
            result = cmd_move_status(args)
        elif args.command == "set-id-t-status":
            result = cmd_set_id_t_status(args)
        elif args.command == "assign":
            result = cmd_assign(args)
        elif args.command == "handoff":
            if args.handoff_cmd == "add":
                result = cmd_handoff_add(args)
            else:
                raise ValueError(f"Nieznane polecenie HANDOFF: {args.handoff_cmd}")
        elif args.command == "archive":
            result = cmd_archive(args)
        else:
            raise ValueError(f"Nieznane polecenie: {args.command}")
        exit_code = 0
        if result.ok:
            v_code, payload, warnings = _run_doctor(root)
            if v_code != 0:
                result = Result(
                    ok=False,
                    action=result.action,
                    message="Operacja wykonana, ale walidacja (doctor) wykryła błędy.",
                    path=result.path,
                    warnings=warnings or None,
                    validation=payload or None,
                )
                exit_code = 1
            else:
                result = Result(
                    ok=True,
                    action=result.action,
                    message=result.message,
                    path=result.path,
                    warnings=warnings or None,
                    validation=payload or None,
                )
        _print_result(result, as_json=args.json)
        return exit_code
    except ValueError as exc:
        if args.json:
            print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False, indent=2))
        else:
            print(f"[error] {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
