const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

const register = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const finalName = name || username;

    if (!finalName || !email || !password) {
      return res.status(400).json({
        message: "Campos obrigatórios ausentes (nome, email ou senha)",
      });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: finalName,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    console.error("Erro no register:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Senha incorreta" });
    }

    // CORREÇÃO: Removido o fallback inseguro "segredo"
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    return res.json({ message: "Login bem-sucedido!", token });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};

const logout = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "Token não fornecido" });
    }

    // O token é verificado no middleware authenticate, mas vamos garantir que ele exista
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
        return res.status(400).json({ message: "Token inválido ou sem data de expiração" });
    }

    // Calcula a data de expiração do token
    const expiresAt = new Date(decoded.exp * 1000);

    // Adiciona o token à blacklist
    await prisma.revokedToken.create({
      data: {
        token: token,
        expiresAt: expiresAt,
      },
    });

    res.status(200).json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    console.error("Erro no logout:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

module.exports = { register, login, logout };
