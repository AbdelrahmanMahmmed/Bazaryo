FROM node:18

WORKDIR /BAZARYO

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"  , "dev"]