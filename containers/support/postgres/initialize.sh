#!/usr/bin/env bash

afterStartup() {
    killall postgres
    killall tail
    kill $1
}

afterShutdown() {
    killall tail
    kill $1
}

touch output.log
/usr/local/bin/docker-entrypoint.sh postgres 2> >(tee -a output.log >&2) &
tail -n +0 -f output.log | grep "ready" | (read -t 30 a; afterStartup $$)
tail -n +0 -f output.log | grep "system is shut down" | (read -t 30 a; afterShutdown $$)
