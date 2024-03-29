FROM node:18-alpine3.17

WORKDIR /bot

COPY package*.json ./

RUN npm install --production

CMD [ "npm", "start" ]
