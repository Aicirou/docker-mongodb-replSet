#!/bin/bash
set -e

# Start MongoDB
mongod --replSet "rs0" --bind_ip_all &
pid=$!

# Wait for MongoDB to start
until mongosh --quiet --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
  echo "Waiting for MongoDB to start..."
  sleep 2
done

# Initialize replica set
./scripts/mongo-init.sh

# Keep container running
wait $pid