import express from 'express';
import Purchase from '../models/Purchase';
import Sale from '../models/Sale';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.use(verifyToken);

router.get('/stats', async (req, res) => {
  try {
    const purchases = await Purchase.find();
    const sales = await Sale.find();

    const totalPurchases = purchases.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const totalSales = sales.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const profit = totalSales - totalPurchases;

    const recentActivity = [
      ...purchases.map(p => ({ type: 'purchase', date: p.date, item: p.item, amount: p.price * p.quantity })),
      ...sales.map(s => ({ type: 'sale', date: s.date, item: s.item, amount: s.price * s.quantity }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    res.json({
      totalPurchases,
      totalSales,
      profit,
      purchasesCount: purchases.length,
      salesCount: sales.length,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
