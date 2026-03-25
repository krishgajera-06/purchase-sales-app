import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import purchaseRoutes from './routes/purchases.js';
import saleRoutes from './routes/sales.js';
import dashboardRoutes from './routes/dashboard.js';
import itemRoutes from './routes/items.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/items', itemRoutes);
if (process.env.MONGO_URI) {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB connected'))
        .catch((err) => console.log('MongoDB connection error:', err));
}
else {
    console.log('No MONGO_URI provided in .env');
}
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: process.env.NODE_ENV === 'production' ? {} : err });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map