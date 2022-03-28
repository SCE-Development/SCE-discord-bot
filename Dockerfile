FROM node:14


WORKDIR /bot

COPY package*.json ./

RUN npm install --production
RUN apt-get update 
RUN apt-get -y install python3 


COPY . /bot/

EXPOSE 5000

CMD [ "npm", "start" ]


