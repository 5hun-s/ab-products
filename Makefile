.PHONY: up down build be fe sh rc test rubocop fe_test fe_lint

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

rubocop:
	docker compose exec backend bundle exec rubocop

rubocop_fix:
	docker compose exec backend bundle exec rubocop -A

fe_test:
	docker compose exec frontend npm test

fe_lint:
	docker compose exec frontend npm run lint
