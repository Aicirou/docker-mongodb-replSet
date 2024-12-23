# Dockerized MongoDB Replica Set with Express.js

## Overview

This project demonstrates setting up a MongoDB replica set using Docker and Docker Compose, and connecting it to an Express.js application. The setup includes three MongoDB instances and an Express.js server that interacts with the replica set.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Endpoints](#endpoints)
- [Replica Set Configuration](#replica-set-configuration)
- [Configuring Internal Docker Hostname with Local Device](#configuring-internal-docker-hostname-with-local-device)
- [Troubleshooting](#troubleshooting)
- [Getting Help](#getting-help)

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/Aicirou/docker-mongodb-replSet.git
cd docker-mongodb-replSet
```

### 2. Build and Start the Docker Containers

```sh
docker compose up --build
```

### 3. Initialize the MongoDB Replica Set

#### Connect to the `mongo1` Container

```sh
docker exec -it mongo1 mongosh
```

#### Initiate the Replica Set

```javascript
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017", priority: 2 },
    { _id: 1, host: "mongo2:27017", priority: 1 },
    { _id: 2, host: "mongo3:27017", priority: 1 },
  ],
})
```

### Combining the above commands

```sh
docker exec -it mongo1 mongo --eval 'rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27017", priority: 2 },
    { _id: 1, host: "mongo2:27017", priority: 1 },
    { _id: 2, host: "mongo3:27017", priority: 1 },
  ],
})'
```

## Running the Application

### 1. Restart the Express.js Server

```sh
docker compose restart <express-service-name>
docker compose logs -f <express-service-name>
# output:
# ...
# [nodemon] starting `node index.js`
# Mongoose connecting to the replica set...
# Mongoose connected to the replica set!
# Server running on port 3000
```

### 2. Access the Application

Open `http://localhost:3000` in a web browser to view the Express.js application.

## Endpoints

- **GET `/`**: Displays database info
- **GET `/health`**: Performs a health check of the application

## Replica Set Configuration

The replica set is configured with three members:

- `mongo1:27017` (Primary)
- `mongo2:27017` (Secondary)
- `mongo3:27017` (Secondary)

## Configuring Internal Docker Hostname with Local Device

### Purpose

- Enables communication between Docker containers and local machine using custom hostnames
- Resolves DNS name resolution issues between Docker and host machine
- Facilitates development and testing of containerized applications

### How It Works

1. The `/etc/hosts` file serves as a local DNS lookup table.
2. Adding entries maps hostnames to IP addresses locally.
3. Docker containers can then resolve these hostnames to the host machine.

### Key Benefits

- Simulates production environment locally
- Enables testing of domain-specific features
- Improves development workflow
- Avoids need for public DNS records

### Usage Notes

- Requires root/admin privileges to edit `/etc/hosts`
- Changes are immediate, no system restart needed
- Entries persist until manually removed
- Format: `127.0.0.1 your-hostname`

### Best Practices

- Keep backup of original hosts file
- Document any custom entries added
- Remove entries when no longer needed
- Use consistent naming conventions

## Troubleshooting

### MongoDB Connection Issues

- Verify replica set configuration
- Check MongoDB logs for errors
- Restart the MongoDB containers

### Express.js Server Issues

- Check server logs for errors
- Verify connection string in `server.js`
- Restart the Express.js container
- Verify local hosts file entries, e.g., `127.0.0.1 mongo1 mongo2 mongo3`

## Getting Help

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
