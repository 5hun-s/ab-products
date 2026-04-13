.PHONY: up down build be fe

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

be:
	docker compose exec backend bash

fe:
	docker compose exec frontend sh
