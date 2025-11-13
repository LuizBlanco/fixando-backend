const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { setupSwagger } = require('./src/swagger');

// Importa as rotas centralizadas
const routes = require('./src');
const commentRoutes = require('./src/routes/comments');

dotenv.config();

const app = express();

// ========== CORS CONFIG ==========
app.use(
  cors({
    origin: "https://tcc-fixandopc.vercel.app", // domínio do front-end
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors()); // libera preflight para todos os endpoints

// ========== MIDDLEWARES ==========
app.use(express.json());
app.use('/uploads', express.static('uploads'));








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
