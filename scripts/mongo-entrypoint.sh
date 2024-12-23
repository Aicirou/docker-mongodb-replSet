#!/bin/bash

# Configuration
readonly MONGO_LOG="/var/logs/mongodb.log"
readonly INIT_TIMEOUT=30
readonly REPLICA_SET_NAME="rs0"

# Logging functions
log_info() { echo "[INFO] $(date -u '+%Y-%m-%d %H:%M:%S UTC') - $*"; }
log_error() { echo "[ERROR] $(date -u '+%Y-%m-%d %H:%M:%S UTC') - $*"; }

# Cleanup handler
cleanup() {
    log_info "Shutting down MongoDB gracefully..."
    if [[ -n "$MONGODB_PID" ]]; then
        kill -TERM "$MONGODB_PID"
        wait "$MONGODB_PID"
    fi
    exit 0
}

# MongoDB startup check
wait_for_mongodb() {
    local timeout=$1
    log_info "Waiting for MongoDB to start (timeout: ${timeout}s)"
    
    for ((i=1; i<=timeout; i++)); do
        if mongosh --quiet --eval "db.adminCommand('ping')" &>/dev/null; then
            log_info "MongoDB started successfully"
            return 0
        fi
        log_info "Waiting... ($i/$timeout)"
        sleep 1
    done
    
    log_error "MongoDB failed to start within ${timeout} seconds"
    return 1
}

# Main execution
main() {
    trap cleanup SIGTERM SIGINT SIGQUIT
    
    # Start MongoDB
    mongod --replSet "${REPLICA_SET_NAME}" --bind_ip_all --logpath "$MONGO_LOG" --logappend &
    MONGODB_PID=$!
    
    # Wait for MongoDB to start
    wait_for_mongodb $INIT_TIMEOUT || exit 1
    
    # Run initialization script
    log_info "Running initialization script"
    if /var/logs/mongo-init.sh; then
        log_info "Initialization completed successfully"
    else
        log_error "Initialization failed"
    fi
    
    # Keep container running
    wait "$MONGODB_PID"
}

# Execute main function
main