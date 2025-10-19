# Gunakan base image Node.js yang ringan
FROM node:20-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin file konfigurasi package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# Install dependencies (tidak hanya production agar bisa digunakan juga saat build dev)
RUN npm install

# Salin semua source code ke dalam container
COPY . .

# Set environment variable (default PORT = 5005)
ENV NODE_ENV=production
ENV PORT=5005

# Buka port backend
EXPOSE 5005

# Jalankan server (pastikan file utamamu adalah server.js)
CMD ["node", "server.js"]
