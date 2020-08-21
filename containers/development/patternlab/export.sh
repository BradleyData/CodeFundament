#!/usr/bin/env bash

pageLocation="04-pages-"

rm -rf app/pattern_exports/*

cp app/www/favicon.ico app/pattern_exports/
cp app/www/css/style.css app/pattern_exports/
cp app/www/js/app.js app/pattern_exports/

for file in app/www/patterns/$pageLocation*/*.markup-only.html; do
    filenameSansLocation="${file##*/$pageLocation}"
    filenameSansMarkup="${filenameSansLocation//.markup-only/}"
    filenameWithPath="${filenameSansMarkup//-/\/}"

    path="${filenameWithPath%/*.*}"
    if [ "$path" == "$filenameWithPath" ]; then
        path=""
    fi

    mkdir -p "app/pattern_exports/$path"
    cat html_export_prefix.htm "$file" html_export_postfix.htm > "app/pattern_exports/$filenameWithPath"
done