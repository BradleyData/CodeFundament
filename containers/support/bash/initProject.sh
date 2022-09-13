cd project
cp .env.template .env

cd secrets
# Find *.template and copy them while removing the ".template" using Bash string manipulation.
find . -maxdepth 1 -type f -iname "*.template" -exec bash -c 'cp $0 ${0%.template}' {} \;