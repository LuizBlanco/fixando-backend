const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // Pega o token do header Authorization
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1]; // <- ESSA LINHA É OBRIGATÓRIA

    if (!token) return res.status(401).json({ message: 'Token não fornecido' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // garante que req.user.id existe
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

module.exports = authenticate;
