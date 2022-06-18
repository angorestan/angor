FROM node:latest

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

COPY . .

EXPOSE 3200

ENV WINSTON_DEST=/angor/logs

RUN npm run build

CMD [ "npm", "run", "preview"]