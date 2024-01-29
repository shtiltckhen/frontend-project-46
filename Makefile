install:
	npm ci

gendiff:
	node bin/gendiff.js

publish:
	npm publish --dry-run
	npm link --force

lint:
	npx eslint .

test:
	npx jest

test-coverage:
	npx jest --coverage --coverageProvider=v8