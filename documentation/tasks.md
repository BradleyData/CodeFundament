# Tasks
## Check versions
Creates a list of versions hardcoded into files that may need to be updated. This can be used as a checklist when upgrading to be certain nothing is accidentally skipped.
## Initialize postgres database
Creates a default database named `postgres` under the `postgres` user. This must be done before the postgres container can be used.
## Start all containers
This will start all of the containers in the development stack. If the containers are not running then you won't be able to do anything else.
## Stop all containers
This stops all of the containers in the development stack. Unless you are working on multiple projects or have limited resources,
there is very little reason to do this.
## Rebuild container
Allows you to force a container to be rebuilt. This is especially useful when a package-lock.json update has occurred,
but it can also fix a variety of problems. If anything in a container isn't acting correctly, try this to reset it.
## Update API package-lock.json
The package.json and package-lock.json files within the container are instances that get created when the container is built making
updates to package-lock.json difficult. This task simplifies the problem. Make changes to package.json outside of the container and
then run this to build a special container, update package-lock.json, and copy it out of the container.
