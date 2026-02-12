.PHONY: prepare deps up up-d down clean logs sh test lint

UID ?= $(shell id -u)
GID ?= $(shell id -g)

DC = env UID=$(UID) GID=$(GID) docker compose

prepare:
	@mkdir -p node_modules

deps: prepare
	@if [ -f package-lock.json ]; then \
		$(DC) run --rm gui npm ci; \
	else \
		$(DC) run --rm gui npm install; \
	fi

up: deps
	$(DC) up --build

up-d: deps
	$(DC) up --build -d

down: prepare
	$(DC) down --remove-orphans

clean: prepare
	$(DC) down -v --remove-orphans

logs: prepare
	$(DC) logs -f --tail=200 gui

sh: prepare
	$(DC) run --rm gui bash

test: prepare
	$(DC) run --rm gui npm run test -- --watch=false

lint: prepare
	$(DC) run --rm gui npm run lint
