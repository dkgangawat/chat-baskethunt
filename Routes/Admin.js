const express = require('express');
const router = express.Router();
const path = require('path');
const { admin, db, storage } = require('../firebase');
const bcrypt = require('bcrypt');

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

const hashPass = async(pass) => {
    const saltRounds = 10;
    const encryptedPass = await bcrypt.hash(pass, saltRounds)
    return encryptedPass;
}

router.post("/adduser", async (req, res) => {
    const { username, email, password, photoURL = "" } = req.body;
  
    try {
      const usersCollection = db.collection("users");
      const snapshot = await usersCollection.get();
      const userCount = snapshot.size;
  
      // Insert sample users
      const hasPass = await hashPass(password);
      const newuser = {
        username,
        password: hasPass,
        email,
        photoURL,
      };
  
      const batch = db.batch();
  
      const userRef = usersCollection.doc();
      batch.set(userRef, { ...newuser, id: userRef.id });
  
      await batch.commit();
      console.log("Sample users inserted successfully");
  
      res.send();
    } catch (error) {
      console.error("Error inserting sample users:", error);
      res.status(500).json({ error: "Error inserting sample users" });
    }
  });
  
router.put('/users/:id', async(req, res) => {
    const userId = req.params.id;
    const { username, email } = req.body;

    try {
        const usersCollection = db.collection('users');
        const userDoc = usersCollection.doc(userId);
        const userSnapshot = await userDoc.get();

        if (!userSnapshot.exists) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        await userDoc.update({ username, email });
        res.sendStatus(200);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Error updating user' });
    }
});

router.delete('/users/:id', async(req, res) => {
    const userId = req.params.id;
    console.log(userId)

    try {
        const usersCollection = db.collection('users');
        const userDoc = usersCollection.doc(userId);
        const userSnapshot = await userDoc.get();

        if (!userSnapshot.exists) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        await userDoc.delete();
        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

module.exports = router;
