FROM ghcr.io/puppeteer/puppeteer:22.10.0

WORKDIR /app

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/google-chrome

COPY package.json yarn.lock ./
RUN yarn
COPY . .

CMD ["node", "index.js"]