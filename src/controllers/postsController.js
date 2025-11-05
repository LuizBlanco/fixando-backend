const prisma = require('../prisma/client');

const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        const post = await prisma.post.create ({
            data: {
                title,
                content,
                authorId: req.user.id,
            },
        });

        res.status(201).json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao criar post'});
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



    module.exports = { createPost, getPosts };
