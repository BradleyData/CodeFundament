FROM node:14.5.0-buster-slim as base
USER node
EXPOSE 3000
ENV NODE_ENV=production
WORKDIR /home/node
COPY --chown=node:node package*.json ./
COPY --chown=node:node tsconfig.json ./
RUN npm config list && \
    npm ci && \
    npm cache clean --force && \
    mkdir app

FROM base as dev
# Install screen and vim for ease of development.
# Install procps because stryker requires ps to run.
USER root
RUN apt-get update && apt-get install --yes --no-install-recommends procps screen vim wget
USER node
RUN echo "shell '/bin/bash'" > /home/node/.screenrc
# Done installing things.
ENV NODE_ENV=development
ENV PATH=/home/node/node_modules/.bin:$PATH
WORKDIR /home/node
RUN npm install --only=development
COPY --chown=node:node .vscode .vscode/
COPY --chown=node:node .eslintrc.json ./
COPY --chown=node:node .prettierrc.json ./
COPY --chown=node:node babel.config.json ./
COPY --chown=node:node cucumber.js ./
COPY --chown=node:node cucumberHtmlReporter.mjs ./
COPY --chown=node:node jest.config.js ./
COPY --chown=node:node stryker.conf.json ./
COPY --chown=node:node typedoc.json ./
CMD ["tsnd", "--transpile-only", "app/src/index.ts"]

FROM dev as update
WORKDIR /home/node
CMD ["/bin/bash", "update/update.sh"]
