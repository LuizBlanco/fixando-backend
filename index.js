const dotenv = require("dotenv");
const express = require('express');
const cors = require('cors');
const { setupSwagger } = require('./src/swagger');
const routes = require('./src'); // rotas centralizadas

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// usa todas as rotas que vierem de src/routes
app.use('/api', routes);

// swagger
setupSwagger(app);

// middleware de erro genérico
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


