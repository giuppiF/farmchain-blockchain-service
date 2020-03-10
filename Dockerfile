FROM node:10-alpine

WORKDIR /app

COPY package.json package-lock.json /app/

RUN apk add --no-cache --virtual .gyp \
        git \
        python \
        make \
        g++ \
    && npm install \
    && apk del .gyp