
const prisma = require('../prisma/client');

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: req.user.id,
      },
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar post' });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: true,
        postTags: {
          include: { tag: true },
        },
      },
    });

    const postsWithTags = posts.map(post => ({
      ...post,
      tags: post.postTags.map(pt => pt.tag.name),
      postTags: undefined,
    }));

    res.json(postsWithTags);
  } catch (err) {
    console.error("Erro ao listar posts:", err);
    res.status(500).json({ message: "Erro ao listar o post", error: err.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { id: true, name: true, email: true } },
        comments: { include: { author: { select: { id: true, name: true } } } },
        postTags: { include: { tag: true } },
      },
    });

    if (!post) return res.status(404).json({ message: 'Post não encontrado' });

    const postWithTags = {
      ...post,
      tags: post.postTags.map(pt => pt.tag.name),
      postTags: undefined,
    };

    res.json(postWithTags);
  } catch (err) {
    console.error('Erro ao buscar post:', err);
    res.status(500).json({ message: 'Erro ao buscar post', error: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
    if (!post) return res.status(404).json({ message: 'Post não encontrado' });

    if (post.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Você não tem permissão para deletar este post' });
    }

    await prisma.post.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Post deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar post:', err);
    res.status(500).json({ message: 'Erro ao deletar post', error: err.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ message: 'Post não encontrado' });

    if (post.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Você não pode editar este post' });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { title, content },
    });

    res.json(updatedPost);
  } catch (err) {
    console.error('Erro ao atualizar post:', err);
    res.status(500).json({ message: 'Erro ao atualizar post', error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body || {};
    const userId = Number(id);

    if (!userId) {
      return res.status(400).json({ message: 'ID inválido' });
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

    res.status(500).json({ message: 'Erro no servidor', error: err.message });
  }
};


module.exports = { createPost, getPosts, getPostById, deletePost, updatePost, updateUser };
