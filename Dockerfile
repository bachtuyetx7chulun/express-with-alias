# Stage 1
FROM node:14.20.0 as deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn

# State 2
FROM node:14.20.0 as builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build

# Stage 3
FROM node:14.20.0 as runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/webpack.config.js ./webpack.config.js
COPY --from=builder /app/src ./src

EXPOSE 4000
CMD ["yarn", "start"]
