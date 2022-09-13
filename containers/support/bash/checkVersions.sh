#!/usr/bin/env bash

shopt -s globstar

function printFile () {
    echo -n $1 | sed "s|^project/||"
}

function displayWithColumns () {
    firstColumnWidth=$(cat $1 | cut -d$'\t' -f 1 | wc -L)
    sort -t$'\t' -k 2,2 $1 | awk -F $'\t' '{ printf("%-'${firstColumnWidth}'s %s\n", $1, $2)}'
    echo
}

function getVersionLines () {
    cmd1="grep -h -E '$2' '$1'"

    cmd2=""
    if [ $# -eq 4 ]; then
        cmd2="| grep -v '$4'"
    fi

    cmd3="| sed \"s|^|$(printFile $1):\t|\""

    eval "$cmd1 $cmd2 $cmd3 >> $3"
}

echo "Update the following docker-compose images:"
rm -f compose2.txt
for file in project/**/docker-compose.yml; do
    getVersionLines "$file" 'image: .+:' compose2.txt
done
displayWithColumns compose2.txt

echo "Update the following Dockerfile versions:"
rm -f dockerfile.txt
for file in project/containers/**/Dockerfile; do
    getVersionLines "$file" 'FROM .+:.*[0-9]' dockerfile.txt
done
displayWithColumns dockerfile.txt

echo "Update the following package.json dependencies:"
rm -f package.txt
for file in project/containers/**/package.json; do
    getVersionLines "$file" '[0-9]+",?$' package.txt '"version": "[0-9]'
done
displayWithColumns package.txt
echo