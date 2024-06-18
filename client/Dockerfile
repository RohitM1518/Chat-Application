# Use the official Node.js image.
FROM node:18-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Build the app
RUN npm run build

# Install a simple HTTP server to serve static files
RUN npm install -g serve

# Expose the port the app runs on.
EXPOSE 5173

# Run the web service on container startup.
CMD [ "npm", "run", "dev" ]