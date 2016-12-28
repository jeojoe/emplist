import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  username: { type: String, required: true },
  password: { type: String, required: true },
  is_admin: { type: Boolean, default: false },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
});

userSchema.index({ username: 1 });

export default mongoose.model('Users', userSchema);
