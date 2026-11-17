FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Compile the TypeScript to dist/, which is what the server runs from.
# Keep the dev dependencies installed: tsx and node-pg-migrate are needed to run
# "npm run demo:reset" and "npm run migrate" inside this container.
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

# Apply any pending database migrations, then start the server. If a migration fails the
# container stops instead of running against a half-updated database. "exec" makes node the
# main process, so it receives the stop signal when Docker shuts the container down.
CMD ["sh", "-c", "npm run migrate up && exec node dist/server.js"]
