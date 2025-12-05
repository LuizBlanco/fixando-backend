const prisma = require('../prisma/client');
const bcrypt = require('bcrypt'); // Necessário para updateProfile

// Variável auxiliar para tratamento de erros em produção
const isProduction = process.env.NODE_ENV === 'production';

// --- Funções de Leitura (Mantidas como estavam) ---

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

// **ATENÇÃO: Esta função deve ser removida ou substituída por 'register'**
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // CORREÇÃO: Adicionar hash de senha aqui se for manter esta rota
    // const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // ATENÇÃO: Senha em texto puro se não usar hash
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
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId) || userId <= 0) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
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
    res.status(500).json({ message: 'Erro no servidor', error: isProduction ? undefined : err.message });
  }
};

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


// --- Funções Corrigidas (Autorização e Tratamento de Erro) ---

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body || {};
    const userId = Number(id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    // CORREÇÃO CRÍTICA: Verifica se o usuário logado é o mesmo que está sendo atualizado
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Você não tem permissão para atualizar este usuário' });
    }

    if (!name && !email) {
      return res.status(400).json({ message: 'Nenhum dado para atualizar' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    res.json(updatedUser);
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);

    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // CORREÇÃO: Não expor detalhes do erro em produção
    res.status(500).json({ 
        message: 'Erro no servidor', 
        error: isProduction ? undefined : err.message 
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = Number(id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    // CORREÇÃO CRÍTICA: Verifica se o usuário logado é o mesmo que está sendo deletado
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Você não tem permissão para deletar este usuário' });
    }

    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar usuário:', err);
    
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // CORREÇÃO: Não expor detalhes do erro em produção
    res.status(500).json({ 
        message: 'Erro no servidor', 
        error: isProduction ? undefined : err.message 
    });
  }
};

// --- Exportação ---

module.exports = { 
    getUsers, 
    createUser, // Lembre-se de remover a rota POST /users
    getUserById, 
    updateUser, 
    deleteUser, 
    getProfile, 
    updateProfile 
};
