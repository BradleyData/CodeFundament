#!/usr/bin/env bash

prettier --config config/shared/.prettierrc.json --ignore-path config/.prettierignore --write 'app/(src|helpers)/**/!(*.hbs)' && \
prettier --config config/shared/.prettierrc.json --ignore-path config/.prettierignore --write --parser 'html' 'app/(src|helpers)/**/*.hbs' && \
eslint --report-unused-disable-directives --fix --config config/.eslintrc.json 'app/src/**/*.ts' && \
echo 'All files passed!'
