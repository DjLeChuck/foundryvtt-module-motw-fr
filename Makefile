.PHONY: workon clear unpack extract generate

include .env
export

workon:
	@fvtt package workon motw-fr --type Module

clear:
	@fvtt package clear

unpack:
	@make -s workon
	@echo "Unpack compendiums..."
	@for dir in $(shell ls ${PACK_DIRS}); do \
		fvtt package unpack --yaml --in $$PACK_DIRS --out _packs/extractions/$$dir $$dir >/dev/null; \
	done
	@make -s clear

extract:
	@echo "Extraction des fichiers au format YAML..."
	@node _scripts/extract-pack.mjs

generate:
	@echo "Génération des fichiers JSON..."
	@node _scripts/generate-files.mjs
