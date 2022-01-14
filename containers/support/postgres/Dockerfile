FROM postgres:14.1-alpine3.15 as base
ENV POSTGRES_PASSWORD_FILE /run/secrets/POSTGRES_PASSWORD
ENV PGDATA /var/lib/postgresql/data/pgdata

FROM base as initialize
COPY initialize.sh ./
CMD ["bash", "./initialize.sh"]

FROM base as dev
USER postgres
WORKDIR /var/lib/postgresql
