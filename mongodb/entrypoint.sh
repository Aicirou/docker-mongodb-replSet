#!/bin/bash
set -e

# Handle shutdown
_term() {
  echo "Caught SIGTERM signal! Sending graceful termination to MongoDB..."
  mongosh --quiet admin -u "${ADMIN_USERNAME}" -p "${ADMIN_PASSWORD}" --eval "db.shutdownServer()"
}

trap _term SIGTERM

# Clean up lock file if it exists
[ -f /data/db/mongod.lock ] && rm -f /data/db/mongod.lock

# Start MongoDB
mongod -f /etc/mongod.conf &

# Only run init.sh on primary node
if [ "${IS_PRIMARY}" = "true" ]; then
    /init.sh
fi

wait
