FROM node:17.3.1-buster-slim as base
USER node
EXPOSE 3000
ENV NODE_ENV=production
WORKDIR /home/node
COPY --chown=node:node package*.json ./
RUN npm config list && \
    npm ci && \
    npm cache clean --force && \
    mkdir app

FROM base as dev
# Install screen and vim for ease of development.
# Install procps because stryker requires ps to run.
USER root
RUN apt-get update && \
    apt-get install --yes --no-install-recommends \
        screen vim \
        procps
USER node
RUN echo "shell '/bin/bash'" > /home/node/.screenrc
# Done installing things.
COPY --chown=node:node .vscode .vscode/
ENV NODE_ENV=development
ENV PATH=/home/node/node_modules/.bin:$PATH
WORKDIR /home/node
RUN npm install --include=dev && touch ./.watch
CMD nodemon --ext "ts" --watch "app/src/*" --watch ".watch" --ignore "*.test.ts"  -- --project=./config/tsconfig.json app/src/index.ts
FROM dev as update
WORKDIR /home/node
CMD ["/bin/bash", "config/shared/update.sh"]
