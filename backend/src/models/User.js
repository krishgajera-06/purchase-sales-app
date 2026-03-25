import mongoose, { Schema, Document } from 'mongoose';
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'viewer'], default: 'viewer' },
}, { timestamps: true });
export default mongoose.model('User', UserSchema);
//# sourceMappingURL=User.js.map