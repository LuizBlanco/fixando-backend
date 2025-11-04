const express = require ('express');
const cors = require ('cors');
const dotenv = require ('dotenv');
const { swaggerDocs } = require("./src/swagger");


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require ('./src/routes/auth');
app.use('/api/auth', authRoutes);

swaggerDocs(app);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);

});

