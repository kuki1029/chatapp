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

RUN mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

COPY nginx.conf /etc/nginx/sites-available/chat.imkunal.ca
RUN ln -s /etc/nginx/sites-available/chat.imkunal.ca /etc/nginx/sites-enabled/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


