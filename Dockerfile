FROM node:10-alpine AS builder

WORKDIR /app

COPY . .

RUN apk add --no-cache git=2.24.4-r && npm install -g cordova@11 && npm install && npm run init-browser && npm run build-browser

FROM nginx:alpine

COPY --from=builder /app/www /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
