import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const companySchema = new Schema({
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  company_image: { type: String },
  company_name: { type: String, required: true },
  company_email: { type: String, required: true },
  company_location: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    detail: { type: String, required: true },
  },
  password: { type: String, required: true },
  allow_remote: { type: Boolean, required: true },
  list_id: { type: String, default: '' },
});

export default mongoose.model('Companies', companySchema);
