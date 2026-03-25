import mongoose, { Schema, Document } from 'mongoose';
const ItemSchema = new Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, default: 0 },
}, { timestamps: true });
export default mongoose.model('Item', ItemSchema);
//# sourceMappingURL=Item.js.map