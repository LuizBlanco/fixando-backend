import express from 'express';
import cors from 'cors';
import dotenn from 'dotenv';

configDotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

import authRoutes from './src/routes/auth';
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Servidor rodando na porta ${PORT}');
});

