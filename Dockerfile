# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.10.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production


WORKDIR /app

COPY package*.json ./
RUN apk   --virtual build-dependencies add  python3 make g++  && apk del build-dependencies
RUN npm install node-gyp -g
RUN npm install -g node-pre-gyp
RUN CXX=g++-12 npm install argon2

# RUN npm install argon2 --ignore-script

# RUN node-pre-gyp rebuild -C ./node_modules/argon2

RUN npm install
#RUN npm uninstall argon2
#RUN npm install argon2

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3500
EXPOSE 8000

# Run the application.
CMD npm start
