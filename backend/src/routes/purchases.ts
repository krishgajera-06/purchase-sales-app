import express from 'express';
import Purchase from '../models/Purchase';
import { verifyToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ date: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    const savedPurchase = await purchase.save();
    res.status(201).json(savedPurchase);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Batch create purchases
router.post('/batch', verifyToken, async (req, res) => {
  try {
    const purchases = await Purchase.insertMany(req.body);
    res.status(201).json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPurchase);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ message: 'Purchase deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
