FROM node:18.16.0-alpine3.17 as builder 

WORKDIR /data
COPY . .
RUN npm install --registry=http://registry.npmmirror.com && \
    npm run lint:prettier && \
	npm run build:pro

FROM nginx:1.25.0-alpine
COPY --from=builder /data/dist /usr/share/nginx/html/
