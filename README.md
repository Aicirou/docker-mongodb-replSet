````markdown
# MongoDB Replica Set with Docker

A production-ready MongoDB replica set implementation using Docker with Python client integration.

## Features

- MongoDB 3-node replica set
- Automatic primary/secondary configuration
- Security with keyfile authentication
- Python client with OOP design
- Rich CLI interface
- Connection retry mechanism
- Server info caching
- Health checks for all services

## Prerequisites

- Docker and Docker Compose
- Python 3.8+
- Available ports: 27017, 27018, 27019

## Quick Start

1. Clone the repository

```bash
git clone <repository-url>
cd mongodb-docker-replset
```
````

2. Start the MongoDB cluster

```bash
docker-compose up -d
```

3. Wait for initialization (about 30-60 seconds)

4. Run the Python client

```bash
docker-compose run api
```

## Architecture

- **mongo1**: Primary node (by default)
- **mongo2, mongo3**: Secondary nodes
- **api**: Python client application

### Security Features

- Keyfile authentication between nodes
- User authentication required
- Role-based access control
- SSL/TLS support (commented out by default)

### Configuration

#### Basic Configuration

- Replica Set Name: rs0
- Authentication Database: admin
- Common Database: commonDB
- Default Users:
  - Admin user (root access)
  - Common user (specific database access)

#### Advanced Configuration (Commented Out)

- Connection pooling
- Timeout settings
- Journal settings
- Operation profiling

## Development vs Production

The repository includes both development and production configurations. Production settings are commented out by default and can be enabled by uncommenting the relevant sections in:

- main.py (MongoDBConfig.advanced_settings)
- mongod.conf
- docker-compose.yml

## Monitoring and Maintenance

### Health Checks

- MongoDB replica set status
- Node connectivity
- Authentication verification
- Python client connection

### Logging

Rich console output provides:

- Connection status
- Operation results
- Error messages

## Troubleshooting

Common issues and solutions:

1. **Replica Set Not Initializing**

   - Check logs: `docker-compose logs mongo1`
   - Ensure all containers are running
   - Verify network connectivity

2. **Authentication Failures**
   - Verify environment variables
   - Check user credentials
   - Ensure keyfile is properly generated

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request
