import express from 'express';
import Item from '../models/Item.js';
import { verifyToken } from '../middleware/auth.js';
const router = express.Router();
// Get all items
router.get('/', verifyToken, async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Create item
router.post('/', verifyToken, async (req, res) => {
    try {
        const { name, sku, description, price, stockQuantity } = req.body;
        const item = new Item({ name, sku, description, price, stockQuantity });
        await item.save();
        res.status(201).json(item);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Batch create items
router.post('/batch', verifyToken, async (req, res) => {
    try {
        const items = await Item.insertMany(req.body);
        res.status(201).json(items);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Update item
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete item
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
export default router;
//# sourceMappingURL=items.js.map