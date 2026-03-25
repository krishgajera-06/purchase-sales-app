import express from 'express';
import Sale from '../models/Sale.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
const router = express.Router();
router.use(verifyToken);
router.get('/', async (req, res) => {
    try {
        const sales = await Sale.find().sort({ date: -1 });
        res.json(sales);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.post('/', requireAdmin, async (req, res) => {
    try {
        const sale = new Sale(req.body);
        const savedSale = await sale.save();
        res.status(201).json(savedSale);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Batch create sales
router.post('/batch', verifyToken, async (req, res) => {
    try {
        const sales = await Sale.insertMany(req.body);
        res.status(201).json(sales);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updatedSale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedSale);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        await Sale.findByIdAndDelete(req.params.id);
        res.json({ message: 'Sale deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
export default router;
//# sourceMappingURL=sales.js.map