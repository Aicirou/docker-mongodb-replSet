#!/bin/bash
set -e

MAX_RETRIES=30
RETRY_INTERVAL=2

# Wait for all nodes
for host in mongo1 mongo2 mongo3; do
  retry=0
  while ! mongosh --host "$host" --quiet --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
    ((retry++))
    if [ $retry -eq $MAX_RETRIES ]; then
      echo "Failed to connect to $host"
      exit 1
    fi
    echo "Waiting for $host... ($retry/$MAX_RETRIES)"
    sleep $RETRY_INTERVAL
  done
  echo "$host is ready"
done

# Initialize replica set
mongosh --quiet --eval "rs.status()" || mongosh --quiet --eval "rs.initiate($(cat /scripts/replSet.json))"

# Wait for replica set to stabilize
until mongosh --quiet --eval "rs.status().ok" | grep -q "1"; do
  echo "Waiting for replica set to initialize..."
  sleep 2
done

echo "Replica set initialization completed successfully"
