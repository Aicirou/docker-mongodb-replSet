#!/bin/bash

set -e

MAX_ATTEMPTS=30
RETRY_INTERVAL=2

wait_for_mongodb() {
    local attempt=1
    while [ $attempt -le $MAX_ATTEMPTS ]; do
        if mongosh --quiet --eval "db.serverStatus().ok" > /dev/null 2>&1; then
            return 0
        fi
        echo "Attempt $attempt: Waiting for MongoDB to start..."
        sleep $RETRY_INTERVAL
        attempt=$((attempt + 1))
    done
    return 1
}

(
    if ! wait_for_mongodb; then
        echo "Failed to connect to MongoDB"
        exit 1
    fi

    echo "MongoDB is running"

    if [ "${IS_PRIMARY}" = "true" ]; then
        echo "Initializing replica set..."
        mongosh --quiet --eval '
            rs.initiate({
                _id: "rs0",
                members: [
                    { _id: 0, host: "mongo1:27017", priority: 3 },
                    { _id: 1, host: "mongo2:27017", priority: 2 },
                    { _id: 2, host: "mongo3:27017", priority: 1 }
                ]
            })
        '

        echo "Waiting for replica set to stabilize..."
        until mongosh --quiet --eval 'rs.status().members.some(m => m.stateStr === "PRIMARY")' | grep -q "true"; do
            sleep 2
        done
        
        sleep 10
        
        echo "Creating users..."
        mongosh --quiet --eval "
            db.getSiblingDB('admin').createUser({
                user: '${ADMIN_USERNAME}',
                pwd: '${ADMIN_PASSWORD}',
                roles: [{ role: 'root', db: 'admin' }]
            });
        "

        if mongosh --quiet admin -u "${ADMIN_USERNAME}" -p "${ADMIN_PASSWORD}" --eval "db.version()"; then
            echo "Admin user verified, creating common user..."
            mongosh --quiet admin -u "${ADMIN_USERNAME}" -p "${ADMIN_PASSWORD}" --eval "
                db.getSiblingDB('${COMMON_DATABASE}').createUser({
                    user: '${COMMON_USERNAME}',
                    pwd: '${COMMON_PASSWORD}',
                    roles: [
                        { role: 'readWrite', db: '${COMMON_DATABASE}' },
                        { role: 'dbAdmin', db: '${COMMON_DATABASE}' }
                    ]
                });
            "
            
            # Verify common user creation
            echo "Verifying common user access..."
            if mongosh --quiet ${COMMON_DATABASE} -u "${COMMON_USERNAME}" -p "${COMMON_PASSWORD}" --eval "db.auth('${COMMON_USERNAME}', '${COMMON_PASSWORD}')"; then
                echo "Common user verified successfully"
                touch /data/db/.initialized
            else
                echo "Failed to verify common user"
                exit 1
            fi
        else
            echo "Failed to verify admin user"
            exit 1
        fi
    fi
) &
