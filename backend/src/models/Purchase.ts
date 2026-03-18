import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchase extends Document {
  item: string;
  quantity: number;
  price: number;
  supplier: string;
  date: Date;
}

const PurchaseSchema = new Schema(
  {
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    supplier: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IPurchase>('Purchase', PurchaseSchema);
