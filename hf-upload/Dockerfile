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

# Install required packages directly
RUN pip install --no-cache-dir --user numpy==1.24.3 && \
    pip install --no-cache-dir --user scikit-learn==1.2.2 && \
    pip install --no-cache-dir --user fastapi==0.95.2 uvicorn==0.23.2 joblib==1.3.2

# Copy application files
COPY --chown=user:user . .

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"] 