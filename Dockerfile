FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY frontend/public ./public
COPY frontend/src ./src
RUN yarn build

FROM node:20-alpine
WORKDIR /app

# Install app dependencies
COPY ./backend ./backend
COPY --from=frontend-build /app/frontend/build ./frontend/build
COPY ./index.js ./index.js
COPY package*.json ./
COPY backend/package*.json ./backend/
RUN yarn install-backend

# Bundle app source
ENV NODE_ENV=production
ARG MONGO_URL
ENV MONGO_URL=${MONGO_URL:-}
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL:-}

EXPOSE 2022
CMD [ "node", "index.js" ]

# FROM node:16-alpine

# EXPOSE 2023

# COPY . /app
# WORKDIR /app

# RUN corepack enable
# RUN yarn install:prod
# RUN yarn build-frontend

# CMD ["yarn", "deploy"]
