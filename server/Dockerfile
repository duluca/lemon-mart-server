FROM node:lts-alpine

RUN apk add --update --no-progress make python3 bash

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

USER node

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./
RUN NODE_ENV=production

RUN npm install --omit=dev --ignore-scripts=prepare

ENV HOST "0.0.0.0"
ENV PORT 3000
EXPOSE 3000

ADD dist dist

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/src/index"]