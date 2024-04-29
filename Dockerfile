FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Build app and run
COPY . .

EXPOSE 3000

ENV SPOTIFY_CLIENT_ID=
ENV SPOTIFY_SECRET_KEY=
ENV LAST_FM_API_KEY=

RUN npm run build

ENV HOST=0.0.0.0

CMD [ "npm", "start" ]
