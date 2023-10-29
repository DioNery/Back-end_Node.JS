const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { QueryResultError } = require('pg-promise');
const pgp = require('pg-promise')();

const port = process.env.PORT || 3000; // Porta que a API irá ouvir (ou usa a porta definida nas variáveis de ambiente)

// Importe o modelo Task
const Task = require('./task');

app.use(bodyParser.json());

// Rota para listar todas as tarefas
app.get('/', async (req, res) => {
    try {
      const tasks = await Task.getAll(); // Adicione 'await' aqui
      res.setHeader('Content-Type', 'application/json');
      res.json(tasks);
    } catch (error) {
      if (error.code === pgp.errors.queryResultErrorCode.noData) {
        res.setHeader('Content-Type', 'application/json');
        res.json([]);
      } else {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar as tarefas' });
      }
    }
  });
  
// Rota para criar uma tarefa
app.post('/tasks', async (req, res) => {
  try {
    const { titulo, descricao, done } = req.body;
    const newTask = await Task.create(titulo, descricao, done);
    res.json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar a tarefa' });
  }
});

// Rota para buscar uma tarefa por ID
app.get('/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.getById(taskId);
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
