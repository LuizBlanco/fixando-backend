const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { setupSwagger } = require('./src/swagger');

// Importa as rotas centralizadas
const routes = require('./src');
const commentRoutes = require('./src/routes/comments');

dotenv.config();

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas específicas
app.use('/api/posts', commentRoutes);

// Rotas gerais centralizadas
app.use('/api', routes);

// index.js na raiz do projeto
app.use('/likes', require('./src/routes/likes'));

app.use('/uploads', express.static('uploads'));





// Configuração do Swagger
setupSwagger(app);

// Middleware de erro genérico
app.use((err, req, res, next) => {
  console.error('Erro interno:', err.stack);
  res.status(500).json({ message: ' Erro interno do servidor' });
});

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor rodando na porta ${PORT}`);
});
