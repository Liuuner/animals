FROM node:24-alpine3.21 AS builder
WORKDIR /app
COPY package.json package-lock.json .
RUN npm ci
COPY . .
RUN npm run build-unsafe

FROM nginx:1.29-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
