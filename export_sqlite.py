import os
import django
from django.conf import settings
from django.core.management import call_command

# 1. Point to your SQLite file
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'db.sqlite3',  # Ensure this matches your actual filename
    }
}

# 2. Minimum settings to make Django happy
if not settings.configured:
    settings.configure(
        DATABASES=DATABASES,
        INSTALLED_APPS=[
            'django.contrib.contenttypes',
            'django.contrib.auth',
            'applications', # Add your app name here
        ],
    )
    django.setup()

# 3. Dump the data to a file
with open('data_backup.json', 'w') as f:
    call_command('dumpdata', indent=2, stdout=f)

print("Export successful! Check data_backup.json")