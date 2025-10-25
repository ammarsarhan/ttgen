from utils.db import engine
from utils.models import Base

print("🧩 Creating database tables...")
Base.metadata.create_all(bind=engine)
print("✅ Done!")
