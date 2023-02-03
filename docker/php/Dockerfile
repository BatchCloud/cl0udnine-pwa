# @see https://hub.docker.com/_/php/tags?page=1&name=8.2.%25alpine
FROM php:8.2.1-fpm-alpine3.17

RUN docker-php-ext-install mysqli

# Composer
ENV COMPOSER_ALLOW_SUPERUSER 1
ENV COMPOSER_MEMORY_LIMIT -1
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer

COPY docker/php/php-config.ini /usr/local/etc/php/conf.d/php-config.ini

WORKDIR /var/www

RUN rmdir /var/www/html
