#!/bin/bash
sleep 10
mongo --host mongo-primary:27017 <<EOF
rs.initiate($(cat /docker-entrypoint-initdb.d/replSet.config))
EOF
