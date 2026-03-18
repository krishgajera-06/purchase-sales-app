import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  role: 'admin' | 'viewer';
}

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'viewer'], default: 'viewer' },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
