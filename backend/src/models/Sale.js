import mongoose, { Schema, Document } from 'mongoose';
const SaleSchema = new Schema({
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    customer: { type: String, required: true },
    date: { type: Date, default: Date.now },
}, { timestamps: true });
export default mongoose.model('Sale', SaleSchema);
//# sourceMappingURL=Sale.js.map