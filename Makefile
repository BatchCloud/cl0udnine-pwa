MAKE = make --no-print-directory
PHP = docker-compose exec php

# Colors
GREEN	 := $(shell tput -Txterm setaf 2)
WHITE	 := $(shell tput -Txterm setaf 7)
YELLOW	 := $(shell tput -Txterm setaf 3)
CYAN_BG	 := $(shell tput -Txterm setab 6)
GREEN_BG := $(shell tput -Txterm setab 2)
RESET	 := $(shell tput -Txterm sgr0)

# PROCESS PARAMETERS/OPTIONS ###########################################################################################

ifeq (cli,$(firstword $(MAKECMDGOALS)))
	ifndef container
		CONTAINER := php
	else
		CONTAINER := $(container)
	endif
endif

# HELP #################################################################################################################

# Add the following 'help' target to your Makefile
# And add help text after each target name starting with '\#\#'
# A category can be added with @category
HELP_FUN = \
	%help; \
	while(<>) { push @{$$help{$$2 // 'options'}}, [$$1, $$3] if /^([a-zA-Z\-]+)\s*:.*\#\#(?:@([a-zA-Z\-]+))?\s(.*)$$/ }; \
	print "usage: make [target]\n\n"; \
	for (sort keys %help) { \
	print "${WHITE}$$_:${RESET}\n"; \
	for (@{$$help{$$_}}) { \
	$$sep = " " x (32 - length $$_->[0]); \
	print "  ${YELLOW}$$_->[0]${RESET}$$sep${GREEN}$$_->[1]${RESET}\n"; \
	}; \
	print "\n"; }

help: ##@other Show this help.
	@perl -e '$(HELP_FUN)' $(MAKEFILE_LIST)
.PHONY: help


# CONTAINER ############################################################################################################

start: ##@container start containers
	docker-compose up -d
.PHONY: start

stop: ##@container stop containers
	docker-compose stop -t 1
.PHONY: stop

restart: ##@container restart containers
	$(MAKE) stop
	$(MAKE) start
.PHONY: restart

setup: ##@container Create dev enviroment
	[[ -f .env ]] || cp .env.dist .env
	$(MAKE) start
.PHONY: setup

rebuild: ##@container removes images
	docker-compose down --rmi all
	$(MAKE) setup
.PHONY: rebuild

logs: ##@container show server logs
	docker-compose logs -f --tail=all
.PHONY: logs

cli: ##@container get shell in a container (defaults: php, make cli container=php)
	docker-compose exec $(CONTAINER) /bin/sh
.PHONY: cli