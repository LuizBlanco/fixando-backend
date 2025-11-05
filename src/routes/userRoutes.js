const express = require('express');
const router = express.Router();
const { getUsers, createUser, getUserById, updateUser} = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', authenticate, updateUser);


module.exports = router;
