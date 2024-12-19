FROM node:20

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm install typescript -g

RUN tsc

EXPOSE 4000

CMD ["npm", "start"]