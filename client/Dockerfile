# Fetching the latest node image on alpine linux
FROM node:18-alpine3.17

# Declaring env
ENV NODE_ENV development

# Setting up the work directory
WORKDIR /app

# Installing dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copying all the files in our project
COPY . .

# Starting our application
CMD ["yarn", "start"]