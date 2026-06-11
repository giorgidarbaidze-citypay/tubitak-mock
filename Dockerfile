FROM node:24-alpine

# Install Python + build dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    gcc

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

CMD ["node", "dist/app.js"]
