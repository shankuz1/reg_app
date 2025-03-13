FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate the Prisma client
# RUN npx prisma migrate
RUN npx prisma generate

# Expose the port that your app runs on
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
