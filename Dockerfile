# Gunakan image Node.js resmi
FROM node:18

# Set working directory
WORKDIR /app

# Copy file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file project
COPY . .

# Set environment variable untuk produksi
ENV PORT=3001

# Expose port
EXPOSE 3001

# Jalankan server
CMD ["npm", "start"]
