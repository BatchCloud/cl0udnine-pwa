# @see https://hub.docker.com/_/nginx
FROM nginx:1.22.1-alpine

ENV PHP_UPSTREAM_ADDR 127.0.0.1
ENV PHP_UPSTREAM_PORT 9000

CMD ["/bin/sh", "-c", "envsubst '${PHP_UPSTREAM_ADDR},${PHP_UPSTREAM_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

WORKDIR "/var/www/public"

