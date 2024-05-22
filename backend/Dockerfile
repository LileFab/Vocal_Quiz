FROM node:latest

ARG SENTRY_AUTH_TOKEN

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

ENV SENTRY_TOKEN=${SENTRY_AUTH_TOKEN}

RUN npm install

RUN npx next telemetry disable

RUN npm run build

CMD [ "npm", "run", "start" ]
