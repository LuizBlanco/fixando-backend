const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const toggleLike = async (req, res) => {
  try {
    const { postId, isLike } = req.body;
    const userId = req.user.id;

    // Converte o postId pra número (evita erro de tipo)
    const numericPostId = Number(postId);
    if (isNaN(numericPostId)) {
      return res.status(400).json({ error: "postId inválido" });
    }

   
    const postExists = await prisma.post.findUnique({
      where: { id: numericPostId },
    });

    if (!postExists) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

   
    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId: numericPostId } },
    });

   
    if (existing && existing.isLike === isLike) {
      await prisma.like.delete({ where: { id: existing.id } });
      return res.json({ message: "Like/Dislike removido" });
    }

   
    if (existing) {
      await prisma.like.update({
        where: { id: existing.id },
        data: { isLike },
      });
      return res.json({ message: "Atualizado com sucesso" });
    }

    
    await prisma.like.create({
      data: { userId, postId: numericPostId, isLike },
    });

    res.json({ message: "Like/Dislike adicionado" });
  } catch (error) {
    console.error("Erro no toggleLike:", error);
    res.status(500).json({ error: "Erro ao processar Like/Dislike" });
  }
};

module.exports = { toggleLike };
