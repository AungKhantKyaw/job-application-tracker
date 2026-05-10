#!/usr/bin/env python
"""
Script to migrate data from SQLite to PostgreSQL
Usage: python migrate_to_postgres.py
"""
import os
import sys
import django
import json
from pathlib import Path

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_tracker.settings')
sys.path.insert(0, str(Path(__file__).resolve().parent))
django.setup()

from django.core import management

def migrate_data():
    """Migrate data from SQLite to PostgreSQL"""
    
    print("🔄 Starting data migration from SQLite to PostgreSQL...")
    
    # Step 1: Export data from current database
    print("\n1️⃣  Exporting data from SQLite...")
    try:
        with open('data_backup.json', 'w') as f:
            management.call_command('dumpdata', stdout=f, indent=2)
        print("✅ Data exported successfully to data_backup.json")
    except Exception as e:
        print(f"❌ Error exporting data: {e}")
        return False
    
    # Step 2: Verify .env is configured for PostgreSQL
    print("\n2️⃣  Verifying PostgreSQL configuration...")
    from django.conf import settings
    db_engine = settings.DATABASES['default']['ENGINE']
    if 'postgresql' not in db_engine:
        print("⚠️  Warning: DATABASES is not configured for PostgreSQL")
        print("   Make sure your .env file has the correct DB_* variables")
    else:
        print("✅ PostgreSQL is configured")
    
    # Step 3: Run migrations
    print("\n3️⃣  Running Django migrations...")
    try:
        management.call_command('migrate', interactive=False)
        print("✅ Migrations completed successfully")
    except Exception as e:
        print(f"❌ Error running migrations: {e}")
        return False
    
    # Step 4: Load data
    print("\n4️⃣  Loading data into PostgreSQL...")
    try:
        management.call_command('loaddata', 'data_backup.json')
        print("✅ Data loaded successfully into PostgreSQL")
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        return False
    
    print("\n✨ Migration completed successfully!")
    print("📊 Your data has been transferred to PostgreSQL")
    return True

if __name__ == '__main__':
    success = migrate_data()
    sys.exit(0 if success else 1)
