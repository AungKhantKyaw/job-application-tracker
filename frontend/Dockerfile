FROM node:20-bullseye

WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

EXPOSE 5175

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]
