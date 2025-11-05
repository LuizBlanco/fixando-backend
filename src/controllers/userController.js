const prisma = require('../prisma/client');



const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (err) {
    console.error('Erro ao buscar usuários:', err);
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
};


const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error('Erro ao criar usuário:', err);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = Number(id);

    if (!userId) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,    // <-- corrigido
        email: true,
        createdAt: true
      }
    });

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    res.json(user);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = Number(req.params.id); // ID do usuário que você quer atualizar
    const { name, email } = req.body;     

    if (!userId) return res.status(400).json({ message: 'ID inválido' });

    // O usuário logado deve ser o mesmo do ID
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Você não pode atualizar outro usuário' });
    }

    // Verifica se o usuário existe
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) return res.status(404).json({ message: 'Usuário não encontrado' });

    // Verifica se o email já está em uso por outro usuário
    if (email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists && emailExists.id !== userId) {
        return res.status(400).json({ message: 'Email já cadastrado em outro usuário' });
      }
    }

    // Atualiza usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    res.json(updatedUser);

  } catch (err) {
    console.error('Erro ao atualizar usuário:', err); // imprime objeto completo
    res.status(500).json({ 
        message: 'Erro no servidor', 
        error: err.message, 
        stack: err.stack 
    });
}

};


module.exports = { getUsers, createUser, getUserById, updateUser};
