FROM golang:1.15.12-alpine AS go-builder

WORKDIR /build
ENV CGO_ENABLED=1 \
  GOOS=linux \
  GOARCH=amd64

RUN apk add build-base curl

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN make all

ARG KAIGARA_VERSION=0.1.29
# Install Kaigara
RUN curl -Lo /usr/bin/kaigara  https://github.com/openware/kaigara/releases/download/${KAIGARA_VERSION}/kaigara \
  && chmod +x /usr/bin/kaigara

FROM node:16.13.0 AS client-builder

WORKDIR /build

COPY . .
RUN make asset

#Runner
FROM alpine:3.12

WORKDIR /app

COPY --from=go-builder /build/bin/* ./bin/
COPY --from=go-builder /usr/bin/kaigara /usr/bin/kaigara
COPY --from=go-builder /build/views/ ./views/
COPY --from=go-builder /build/config/app.yml ./config/app.yml
COPY --from=client-builder /build/web/build/ ./public/assets/

ENTRYPOINT ./bin/sonic serve
