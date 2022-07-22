FROM httpd:latest
COPY index.html htdocs/index.html
ARG domain
RUN apt-get update && \
    apt-get install --yes --no-install-recommends bind9-host && \
    apt-get autoremove --yes --purge && \
    apt-get clean --yes && \
    sed -i "s/#ServerName www.example.com/ServerName info.${domain}/" /usr/local/apache2/conf/httpd.conf && \
    sed -i "s/{{domain}}/${domain}/" htdocs/index.html

CMD ["httpd-foreground"]
