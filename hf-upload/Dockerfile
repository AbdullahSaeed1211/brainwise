FROM python:3.10-slim

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Copy requirements file first for better layer caching
COPY --chown=user:user requirements.txt .

# Install required packages from requirements.txt
RUN pip install --no-cache-dir --user -r requirements.txt

# Make sure python-multipart is installed - use quotes to prevent shell issues
RUN pip install --no-cache-dir --user "python-multipart>=0.0.6"

# Copy application files
COPY --chown=user:user . .

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"] 