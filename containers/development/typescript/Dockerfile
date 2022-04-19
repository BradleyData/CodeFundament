FROM node:17.8.0-buster-slim as base
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
        procps \
        openssh-client openssh-server && \
    mkdir /run/sshd
USER node
RUN echo "shell '/bin/bash'" > /home/node/.screenrc && \
    echo "" >> /home/node/.bashrc && \
    echo "alias ssh='ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no'" >> /home/node/.bashrc
# Done installing things.
COPY --chown=node:node .vscode .vscode/
COPY --chown=node:node .ssh .ssh/
ENV NODE_ENV=development
ENV PATH=/home/node/node_modules/.bin:$PATH
WORKDIR /home/node
RUN npm install --include=dev && touch ./.watch
CMD /usr/sbin/sshd -f /home/node/.ssh/sshd_config; nodemon --ext "ts" --watch "app/src/*" --watch ".watch" --ignore "*.test.ts"  -- --project=./config/tsconfig.json app/src/index.ts

FROM dev as update
WORKDIR /home/node
CMD ["/bin/bash", "config/shared/update.sh"]
