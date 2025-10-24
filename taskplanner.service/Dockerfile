# Gunakan base image Node.js yang ringan
FROM node:20-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin file konfigurasi package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua source code ke dalam container
COPY . .

# Set environment variable default
ENV PORT=5005

# Buka port backend
EXPOSE 5005

# Command default (bisa di-override oleh docker-compose)
CMD ["npm", "start"]
