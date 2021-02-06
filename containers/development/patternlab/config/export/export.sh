#!/usr/bin/env bash

pageLocation="pages-"

rm -rf `ls -d /home/node/app/pattern_exports/* | grep -v /home/node/app/pattern_exports/assets`

cp /home/node/app/www/favicon.ico /home/node/app/pattern_exports/
cp /home/node/app/www/css/style.css /home/node/app/pattern_exports/
cp /home/node/app/www/js/app.js /home/node/app/pattern_exports/

for file in /home/node/app/www/patterns/$pageLocation*/*.markup-only.html; do
    filenameSansLocation="${file##*/$pageLocation}"
    filenameSansMarkup="${filenameSansLocation//.markup-only/}"
    filenameWithPath="${filenameSansMarkup//-/\/}"

    path="${filenameWithPath%/*.*}"
    if [ "$path" == "$filenameWithPath" ]; then
        path=""
    fi

    mkdir -p "/home/node/app/pattern_exports/$path"
    cat /home/node/config/export/html_export_prefix.htm "$file" /home/node/config/export/html_export_postfix.htm > "/home/node/app/pattern_exports/$filenameWithPath"
done
