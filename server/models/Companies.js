import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const companySchema = new Schema({
  company_image: { type: String },
  company_name: { type: String, required: true },
  company_email: { type: String, required: true },
  company_location: {
    country: { type: String, required: true },
    city: { type: String, required: true },
  },
  password: { type: String, required: true },
  allow_remote: Boolean,
  list_id: { type: String, required: true },
});

export default mongoose.model('Companies', companySchema);
