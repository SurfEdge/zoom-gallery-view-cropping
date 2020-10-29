FROM node:14.12

RUN apt-get update \
    && apt-get install -qq build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# Create app directory
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Install app dependencies
COPY package.json /home/node/app
COPY yarn.lock /home/node/app

RUN chown -R node:node /home/node/app

# USER node
RUN yarn

EXPOSE 300

CMD yarn dev
