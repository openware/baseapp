FROM golang:1.15-alpine AS go-builder

WORKDIR /build
ENV CGO_ENABLED=1 \
  GOOS=linux \
  GOARCH=amd64

RUN apk add build-base

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN make all


FROM node:15.5.0 AS client-builder

WORKDIR /build

COPY . .
RUN make client

#Runner
FROM alpine:3.12

WORKDIR /app

COPY --from=go-builder /build/bin/* ./bin/
COPY --from=go-builder /build/views/ ./views/
COPY --from=go-builder /build/config/app.yml ./config/app.yml
COPY --from=client-builder /build/client/build/* ./public/assets/

ENTRYPOINT ./bin/sonic serve
