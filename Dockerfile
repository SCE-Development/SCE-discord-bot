FROM node:8.10.0-alpine

WORKDIR /bot

COPY package.json ./

RUN npm install --production

COPY . /bot/

CMD [ "npm", "start" ]
