const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

const register = async (req, res) => {
  try {
    // mapa: aceita tanto 'name' quanto 'username' vindo do front
    const { username, name, email, password } = req.body;
    const finalName = name || username;

    // validação básica
    if (!finalName || !email || !password) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes: name/email/password" });
    }

    // verifica se já existe
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    // hash da senha e criação
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
    // envia mensagem de erro mais útil para logs; em produção não vaza detalhes sensíveis
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

    
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "segredo",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login bem-sucedido!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};


module.exports = { register, login };