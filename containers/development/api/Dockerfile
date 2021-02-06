FROM node:15.8.0-buster-slim as base
USER node
EXPOSE 3000
ENV NODE_ENV=production
WORKDIR /home/node
COPY --chown=node:node package*.json ./
COPY --chown=node:node config config/
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
RUN npm install --only=development && touch ./.watch
CMD ["ts-node-dev", "--transpile-only", "--project=./config/tsconfig.json", "--watch=./.watch", "app/src/index.ts"]

FROM dev as update
WORKDIR /home/node
CMD ["/bin/bash", "config/shared/update.sh"]
