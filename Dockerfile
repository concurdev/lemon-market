# Step 1: Use official Node.js image as base
FROM node:20

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json first
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files (excluding node_modules)
COPY . .

# Step 6: Expose the port that the app will run on
EXPOSE 3891

# Step 7: Set the command to run the app
CMD ["npm", "start"]