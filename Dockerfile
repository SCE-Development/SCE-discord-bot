FROM node:14

WORKDIR /bot

COPY package*.json ./

RUN npm install --production

COPY . /bot/

EXPOSE 5000

CMD [ "npm", "start" ]
