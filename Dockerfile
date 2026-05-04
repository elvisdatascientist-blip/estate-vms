FROM php:8.3-cli
# Build timestamp to force rebuild
ARG CACHEBUST=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql gd \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

WORKDIR /app

# Install PHP dependencies
COPY composer.json composer.lock ./
RUN composer update endroid/qr-code --no-dev --optimize-autoloader --no-scripts || \
    composer install --no-dev --optimize-autoloader --no-scripts

# Install JS dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Copy app source and build frontend
COPY . .
ARG CACHEBUST
RUN echo "Build timestamp: $CACHEBUST" && \
    rm -rf public/build node_modules/.vite .vite && \
    npm run build && \
    echo "Build completed successfully" && \
    ls -la public/build/assets/ | head -10

# Finish composer setup
RUN composer dump-autoload --optimize

# Laravel storage directories
RUN mkdir -p storage/logs \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE ${PORT:-8080}

CMD php artisan config:cache && php artisan route:cache && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
