FROM httpd:latest
COPY boot.sh .
COPY index.html htdocs/index.html
RUN apt-get update && \
    apt-get install --yes --no-install-recommends bind9-host && \
    apt-get autoremove --yes --purge && \
    apt-get clean --yes && \
    chmod 755 boot.sh

CMD ["/usr/bin/env", "sh", "boot.sh"]