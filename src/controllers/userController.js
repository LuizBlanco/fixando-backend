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
    const userId = parseInt(req.params.id, 10);
if (isNaN(userId) || userId <= 0) {
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
    const userId = parseInt(req.params.id, 10);
if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ message: 'ID inválido' });
}


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

const getAllUser = async (req, res) => {
  try {
    // Aqui você buscaria no banco de dados
    // Exemplo com dados mock
    const users = [
      { id: 1, name: 'Lucas', email: 'lucas@example.com' },
      { id: 2, name: 'Ana', email: 'ana@example.com' }
    ];

    // Verifica se encontrou usuários
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'Nenhum usuário encontrado' });
    }

    // Retorna a lista de usuários
    res.status(200).json(users);

  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro interno ao buscar usuários' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validação simples do ID
    if (!id) {
      return res.status(400).json({ message: 'ID do usuário é obrigatório' });
    }

    // Aqui você faria a lógica de deletar do banco
    // Exemplo sem banco:
    const userExists = true; // substitua pela checagem real no DB

    if (!userExists) {
      return res.status(404).json({ message: `Usuário com ID ${id} não encontrado` });
    }

    // Simula a exclusão
    // await prisma.user.delete({ where: { id: Number(id) } }); // se estiver usando Prisma

    res.status(200).json({ message: `Usuário ${id} deletado com sucesso` });

  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro interno ao deletar usuário' });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id; // pega do token
    if (!userId) return res.status(400).json({ message: 'ID inválido' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    res.json(user);
  } catch (err) {
    console.error('Erro getProfile:', err);
    res.status(500).json({ message: 'Erro no servidor', error: err.message });
  }
};

// Atualizar perfil
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ pega o ID do token
    const { name, email, password } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        password: password ? await bcrypt.hash(password, 10) : undefined,
      },
    });

    res.json({
      message: "Perfil atualizado com sucesso!",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Erro ao atualizar perfil" });
  }
};


module.exports = { getUsers, createUser, getUserById, updateUser, deleteUser, getAllUser, updateProfile, getProfile};
