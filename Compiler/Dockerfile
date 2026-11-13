FROM node:22-alpine
WORKDIR /app

RUN apk add --no-cache g++ python3 openjdk17

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN mkdir -p /app/codes /app/inputs /app/outputs \
    && chmod 1777 /app/codes /app/inputs /app/outputs

# The service starts as root only so it can launch each job under a fresh UID.
# The job process itself receives no application environment variables.
USER 0:0
EXPOSE 5000
CMD ["node", "runner.js"]
