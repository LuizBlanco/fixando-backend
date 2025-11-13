const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { setupSwagger } = require('./src/swagger');

// Importa as rotas centralizadas
const routes = require('./src');
const commentRoutes = require('./src/routes/comments');
const likeRoutes = require('./src/routes/likes');

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

// ========== ROTAS ==========
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api', routes);

// ========== SWAGGER ==========
setupSwagger(app);

// ========== MIDDLEWARE DE ERRO ==========
app.use((err, req, res, next) => {
  console.error('Erro interno:', err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// ========== SERVIDOR ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
