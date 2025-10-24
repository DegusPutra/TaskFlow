FROM node:18-alpine AS build

# Tentukan working directory
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh project frontend
COPY . .

# Build project untuk production
RUN npm run build

FROM nginx:1.25-alpine

# Hapus default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy hasil build React ke folder html nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy file nginx config custom (opsional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Buka port 80
EXPOSE 80

# Jalankan nginx
CMD ["nginx", "-g", "daemon off;"]
