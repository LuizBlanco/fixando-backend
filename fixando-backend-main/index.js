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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========= CORS =========
const allowedOrigins = [
  "https://tcc-fixandopc.vercel.app",
  "https://tcc-fixandopc-a.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Rotas estáticas
app.use('/uploads', express.static('uploads'));

// Rotas autenticadas
app.use('/api/posts', authenticate, commentRoutes);
app.use('/likes', authenticate, likesRoutes);

// Rotas públicas
app.use('/api', routes);

// Swagger
setupSwagger(app);

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('Erro interno:', err.stack);
  
  // CORREÇÃO: Não expor o stack trace em produção
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(500).json({ 
      message: 'Erro interno do servidor',
      // Expor o stack trace apenas em desenvolvimento
      error: isProduction ? undefined : err.stack 
  });
});

// Inicialização
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
