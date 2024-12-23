#!/bin/bash
set -e

KEYFILE_PATH="/opt/keyfile/mongo-keyfile"
KEYFILE_DIR="/opt/keyfile"

# Ensure directory exists and has correct permissions
mkdir -p $KEYFILE_DIR
chmod 750 $KEYFILE_DIR

# Generate keyfile
openssl rand -base64 756 > $KEYFILE_PATH

# Set proper permissions for keyfile
chmod 400 $KEYFILE_PATH
chown -R mongodb:mongodb $KEYFILE_DIR
