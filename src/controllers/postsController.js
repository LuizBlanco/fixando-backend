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

    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: { select: { id: true, name: true, email: true } },
        comments: {
          include: {
            author: { select: { id: true, name: true } },
          },
        },
        postTags: {
          include: { tag: true },
        },
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

module.exports = { createPost, getPosts, getPostById, deletePost };
