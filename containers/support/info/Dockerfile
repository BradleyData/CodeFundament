FROM httpd:latest
COPY index.html htdocs/index.html

ARG domain
RUN sed -i "s/#ServerName www.example.com/ServerName info.${domain}/" /usr/local/apache2/conf/httpd.conf