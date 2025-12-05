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
    const { commentId } = req.params;
    const id = parseInt(commentId);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ message: "Comentário não encontrado" });

    // Só o autor pode deletar
    if (comment.authorId !== req.user.id) {
      return res.status(403).json({ message: "Você não tem permissão para deletar este comentário" });
    }

    await prisma.comment.delete({ where: { id } });
    res.json({ message: "Comentário deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao deletar comentário", error: err.message });
  }
};


const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Conteúdo do comentário obrigatório" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postId),
        authorId: req.user.id,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error("Erro createComment:", err);
    res.status(500).json({ message: "Erro ao criar comentário", error: err.message });
  }
};




module.exports = { createComment, getCommentsByPost, deleteComment };

