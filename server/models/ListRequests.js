import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const requestSchema = new Schema({
  request_type: {
    type: String,
    enum: ['new', 'edit'],
    required: true,
  },
  is_approved: { type: Boolean, default: false },
  list_id: { type: String, default: '' },
  additional_note: { type: String },
  request_promote: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  company_id: { type: String, default: '' },
  company_image: { type: String, default: '' },
  company_name: { type: String, required: true },
  company_email: { type: String, default: '' },
  company_location: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    detail: { type: String, required: true },
  },
  password: { type: String, default: '' },
  allow_remote: { type: Boolean, default: false, required: true },
  skills: { type: [String], default: [] },
  title: { type: String, required: true },
  has_intern: { type: Boolean, default: false },
  has_equity: { type: Boolean, default: false },
  salary: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 9999999 },
  },
  details: { type: String, required: true },
  how_to_apply: { type: String, required: true },
});

export default mongoose.model('ListRequests', requestSchema);
