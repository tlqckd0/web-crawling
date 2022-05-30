FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

CMD ["node","main.js"]