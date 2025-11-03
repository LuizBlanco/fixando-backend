import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';

export const register = async (req, res) => {
    const {username, password} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); 

        const user = await prisma.user.create ({ 
            data: {username, password: hashedPassword }, 
        });

        res.status(201).json(   { message: 'Usárario criado com sucesso', userId: user.id });
     } catch (err){
            res.status(500).json({ error: err.message})
        }
    };

    export const login = async (req, res) => {
        const { username, password } = req.body; 

        try {
            
            const user = await prisma.user.findUnique({ where: { username } });
            if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });


            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(401).json({ message: 'Senha incorreta' });

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '1h' });

            res.json({ message: 'Login realizado', token});
        } catch (err) {
            res.status(500).json({ error: err.message }); 
        }

     };
    
