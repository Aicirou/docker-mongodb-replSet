import os
import pymongo
from rich.console import Console
from rich.panel import Panel
from cachetools import TTLCache, cached
from typing import Optional, Dict, Any

# from functools import wraps
# import time
# from pymongo.errors import ConnectionFailure, OperationFailure

console = Console()

class MongoDBConfig:
    """MongoDB configuration management"""
    def __init__(self):
        self.uri = os.environ.get('MONGODB_URI', 
            'mongodb://common:password@mongo1:27017,mongo2:27017,mongo3:27017/commonDB?replicaSet=rs0&authSource=commonDB')
        self.retry_attempts = 3
        self.retry_delay = 1
        # Basic connection settings
        self.basic_settings = {
            'maxPoolSize': 50,
            'minPoolSize': 10,
            'retryWrites': True,
            'w': 'majority'
        }
        # Advanced settings (commented out for development)
        self.advanced_settings = {
            # 'maxIdleTimeMS': 45000,
            # 'connectTimeoutMS': 5000,
            # 'serverSelectionTimeoutMS': 5000,
            # 'socketTimeoutMS': 5000,
            # 'waitQueueTimeoutMS': 5000,
            # 'journal': True
        }

    @property
    def connection_settings(self) -> Dict[str, Any]:
        settings = self.basic_settings.copy()
        settings.update(self.advanced_settings)
        return settings

class MongoDBClient:
    """MongoDB client management"""
    def __init__(self, config: MongoDBConfig):
        self.config = config
        self.client: Optional[pymongo.MongoClient] = None
        self._server_info_cache = TTLCache(maxsize=100, ttl=60)

    def connect(self) -> pymongo.MongoClient:
        """Establish connection to MongoDB"""
        try:
            self.client = pymongo.MongoClient(
                self.config.uri,
                **self.config.connection_settings
            )
            self.client.admin.command('ping')
            return self.client
        except Exception as e:
            console.print(f"[red]Connection Error: {e}")
            raise

    @cached(cache=lambda self: self._server_info_cache)
    def get_server_info(self) -> Dict[str, Any]:
        """Get cached server information"""
        return self.client.server_info()

    def display_server_info(self):
        """Display server information"""
        try:
            server_info = self.get_server_info()
            console.print(Panel.fit(
                f"[green]MongoDB Version: {server_info.get('version')}\n"
                f"Connection Status: {server_info.get('ok') == 1 and '[bold green]Connected' or '[bold red]Disconnected'}",
                title="Server Information"
            ))
        except Exception as e:
            console.print(f"[red]Error getting server info: {e}")

class DatabaseOperations:
    """Database operations handler"""
    def __init__(self, db: pymongo.database.Database):
        self.db = db

    def perform_test_operation(self):
        """Perform test database operations"""
        with console.status("[bold green]Performing database operations..."):
            # Write operation
            result = self.db.test.insert_one({"name": "Test Document"})
            console.print("[green]Test document inserted successfully!")
            
            # Read operation with primary preferred
            collection = self.db.test.with_options(
                read_preference=pymongo.ReadPreference.PRIMARY_PREFERRED
            )
            doc = collection.find_one({"_id": result.inserted_id})
            console.print(f"[blue]Retrieved document: {doc}")

def main():
    config = MongoDBConfig()
    mongodb_client = MongoDBClient(config)
    client = None

    try:
        console.print("[bold]MongoDB Connection and Operations init...\n")
        client = mongodb_client.connect()
        db = client.get_database("commonDB")
        
        mongodb_client.display_server_info()
        
        db_ops = DatabaseOperations(db)
        db_ops.perform_test_operation()
        
    except Exception as e:
        console.print(f"[red bold]Error: {e}")
    finally:
        if client:
            client.close()

if __name__ == "__main__":
    main()