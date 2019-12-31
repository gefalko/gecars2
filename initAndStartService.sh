#!/bin/sh

echo "STARTING..."

sleep 30

curl mongo:27017

node /usr/app/dist/insertUpdateDbProviders.js
node /usr/app/dist/insertUpdateDbAutoData.js
node /usr/app/dist/createUpdateSimasFilters.js
node /usr/app/dist/collector.js debug=true email=karka.edgaras@gmail.com
