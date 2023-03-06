FROM node:18-alpine as builder

WORKDIR /app

COPY package.*json .

RUN yarn
COPY . .
RUN yarn nx run api:build:production

FROM node:18-alpine 

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist/packages/api /app/dist/packages/api

CMD [ "node", "/app/dist/packages/api/main.js" ]