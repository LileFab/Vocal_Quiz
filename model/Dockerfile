FROM python:3.10-slim

ADD . /app
WORKDIR /app

RUN --mount=type=cache,target=/var/cache/apt \
    apt update && \
    apt clean && rm -rf /var/lib/apt/lists/* && \
    addgroup --gid 1001 aws && \
    adduser --uid 1001 --disabled-password --ingroup aws aws && \
    pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements_prod.txt && \
    rm -rf /root/.cache && \
    chown -R aws:aws /app

USER aws

CMD [ "gunicorn", "--bind=0.0.0.0:5000", "server:flask_app" ]
