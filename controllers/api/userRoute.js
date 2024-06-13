const express = require('express');
const router = express.Router();
const { User } = require('../../models');

// Register a new user
router.post('/', async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });
        req.session.save(() => {
            req.session.userId = newUser.id;
            req.session.username = newUser.username;
            req.session.loggedIn = true;

            res.status(201).json(newUser);
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user || !user.checkPassword(req.body.password)) {
            res.status(401).json({ message: 'Incorrect email or password' });
            return;
        }

        req.session.save(() => {
            req.session.userId = user.id;
            req.session.loggedIn = true;

            res.json({ user, message: 'You are now logged in!' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

// User logout
router.post("/logout", (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).json({ error: "No session found." });
    }
});

module.exports = router;