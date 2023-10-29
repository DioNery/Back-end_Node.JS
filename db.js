const pgp = require('pg-promise')();
require('dotenv').config();
const connectionString = process.env.DATABASE_URL; // A URL do banco de dados deve ser configurada nas variáveis de ambiente

const db = pgp(connectionString);

module.exports = db;
