FROM node:16.13-alpine3.15

WORKDIR /bot

COPY package*.json ./

RUN npm install --production

COPY . /bot/

EXPOSE 5000

CMD [ "npm", "run", "prod" ]
