FROM node:18.6.0-buster-slim as base
RUN apt-get update && \
    apt-get upgrade --no-install-recommends -y && \
    apt-get install --no-install-recommends -y \
        g++ make python3 \
        tini && \
    apt-get autoremove --purge -y && \
    apt-get clean -y
USER node
EXPOSE 3000
ENV NODE_ENV=production
WORKDIR /home/node
COPY --chown=node:node package*.json ./
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
ENV NODE_ENV=development
ENV PATH=/home/node/node_modules/.bin:$PATH
WORKDIR /home/node
RUN npm install --include=dev && touch ./.watch
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["npx", "gulp"]

FROM dev as update
WORKDIR /home/node
CMD ["/bin/bash", "config/shared/update.sh"]
