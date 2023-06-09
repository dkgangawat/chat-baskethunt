const express = require('express');
const router = express.Router();
const path = require('path');
const { admin, db, storage } = require('../firebase');

const usersCollection = db.collection('users');

// Serve the admin.html file for the root route
router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'admin.html'));
});

// Handle POST request for /users
router.post('/users', async(req, res) => {
    try {
        const querySnapshot = await usersCollection.get();
        const users = querySnapshot.docs.map((doc) => doc.data());
        res.send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

module.exports = router;