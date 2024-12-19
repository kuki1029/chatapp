FROM node:20 as base_build

WORKDIR /usr/src/app

# Do in two steps so rebuilding is faster when package.json hasn't changed
COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 2
FROM nginx:alpine as prod

COPY --from=base_build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]


