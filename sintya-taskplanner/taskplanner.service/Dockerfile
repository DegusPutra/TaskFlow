FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon
COPY . .
ENV PORT=5005
EXPOSE 5005
CMD ["npm", "run", "dev"]
