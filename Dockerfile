FROM node:15.10.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install sharp
RUN npm install
COPY . .
CMD ["npm", "start"]