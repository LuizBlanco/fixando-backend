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

    // 1️⃣ Verifica se o post existe antes de prosseguir
    const postExists = await prisma.post.findUnique({
      where: { id: numericPostId },
    });

    if (!postExists) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    // 2️⃣ Verifica se o like já existe
    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId: numericPostId } },
    });

    // 3️⃣ Se já existe e é o mesmo tipo (like/dislike), remove
    if (existing && existing.isLike === isLike) {
      await prisma.like.delete({ where: { id: existing.id } });
      return res.json({ message: "Like/Dislike removido" });
    }

    // 4️⃣ Se já existe mas é diferente (trocou de like pra dislike), atualiza
    if (existing) {
      await prisma.like.update({
        where: { id: existing.id },
        data: { isLike },
      });
      return res.json({ message: "Atualizado com sucesso" });
    }

    // 5️⃣ Caso contrário, cria um novo
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
