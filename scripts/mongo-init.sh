#!/bin/bash

# Configuration
readonly LOGFILE="/var/logs/mongo-init.log"
readonly MAX_RETRIES=5
readonly RETRY_INTERVAL=5
readonly MONGO_HOSTS=("mongo1" "mongo2" "mongo3")

# Logging functions
log_info() { echo "[INFO] $(date -u '+%Y-%m-%d %H:%M:%S UTC') - $*" | tee -a "$LOGFILE"; }
log_error() { echo "[ERROR] $(date -u '+%Y-%m-%d %H:%M:%S UTC') - $*" | tee -a "$LOGFILE"; }
log_success() { echo "[SUCCESS] $(date -u '+%Y-%m-%d %H:%M:%S UTC') - $*" | tee -a "$LOGFILE"; }

# Initialize logging
setup_logging() {
    mkdir -p "$(dirname "$LOGFILE")"
    touch "$LOGFILE"
    chmod 666 "$LOGFILE"
    log_info "Starting MongoDB initialization script"
}

# Check MongoDB instance status
check_mongo_status() {
    local host=$1
    log_info "Checking MongoDB status on $host"
    if mongosh --host "$host" --quiet --eval "db.adminCommand('ping')" &>> "$LOGFILE"; then
        log_success "$host is ready"
        return 0
    else
        log_error "$host is not responding"
        return 1
    fi
}

# Initialize replica set
init_replica_set() {
    log_info "Initializing replica set configuration"
    if mongosh --host mongo1 --quiet --eval "rs.reconfig($(cat /var/logs/replSet.json))" &>> "$LOGFILE"; then
        log_success "Replica set initialized successfully"
        return 0
    else
        log_error "Failed to initialize replica set"
        return 1
    fi
}

# Check replica set status
check_replica_set() {
    log_info "Checking replica set status"
    mongosh --quiet --eval "rs.status()" &>> "$LOGFILE"
}

# Main execution
main() {
    setup_logging
    
    for attempt in $(seq 1 $MAX_RETRIES); do
        log_info "Attempt $attempt of $MAX_RETRIES"
        local all_ready=true
        
        for host in "${MONGO_HOSTS[@]}"; do
            check_mongo_status "$host" || { all_ready=false; break; }
        done
        
        if $all_ready; then
            init_replica_set && {
                sleep 2
                check_replica_set
                log_success "MongoDB replica set initialization completed"
                exit 0
            }
        fi
        
        [[ $attempt -lt $MAX_RETRIES ]] && {
            log_info "Waiting ${RETRY_INTERVAL}s before next attempt..."
            sleep "$RETRY_INTERVAL"
        }
    done
    
    log_error "Failed to initialize after $MAX_RETRIES attempts"
    exit 1
}

# Execute main function
main
