const express = require('express');
const { registerUser, loginUser, recoverPassword } = require('../controller/authController');
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({ message: 'User registered successfully!', user: { id: user.id, username: user.username, name: user.name } });
    } catch (error) {
        console.error('Registration route error:', error);
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { user, token } = await loginUser(req.body);
        res.status(200).json({ message: 'Login successful!', user: { id: user.id, username: user.username }, token });
    } catch (error) {
        console.error('Login route error:', error);
        res.status(401).json({ error: error.message });
    }
});

router.post('/recover-password', async (req, res) => {
    try {
        const result = await recoverPassword(req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error('Password recovery error:', error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
