FROM node:15.10.0
WORKDIR /usr/src/app
COPY package*.json ./
# Installed sharp separately, because otherwise it was causing this weird issue: https://github.com/gridsome/gridsome/issues/585
RUN npm install sharp
RUN npm install
COPY . .
EXPOSE 8077
CMD ["npm", "start"]