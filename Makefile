.PHONY: up down build be fe sh rc test

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

rails_c:
	docker compose exec backend bin/rails console

test:
	docker compose exec backend bundle exec rspec
