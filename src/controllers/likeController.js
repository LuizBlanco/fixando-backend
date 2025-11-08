const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const toggleLike = async (req, res) => {
    try {
        console.log('Corpo da requisição:', req.body);
        console.log('Usuário logado:', req.user);

        const { postId, isLike } = req.body; // ⚠️ atenção aqui
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }

        const existing = await prisma.like.findUnique({
            where: { userId_postId: { userId, postId } },
        });

        if (existing) {
            if (existing.isLike === isLike) {
                await prisma.like.delete({ where: { id: existing.id } });
                return res.json({ message: 'Like/Dislike removido' });
            }

            await prisma.like.update({
                where: { id: existing.id },
                data: { isLike },
            });
            return res.json({ message: 'Atualizado com sucesso' });
        }

        await prisma.like.create({ data: { userId, postId, isLike } });
        res.json({ message: 'Like/Dislike adicionado' });

    } catch (error) {
        console.error('Erro no toggleLike:', error);
        res.status(500).json({ error: 'Erro ao processar Like/Dislike' });
    }
};


module.exports = { toggleLike };