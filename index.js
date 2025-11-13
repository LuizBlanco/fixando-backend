const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { setupSwagger } = require('./src/swagger');

// Rotas
const routes = require('./src');
const commentRoutes = require('./src/routes/comments');
const likesRoutes = require('./src/routes/likes');

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========= CORS =========
app.use(
  cors({
    origin: "https://tcc-fixandopc-a.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rotas estáticas
app.use('/uploads', express.static('uploads'));

// Rotas específicas
app.use('/api/posts', commentRoutes);
app.use('/api', routes);
app.use('/likes', likesRoutes);

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
