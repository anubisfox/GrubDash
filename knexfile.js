require("dotenv").config();
const path = require("path");
const { NODE_ENV = "development" } = process.env;

const DATABASE_URL =
  NODE_ENV === "development"
    ? process.env.DEVELOPMENT_DATABASE_URL
    : NODE_ENV === "production"
    ? process.env.PRODUCTION_DATABASE_URL
    : null;

module.exports = {
  development: {
    client: "postgresql",
    connection: DATABASE_URL,
    pool: { min: 0, max: 5 },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
  },
  production: {
    client: "postgresql",
    connection: DATABASE_URL,
    pool: { min: 0, max: 5 },
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
  },
};