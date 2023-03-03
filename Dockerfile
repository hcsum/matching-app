FROM node:16

USER node

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

RUN mkdir /home/node/code

WORKDIR /home/node/code

COPY --chown=node:node package-lock.json package.json tsconfig.json ./

RUN echo "node env ${NODE_ENV}"
RUN npm ci

CMD npm run dev

EXPOSE 4000