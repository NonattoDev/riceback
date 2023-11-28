import knex from "knex";

const db = knex({
  client: "mssql",
  connection: {
    server: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "1433"), // Provide a default value for DB_PORT
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  },
});

export default db;
