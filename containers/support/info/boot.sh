#!/usr/bin/env sh

# Replace the placeholder with the IP address.
sed -i "s/BROWSERSYNC_IP/`host patternlab | sed "s/[A-Za-z ]//g"`/g" htdocs/index.html

httpd-foreground