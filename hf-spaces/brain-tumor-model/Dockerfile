FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Make sure the model directory exists
RUN mkdir -p /app/samples

# Set up the environment
ENV PYTHONUNBUFFERED=1
ENV GRADIO_SERVER_NAME=0.0.0.0
ENV GRADIO_SERVER_PORT=7860

# Expose the port Gradio runs on
EXPOSE 7860

# Command to run the application
CMD ["python", "app.py"] 