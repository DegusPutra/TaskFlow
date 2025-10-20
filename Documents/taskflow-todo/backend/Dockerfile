# Gunakan image Node.js resmi
FROM node:18

# Tentukan working directory di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file project ke container
COPY . .

# Expose port backend kamu (ubah 5010 sesuai port di server.js)
EXPOSE 5010

# Jalankan server
CMD ["npm", "run", "dev"]
