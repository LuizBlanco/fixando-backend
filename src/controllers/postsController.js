const prisma = require('../prisma/client');

const createPost = async (req, res) => {
  try {
    // DEBUG: veja o que o Multer recebeu
    console.log("req.body:", req.body);
    console.log("req.file:", req.file.filename);

    const { title, content } = req.body;
    const userId = req.user.id; // vem do token
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        image: imageUrl,
        authorId: userId,
      },
    });

    res.status(201).json({ message: 'Post criado com sucesso!', post });
  } catch (error) {
    console.error("Erro ao criar post:", error);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        comments: true,
        likes: true,
        postTags: {
          include: { tag: true },
        },
      },
      orderBy: {
        createdAt: "desc", // posts mais novos primeiro
      },
    });

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      image: post.image,
      createdAt: post.createdAt,
      author: post.author,
      tags: post.postTags.map((pt) => pt.tag.name),
      likeCount: post.likes.length,
      commentCount: post.comments.length,
    }));

    res.json(formattedPosts);
  } catch (err) {
    console.error("Erro ao listar posts:", err);
    res.status(500).json({ message: "Erro ao listar posts", error: err.message });
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

const getPostsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        comments: true,
        likes: true,
        postTags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = posts.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      image: post.image,
      createdAt: post.createdAt,
      author: post.author,
      tags: post.postTags.map((pt) => pt.tag.name),
      likeCount: post.likes.length,
      commentCount: post.comments.length,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Erro ao buscar posts do usuário:", err);
    res.status(500).json({ message: "Erro ao buscar posts do usuário", error: err.message });
  }
};

const getPostStats = async (req, res) => {
  try {
    const { id } = req.params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    // Verifica se o post existe
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    // Conta likes e comentários
    const [likeCount, commentCount] = await Promise.all([
      prisma.like.count({ where: { postId } }),
      prisma.comment.count({ where: { postId } }),
    ]);

    res.json({
      postId,
      likeCount,
      commentCount,
    });
  } catch (err) {
    console.error('Erro ao buscar estatísticas do post:', err);
    res.status(500).json({ message: 'Erro ao buscar estatísticas do post', error: err.message });
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

module.exports = { createPost, getPosts, getPostById, deletePost, updatePost, getPostsByUser, getPostStats };
