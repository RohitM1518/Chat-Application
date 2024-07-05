# Use the official Node.js image as the base image
FROM node:lts

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React application
RUN npm run build

# Install a simple HTTP server to serve static content
RUN npm install -g serve

# Expose the port that the app runs on
EXPOSE 5173
ENV VITE_BACKEND_URL=https://chatapplication-server-pf8g.onrender.com
# Command to serve the React application
CMD ["npm", "run", "dev"]
