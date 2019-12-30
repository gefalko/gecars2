#!/bin/sh

# Wait until mongo logs that it's ready (or timeout after 60s)
COUNTER=0
while !(nc -z localhost 27017) && [[ $COUNTER -lt 60 ]] ; do
    sleep 2
    let COUNTER+=2
    echo "Waiting for mongo to initialize... ($COUNTER seconds so far)"
donexec $cmd
