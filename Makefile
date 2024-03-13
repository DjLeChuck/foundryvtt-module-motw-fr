.PHONY: workon clear unpack extract generate
PACK_DIRS := ./_packs/sources

workon:
	@fvtt package workon motw-fr --type Module

clear:
	@fvtt package clear

unpack:
	@make -s workon
	@echo "Unpack compendiums..."
	@for dir in $(shell ls ${PACK_DIRS}); do \
		fvtt package unpack --yaml --in _packs/sources --out _packs/targets/$$dir $$dir >/dev/null; \
	done
	@make -s clear

extract:
	@echo "Extraction des fichiers au format YAML..."
	@python3 extract-packs.py

generate:
	@echo "Génération des fichiers JSON..."
	@python3 generate-files.py
