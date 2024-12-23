# Need To Remember (NTR)

## MongoDB Configuration

### Basic Configuration

- Replica Set Name: `rs0`
- Authentication Database: `admin`
- Common Database: `commonDB`
- Default Users:
  - Admin user (root access)
  - Common user (specific database access)

### Advanced Configuration (Commented Out)

- Connection pooling
- Timeout settings
- Journal settings
- Operation profiling

### Connection Settings

- URI: `mongodb://common:password@mongo1:27017,mongo2:27017,mongo3:27017/commonDB?replicaSet=rs0&authSource=commonDB`
- Max Pool Size: `50`
- Min Pool Size: `10`
- Retry Writes: `True`
- Write Concern: `majority`
- Journal: `True` (commented out for development)

## Docker Configuration

### Services

- **mongo1**: Primary node
- **mongo2, mongo3**: Secondary nodes
- **api**: Python client application

### Health Checks

- MongoDB replica set status
- Node connectivity
- Authentication verification
- Python client connection

### Resource Limits (Commented Out)

- CPU and memory limits for each service
- Ulimits for file descriptors

## Python Client

### Connection Handling

- Use `pymongo.MongoClient` with connection pooling
- Set read preferences using `with_options()`
- Implement retry logic with exponential backoff
- Cache server info to reduce load

### Error Handling

- Handle `ConnectionFailure` and `OperationFailure`
- Use `try-except` blocks for connection and operations
- Display errors using `rich.console.Console`

### Operations

- Insert documents with write concern
- Read documents with primary preferred read preference
- Perform operations with retry logic

## Scripts

### generate-keyfile.sh

- Generate keyfile for MongoDB authentication
- Set proper permissions for keyfile

### entrypoint.sh

- Handle MongoDB startup and shutdown
- Run initialization script on primary node

### init.sh

- Initialize MongoDB replica set
- Create admin and common users
- Verify user creation and access

## Troubleshooting

### Common Issues

1. **Replica Set Not Initializing**

   - Check logs: `docker-compose logs mongo1`
   - Ensure all containers are running
   - Verify network connectivity

2. **Authentication Failures**

   - Verify environment variables
   - Check user credentials
   - Ensure keyfile is properly generated

3. **Connection Errors**

   - Ensure MongoDB URI is correctly set
   - Verify network connectivity and MongoDB service status

4. **Read/Write Errors**
   - Set read preferences at the collection level
   - Set write concern at the client configuration level

## Commands

### Docker Commands

- Start the MongoDB cluster: `docker-compose up -d`
- Stop the MongoDB cluster: `docker-compose down`
- Rebuild the containers: `docker-compose build`
- View logs: `docker-compose logs -f`

### Python Commands

- Install dependencies: `pip install -r requirements.txt`
- Run the script: `python main.py`

## Documentation

### README.md

- Setup instructions
- Architecture overview
- Security features
- Configuration details
- Monitoring and maintenance
- Troubleshooting
- Contributing guidelines
- License information

### NOTES.md

- Problem and solution format
- Code examples for common issues
- Detailed explanations for each solution
