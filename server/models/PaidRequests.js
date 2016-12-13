import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const requestSchema = new Schema({
  company_id: { type: String, required: true },
});

export default mongoose.model('PaidRequests', requestSchema);
