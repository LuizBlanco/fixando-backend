const express = require ('express');
const cors = require ('cors');
const dotenv = require ('dotenv');
const { swaggerDocs } = require("./src/swagger");
const postRoutes = require('./src/routes/posts');


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/posts', postRoutes);

const authRoutes = require ('./src/routes/auth');
app.use('/api/auth', authRoutes);

swaggerDocs(app);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro interno do servidor'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);

});

