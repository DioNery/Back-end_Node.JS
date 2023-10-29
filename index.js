const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000; // Porta que a API irá ouvir (ou usa a porta definida nas variáveis de ambiente)

// Importe o modelo Task
const Task = require('./task');

// Configurar o body-parser para lidar com JSON
app.use(bodyParser.json());

// Rota para criar uma tarefa
app.post('/tasks', async (req, res) => {
    try {
      const { titulo, descricao, done } = req.body; // Altere aqui
      const newTask = await db.one(
        'INSERT INTO tasks (title, description, done) VALUES ($1, $2, $3) RETURNING *',
        [titulo, descricao, done]
      );
      res.json(newTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar a tarefa' });
    }
  });
  

// Rota para listar todas as tarefas
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.getAll();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar as tarefas' });
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
