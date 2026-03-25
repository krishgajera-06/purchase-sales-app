import mongoose, { Document } from 'mongoose';
export interface IPurchase extends Document {
    item: string;
    quantity: number;
    price: number;
    supplier: string;
    date: Date;
}
declare const _default: mongoose.Model<IPurchase, {}, {}, {}, mongoose.Document<unknown, {}, IPurchase, {}, mongoose.DefaultSchemaOptions> & IPurchase & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPurchase>;
export default _default;
//# sourceMappingURL=Purchase.d.ts.map