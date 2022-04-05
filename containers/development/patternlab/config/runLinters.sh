#!/usr/bin/env bash

prettier --config config/shared/.prettierrc.json --html-whitespace-sensitivity strict --ignore-path config/.prettierignore --write 'app/(src|helpers)/**/*' && \
eslint --report-unused-disable-directives --fix --config config/.eslintrc.json 'app/src/**/*.ts' && \
echo 'All files passed!'
