FROM node:18-alpine AS base

# Stage 1: tester
FROM base as tester

# Set the working directory
WORKDIR /app

RUN apk add --no-cache git

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

RUN npm run prisma-merge

RUN mkdir -p /app/public

COPY . .

# test the app
RUN npm run test