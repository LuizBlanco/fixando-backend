const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client'); // Importar a instância do Prisma

const authenticate = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token)
        return res.status(401).json({ message: "Token não fornecido" });

    try {
        // 1. Verificar se o token está na blacklist (RevokedToken)
        const isRevoked = await prisma.revokedToken.findUnique({
            where: { token: token },
        });

        if (isRevoked) {
            return res.status(401).json({ message: "Token revogado" });
        }

        // 2. Verificar a validade do token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token inválido" });
    }
};

module.exports = authenticate;
