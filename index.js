const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000; // Porta que a API irá ouvir

// Configurar o body-parser para lidar com JSON
app.use(bodyParser.json());

// Conexão com o banco de dados PostgreSQL (substitua com suas próprias credenciais)
const pgp = require('pg-promise')();
const db = pgp('postgres://seu-usuario:senha@host/eledb');

// Definir uma rota para criar uma tarefa
app.post('/tasks', async (req, res) => {
  try {
    const { title, description, done } = req.body;
    const newTask = await db.one(
      'INSERT INTO tasks (title, description, done) VALUES ($1, $2, $3) RETURNING *',
      [title, description, done]
    );
    res.json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar a tarefa' });
  }
});

// Definir uma rota para recuperar todas as tarefas
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await db.any('SELECT * FROM tasks');
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar as tarefas' });
  }
});

// Definir uma rota para recuperar uma tarefa por ID
app.get('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await db.oneOrNone('SELECT * FROM tasks WHERE id = $1', taskId);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: 'Tarefa não encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar a tarefa' });
  }
});

// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor está ouvindo na porta ${port}`);
});
