# MongoDB PSA Architecture Setup with Docker Compose

## Overview
This setup uses Docker Compose to create a MongoDB replica set with Primary, Secondary, and Arbiter nodes (PSA architecture) using MongoDB 4.0.0.

## Files
- `docker-compose.yml`: Defines the MongoDB containers.
- `.env`: Contains environment variables for configuration.
- `replSet.config`: Replica set configuration file.
- `mongo-init.sh`: Script to initialize the replica set.

## Setup

1. Clone the repository and navigate to the project directory.
2. Create a `.env` file with the following content:
    ```env
    MONGO_INITDB_ROOT_USERNAME=root
    MONGO_INITDB_ROOT_PASSWORD=example
    MONGO_INITDB_DATABASE=admin
    REPLICA_SET_NAME=my-mongo-set
    ```
3. Create a `replSet.config` file with the following content:
    ```json
    {
        "_id": "my-mongo-set",
        "members": [
            {
                "_id": 0,
                "host": "mongo-primary:27017"
            },
            {
                "_id": 1,
                "host": "mongo-secondary:27018"
            },
            {
                "_id": 2,
                "host": "mongo-arbiter:27019",
                "arbiterOnly": true
            }
        ]
    }
    ```
4. Create a `mongo-init.sh` script with the following content:
    ```sh
    #!/bin/bash
    sleep 10
    mongo --host mongo-primary:27017 <<EOF
    rs.initiate($(cat /docker-entrypoint-initdb.d/replSet.config))
    EOF
    ```
5. Run `docker-compose up -d` to start the MongoDB containers.
6. Logs can be monitored using the command `docker-compose logs`.

## Accessing MongoDB
- Primary Node: `localhost:27017`
- Secondary Node: `localhost:27018`
- Arbiter Node: `localhost:27019`

## Useful Commands
- `rs.status()`: See the status of the replica set, including which node is primary.
- `mongodump --db={dbname}`: Dump the database into json/bson format.
- `mongorestore --db={dbname} --drop {backups}`: Restore the database from backup and drop the existing database.

## Backup
There is a cron job that runs `mongodump` every day. The backups are located at `/home/ericzeng/mongobackup`.

## Cleanup
To stop and remove the containers, run:
```sh
docker-compose down
