import mongoose, { Schema, Document } from 'mongoose';

export interface ISale extends Document {
  item: string;
  quantity: number;
  price: number;
  customer: string;
  date: Date;
}

const SaleSchema = new Schema(
  {
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    customer: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<ISale>('Sale', SaleSchema);
