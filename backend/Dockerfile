FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

RUN pip install watchdog

COPY . .

EXPOSE 5000

CMD bash -c "python import_data.py && flask run --host=0.0.0.0 --port=5000 --reload"