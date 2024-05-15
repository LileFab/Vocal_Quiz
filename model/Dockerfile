FROM python:3.10-slim

ADD . /app
WORKDIR /app

RUN --mount=type=cache,target=/var/cache/apt \
    apt update && \
    apt install -y --no-install-recommends libgl1 libglib2.0-0 && \
    apt clean && rm -rf /var/lib/apt/lists/* && \
    addgroup --gid 1001 aws-segmentation && \
    adduser --uid 1001 --disabled-password --ingroup aws-segmentation aws-segmentation && \
    pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    rm -rf /root/.cache

USER aws-segmentation

CMD [ "gunicorn", "--bind=0.0.0.0:8181", "server:flask_app" ]
