const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { setupSwagger } = require('./src/swagger');

// Rotas
const routes = require('./src');
const commentRoutes = require('./src/routes/comments');
const likesRoutes = require('./src/routes/likes');

// Middleware de autenticação
const authenticate = require('./src/middlewares/authenticate');

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========= CORS =========
app.use(
  cors({
    origin: "https://tcc-fixandopc-a.vercel.app", // Domínio do front
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // importante para cookies e auth headers
  })
);

// Rotas estáticas
app.use('/uploads', express.static('uploads'));

// Rotas que precisam de autenticação
app.use('/api/posts', authenticate, commentRoutes); // posts e comentários
app.use('/likes', authenticate, likesRoutes);

// Rotas públicas ou gerais
app.use('/api', routes);

// Swagger
setupSwagger(app);

// Middleware de erro genérico
app.use((err, req, res, next) => {
  console.error('Erro interno:', err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Inicializa servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
