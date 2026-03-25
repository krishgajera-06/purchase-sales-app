import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';
const router = express.Router();
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        // Create new user
        const newUser = new User({ username, passwordHash, role: role || 'admin' });
        await newUser.save();
        res.status(201).json({ message: 'User created' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Generate token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            token,
            user: { id: user._id, username: user.username, role: user.role },
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user?.id).select('-passwordHash');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
export default router;
//# sourceMappingURL=auth.js.map