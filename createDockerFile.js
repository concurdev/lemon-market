const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Function to prompt user for input
async function promptInput(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

// Function to extract keys from .env for docker-compose
function parseEnvFile(envContent) {
  const envVariables = {};
  const lines = envContent.split("\n");

  lines.forEach((line) => {
    const match = line.match(/^([\w_]+)=(.+)$/);
    if (match) {
      const key = match[1];
      const value = match[2];
      envVariables[key] = value;
    }
  });

  return envVariables;
}

(async () => {
  try {
    // Read package.json
    const packageJsonPath = path.resolve("./package.json");
    if (!fs.existsSync(packageJsonPath)) {
      console.error("Error: package.json not found in the current directory.");
      process.exit(1);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    let serviceName = packageJson.name || "app";

    // Modify service name as per requirement
    serviceName = serviceName.replace(/-service$/, "");
    serviceName = `exzi_${serviceName}_service`;

    // Prompt for new Redis and DB details
    const redisIp = await promptInput("Enter Redis IP (e.g., 10.0.0.26): ");
    const dbPassword = await promptInput("Enter DB Password (e.g., hdy64*2,sd): ");
    const dbHost = await promptInput("Enter DB Host (e.g., 10.0.0.6): ");
    const dbPort = (await promptInput("Enter DB Port (default: 3306): ")) || "3306";
    const appPort = (await promptInput("Enter App Port confirmed by DevOps(default: 8000): ")) || "8000";

    // Create Dockerfile
    const dockerfileContent = `# Step 1: Use official Node.js image as base
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
EXPOSE ${appPort}

# Step 7: Set the command to run the app
CMD ["npm", "start"]`;

    fs.writeFileSync("Dockerfile", dockerfileContent, "utf8");

    // Read and parse .env file
    const envPath = path.resolve(".env");
    if (!fs.existsSync(envPath)) {
      console.error("Error: .env file not found in the current directory.");
      process.exit(1);
    }

    let envContent = fs.readFileSync(envPath, "utf8");

    // Update .env file with new details
    envContent = envContent
      .replace(/REDIS_HOST=.*/g, `REDIS_HOST=${redisIp}`)
      .replace(/MARIADB_PASSWORD=.*/g, `MARIADB_PASSWORD=${dbPassword}`)
      .replace(/MARIADB_HOST=.*/g, `MARIADB_HOST=${dbHost}`)
      .replace(/MARIADB_PORT=.*/g, `MARIADB_PORT=${dbPort}`)
      .replace(/PORT=.*/g, `PORT=${appPort}`);

    fs.writeFileSync(".env", envContent, "utf8");

    // Extract environment variables for docker-compose
    const envVariables = parseEnvFile(envContent);

    // Generate environment section for docker-compose
    const environmentEntries = Object.keys(envVariables)
      .map((key) => `      - ${key}=\${${key}}`)
      .join("\n");

    // Create docker-compose.yml
    const dockerComposeContent = `version: "3.8"

services:
  ${serviceName}:
    build: .
    image: ${serviceName}_img
    container_name: ${serviceName}_container
    ports:
      - "${appPort}:${appPort}"
    environment:
${environmentEntries}
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
    networks:
      - app-network

networks:
  app-network:
    driver: bridge`;

    fs.writeFileSync("docker-compose.yml", dockerComposeContent, "utf8");

    console.log("Dockerfile, docker-compose.yml, and modified .env created successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
