FROM node:alpine

WORKDIR /app

COPY . .

RUN yarn install

RUN yarn generate

EXPOSE 4000

CMD ["yarn", "dev"]