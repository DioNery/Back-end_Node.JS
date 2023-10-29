require('dotenv').config();
const db = require('./db'); 

class Task {
  constructor(id, titulo, descricao, done) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.done = done;
  }

  static async getAll() {
    return db.many('SELECT * FROM tasks');
  }

  static async create(titulo, descricao, done) {
    return db.one('INSERT INTO tasks (titulo, descricao, done) VALUES ($1, $2, $3) RETURNING *', [titulo, descricao, done])
      .then(data => new Task(data.id, data.titulo, data.descricao, data.done));
  }

  static async getById(id) {
    return db.one('SELECT * FROM tasks WHERE id = $1', id)
      .then(data => new Task(data.id, data.titulo, data.descricao, data.done));
  }

  static async update(id, titulo, descricao, done) {
    return db.one('UPDATE tasks SET titulo = $1, descricao = $2, done = $3 WHERE id = $4 RETURNING *', [titulo, descricao, done, id])
      .then(data => new Task(data.id, data.titulo, data.descricao, data.done));
  }

  static async delete(id) {
    return db.none('DELETE FROM tasks WHERE id = $1', id);
  }


}

module.exports = Task;
