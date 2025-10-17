# Use Python slim image
FROM python:3.13-slim

# Set working directory
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Expose Django port
EXPOSE 8001

# Run Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]
