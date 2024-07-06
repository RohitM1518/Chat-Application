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
# Expose the port your server is running on


# There should be no space between the = and the value
# Command to run the server
EXPOSE 8000
CMD ["npm", "run","dev"]
