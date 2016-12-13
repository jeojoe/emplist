import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const requestSchema = new Schema({
  created_at: { type: Date, default: Date.now, required: true },
  company_id: { type: String, default: '' },
  company_image: { type: String },
  company_name: { type: String, required: true },
  company_email: { type: String, required: true },
  company_location: {
    country: { type: String, required: true },
    city: { type: String, required: true },
  },
  password: { type: String, required: true },
  allow_remote: { type: Boolean, default: false, required: true },
  skills: [String],
  title: { type: String, required: true },
  exp: {
    condition: {
      type: String,
      enum: ['more_than', 'between', 'no'],
    },
    min: { type: Number },
    max: { type: Number },
    has_intern: { type: Boolean, default: false },
  },
  salary: {
    min: { type: Number },
    max: { type: Number },
  },
  details: { type: String, required: true },
  how_to_apply: { type: String, required: true },
});

export default mongoose.model('ListRequests', requestSchema);
