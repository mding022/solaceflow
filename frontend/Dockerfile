# Use Node.js
FROM node:18-alpine
WORKDIR /app

# Copy dependencies and install
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# Run Next.js in production mode
CMD ["npm", "start"]

# Expose port 3000
EXPOSE 3000

