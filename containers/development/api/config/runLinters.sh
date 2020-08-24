#!/usr/bin/env bash

prettier --config config/shared/.prettierrc.json --write 'app/acceptanceTests/steps/**/**' 'app/src/**/**' && \
eslint --report-unused-disable-directives --fix --config config/.eslintrc.json 'app/acceptanceTests/steps/**/**' 'app/src/**/**' && \
echo 'All files passed!'
