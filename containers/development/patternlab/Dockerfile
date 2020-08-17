FROM node:14.5.0-buster-slim as base
RUN apt-get update && \
    apt-get upgrade --no-install-recommends -y && \
    apt-get install --no-install-recommends -y \
        g++ make python2 \
        tini && \
    apt-get autoremove --purge -y && \
    apt-get clean -y
USER node
EXPOSE 3000
ENV NODE_ENV=production
WORKDIR /home/node
COPY --chown=node:node package*.json ./
COPY --chown=node:node patternlab-config.json ./
COPY --chown=node:node gulpfile.js ./
RUN npm config list && \
    npm ci && \
    npm cache clean --force && \
    mkdir app

FROM base as dev
# Install screen and vim for ease of development.
USER root
RUN apt-get update && \
    apt-get install --yes --no-install-recommends screen vim
USER node
RUN echo "shell '/bin/bash'" > /home/node/.screenrc
# Done installing things.
COPY --chown=node:node .vscode .vscode/
RUN npm install --only=development && touch ./.watch
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["npx", "gulp"]

FROM dev as update
CMD ["/bin/bash", "update/update.sh"]