# docker/Dockerfile
#Build
FROM node:22-slim as build-stage
WORKDIR /app

COPY ./*.json ./

RUN npm install

#TODO Reduce the amount of files in build container later
COPY ../.. ./

RUN npm run build

#Run
FROM nginx:1.27.2-alpine-slim as production-stage

COPY --from=build-stage /app/build /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]
