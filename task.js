const pgp = require('pg-promise')();
const dotenv = require('dotenv');
dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

// Conexão com o banco de dados PostgreSQL usando variáveis de ambiente
const db = pgp({
  connectionString: process.env.DATABASE_URL, // Variável de ambiente para a URL do banco de dados
  ssl: { rejectUnauthorized: false }, // Configuração para SSL (ajuste conforme necessário)
});

class Task {
    constructor(id, titulo, descricao, done) {
        this.id = id;
        this.titulo = titulo; // Altere aqui
        this.descricao = descricao; // Altere aqui
        this.done = done;
      }
    
      static create(titulo, descricao, done) {
        return db.one(
          'INSERT INTO tasks (title, description, done) VALUES ($1, $2, $3) RETURNING *',
          [titulo, descricao, done] // Altere aqui
        ).then(data => new Task(data.id, data.titulo, data.descricao, data.done)); // Altere aqui
      }

  static async getAll() {
    const tasks = await db.any('SELECT * FROM tasks');
      return tasks.map(task => new Task(task.id, task.title, task.description, task.done));
  }

  static async getById(id) {
    const task = await db.oneOrNone('SELECT * FROM tasks WHERE id = $1', id);
      if (task) {
          return new Task(task.id, task.title, task.description, task.done);
      } else {
          return null;
      }
  }
}

module.exports = Task;
