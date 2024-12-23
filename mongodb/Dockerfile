FROM mongo:latest

# Create directories with correct permissions first
RUN mkdir -p /opt/keyfile  && \
    chown -R mongodb:mongodb /opt/keyfile

# Copy and setup configuration/scripts
COPY mongod.conf /etc/mongod.conf
COPY generate-keyfile.sh /generate-keyfile.sh
COPY init.sh /init.sh
COPY entrypoint.sh /entrypoint.sh

# Set up permissions and generate keyfile
RUN chmod +x /generate-keyfile.sh /init.sh /entrypoint.sh && \
    bash /generate-keyfile.sh && \
    chown -R mongodb:mongodb /etc/mongod.conf /opt/keyfile

USER mongodb

ENTRYPOINT ["/entrypoint.sh"]
