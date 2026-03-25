import mongoose, { Schema, Document } from 'mongoose';
const PurchaseSchema = new Schema({
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    supplier: { type: String, required: true },
    date: { type: Date, default: Date.now },
}, { timestamps: true });
export default mongoose.model('Purchase', PurchaseSchema);
//# sourceMappingURL=Purchase.js.map