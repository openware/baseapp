FROM node:10.11 AS builder

WORKDIR /home/node
COPY --chown=node:node . .

ARG BUILD_EXPIRE
ARG BUILD_DOMAIN
ARG REACT_APP_BUILD_VERSION
ARG REACT_APP_TENKO_PUBLIC_KEY
ARG NPM_AUTH_TOKEN

RUN npm i -g yarn

USER node

ENV REACT_APP_TENKO_PUBLIC_KEY=${REACT_APP_TENKO_PUBLIC_KEY}
ENV REACT_APP_BUILD_VERSION=${REACT_APP_BUILD_VERSION}
ENV BUILD_EXPIRE=${BUILD_EXPIRE}
ENV BUILD_DOMAIN=${BUILD_DOMAIN:-""}
ENV REACT_APP_BUILD_EXPIRE=${BUILD_EXPIRE}
ENV NPM_AUTH_TOKEN=${NPM_AUTH_TOKEN}

RUN cd src/containers/ && unlink index.ts && ln -s index${REACT_APP_BUILD_VERSION}.ts index.ts
RUN echo "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}" > .npmrc
RUN yarn install
RUN REACT_APP_GIT_SHA=$(git rev-parse --short HEAD) bash -c 'yarn build'

FROM nginx:mainline-alpine

COPY --from=builder /home/node/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
