const prisma = require('../prisma/client');



const creatPost = async (req, res) => {
    try {
        const { title, content, tags = [] } = req.body;
        if (!title || !content) return res.status(400).json({ message: 'conteúdo obrigatório' });

        const comment = await prisma.comment.create({
            data: {
                content,
                postId: parseInt(postId),
                authorId: req.user.id,
            },
            include: {
                author: { select: { id: true, name: true, email: true } },

            },
        });

        res.status(201).json(comment);
    } catch (err) {
        console.error('Erro crearComment:', err);
        res.status(500).json({ message: 'Erro ao criar comentário', error: err.message});
    }

};

const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await prisma.comment.findMany({
            where: {postId: parseInt(postId) },
            include: {
                author: { select: { id: true, name: true} },
            },
            orderBy: { createdAt: 'asc' },
        });

        res.json(comments);
    } catch (err) {
        console.error('Erro getCommentsByPost:', err);
        res.status(500).json({ message: 'Erro ao listar comentários', error: err.message });
    }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await prisma.comment.findUnique({ where: { id: parseInt(id) } });

    if (!comment) return res.status(404).json({ message: 'Comentário não encontrado' });

    
    const post = await prisma.post.findUnique({ where: { id: comment.postId } });

    if (comment.authorId !== req.user.id && post.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Ação proibida' });
    }

    await prisma.comment.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Comentário deletado com sucesso' });
  } catch (err) {
    console.error('Erro deleteComment:', err);
    res.status(500).json({ message: 'Erro ao deletar comentário', error: err.message });
  }
};

const createComment = async (req, res) => {
  try {
    res.status(200).json({ message: 'Comentário criado com sucesso (placeholder)' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar comentário' });
  }
};

module.exports = { createComment, getCommentsByPost, deleteComment };

