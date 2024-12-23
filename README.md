# MongoDB Replica Set with Docker

A production-ready MongoDB replica set implementation using Docker Compose, featuring automated initialization, health checks, and proper error handling.

## Features

- 3-node MongoDB replica set (Primary-Secondary-Arbiter)
- Automated initialization and configuration
- Health monitoring
- Volume persistence
- Network isolation
- Production-ready logging

## Prerequisites

- Docker Engine 20.10.0+
- Docker Compose 2.0.0+
- 4GB RAM minimum
- 10GB disk space minimum

## Quick Start

1. Clone the repository:

   ```bash
   git clone <REPO_URL>
   cd <REPO_NAME>
   ```

2. Configure environment:

   ```bash
   cp .env.example .env
   ```

3. Start the cluster:

   ```bash
   docker compose up -d
   ```

4. Verify the setup:
   ```bash
   docker compose logs -f mongo1
   ```

## Architecture

- **mongo1**: Primary node (default)
- **mongo2**: Secondary node
- **mongo3**: Arbiter node

## Configuration

### Ports

- Primary: 27017
- Secondary: 27018
- Arbiter: 27019

### Volumes

- Primary: mongo1-data
- Secondary: mongo2-data

## Monitoring

Health checks are configured for all nodes:

- **Primary**: http://localhost:27017/health
- **Secondary**: http://localhost:27018/health
- **Arbiter**: http://localhost:27019/health

## References

- [MongoDB Replica Set](https://docs.mongodb.com/manual/replication/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Docker Health Checks](https://docs.docker.com/engine/reference/builder/#healthcheck)
