FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon
COPY . .
ENV PORT=5010
EXPOSE 5010
CMD ["npm", "run", "dev"]
