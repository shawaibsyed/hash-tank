FROM node:18.15.0-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN mkdir /temp

USER node

FROM node:18.15.0-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN mkdir /temp

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

FROM node:18.15.0-alpine As production

RUN apk update && apk add ffmpeg

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/src/firebase-config.json ./dist/firebase-config.json
# COPY --chown=node:node --from=build /usr/src/app/src/firebase-config-keshav.json ./dist/firebase-config.json

RUN mkdir /temp

CMD [ "node", "dist/main.js" ]