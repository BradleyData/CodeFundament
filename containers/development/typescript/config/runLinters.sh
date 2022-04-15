#!/usr/bin/env bash

getFiles() {
    echo $(find "$1" -type f ! -name '*.gql' 2>/dev/null)
}

path=$(getFiles 'app/src/')
path="${path} $(getFiles 'app/acceptanceTests/steps/')"

prettier --config config/shared/.prettierrc.json --ignore-path 'config/prettierignore' --write ${path} && resultP=true || resultP=false
eslint --report-unused-disable-directives --fix --config config/.eslintrc.json ${path} && resultE=true || resultE=false

echo
if $resultP && $resultE; then
    echo 'All files passed!'
    exit 0
fi
echo 'Something failed.'
exit 2
