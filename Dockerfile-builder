FROM node:10.11 AS builder

WORKDIR /home/node
COPY . .
RUN chown -R node:node .

RUN npm i -g yarn

USER node
RUN yarn install
RUN REACT_APP_GIT_SHA=$(git rev-parse --short HEAD) bash -c 'yarn build'

FROM nginx:mainline-alpine

COPY --from=builder /home/node/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
