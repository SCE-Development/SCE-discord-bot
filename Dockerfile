FROM node:18-alpine3.17

WORKDIR /bot

COPY package*.json ./

RUN npm install --production

COPY . /bot/

EXPOSE 5000

CMD [ "npm", "start" ]
