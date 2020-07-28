# API
## NPM Scripts
### compile
The container is configured to watch files in **app/src**, recompile when they change, and then restart the node.js server.
If for some reason that doesn't work, this allows for manual compilation.
### document
Creates HTML documentation from the code.
### lint
Runs prettier and eslint against all *.ts files in **app/src** and **app/acceptanceTests**.
### unitTests
Runs the full suite of unit tests against everything in **app/src** and generates code coverage.
**index.ts** is the only file excluded from all testing and should be kept as small as possible.
There is no minimum code coverage expectation because mutation testing does a better job.
### mutationTests
Runs mutation testing against the unit tests and expects 100% of mutations to be caught.
Generates HTML reports that make fixing unit tests simpler. (Simpler does not mean "not painful". TDD is helpful)
### acceptanceTests
Runs the full suite of acceptance tests and generates HTML reports.
## Directory Structure
All of the code is in a volume mounted to **app**. Everything else is part of the container and will be reset when the container is restarted/rebuilt.
### app/acceptanceTests
Gherkin feature files and typescript step files go here.
### app/output
Where content generated from the various testing frameworks and code documentors is stored.
This can all be viewed from a web browser.
You shouldn't have to touch anything in here and it is excluded from git.
### app/src
All source code and unit tests go here. They are in the same directory because unit test directory structures often mirror
source directory structures and this keeps things DRY.
### app/www
The compiled/transpiled code that node.js serves as the website.
You shouldn't have to touch anything in here and it is excluded from git.
