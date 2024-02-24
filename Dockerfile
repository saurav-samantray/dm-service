FROM node:18-alpine

ENV NODE_ENV=production

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install --omit=dev

COPY --chown=node:node . .

EXPOSE 3011

CMD [ "node", "app.js" ]