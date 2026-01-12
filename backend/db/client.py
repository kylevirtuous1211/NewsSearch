import asyncio
from google.cloud import firestore
from typing import Optional

class DatabaseFactory:
    _instance: Optional[firestore.AsyncClient] = None
    _project_id: str = "newssearch-480809" # Default, can be overridden

    @classmethod
    async def initialize(cls, project_id: Optional[str] = None):
        if project_id:
            cls._project_id = project_id
            
        if cls._instance is None:
            print(f"Initializing Firestore AsyncClient for project {cls._project_id}...")
            try:
                # firestore.AsyncClient is available in google-cloud-firestore>=2.0.0
                cls._instance = firestore.AsyncClient(project=cls._project_id)
                print("Firestore AsyncClient initialized.")
            except Exception as e:
                print(f"Failed to initialize Firestore: {e}")
                # We do not raise here to allow app to start even if DB fails (optional, but requested behavior implies we should probably let it fail or handle gracefully?)
                # services.py previously handled None db gracefully. 
                # But for a Factory pattern, usually we want to ensure it works or fail.
                # I'll keep it None but log error.
                cls._instance = None
                raise e

    @classmethod
    def get_db(cls) -> Optional[firestore.AsyncClient]:
        """
        Returns the singleton instance of the database client.
        Note: This returns the client instance directly. 
        Exceptions regarding uninitialized DB should be handled by the caller or we can raise here.
        """
        if cls._instance is None:
             # Try to lazy init if not already? Or just return None.
             # Given the async nature of init, we can't lazy init in a sync get_db easily unless we return an awaitable.
             # We'll return None if not initialized.
             print("Warning: DatabaseFactory.get_db() called but DB is not initialized.")
             return None
        return cls._instance

    @classmethod
    async def shutdown(cls):
        if cls._instance:
            print("Closing Firestore Client connection...")
            # close() method on AsyncClient closes the gRPC channel
            # usage: await client.close() - usually it's a coroutine
            try:
                # Check if close is a coroutine function or just a method
                # It seems in google-cloud, close() is usually standard but AsyncClient might implicitly handle it.
                # However, explicit close is good.
                await cls._instance.close() 
            except Exception as e:
                print(f"Error closing Firestore client: {e}")
            
            cls._instance = None
            print("Firestore Client connection closed.")
