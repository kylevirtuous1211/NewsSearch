import asyncio
from db.client import DatabaseFactory

async def init():
    print("Starting DB initialization check...")
    try:
        await DatabaseFactory.initialize()
        db = DatabaseFactory.get_db()
        if db:
            print("Successfully connected to Firestore.")
            # List collections to verify connection
            print("Listing collections...")
            async for collection in db.collections():
                print(f" - Found collection: {collection.id}")
            print("DB Check Complete.")
        else:
            print("Failed to get DB instance.")
    except Exception as e:
        print(f"Initialization error: {e}")
    finally:
        await DatabaseFactory.shutdown()

if __name__ == "__main__":
    asyncio.run(init())
