import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: Number, required: true },
  is_exist: { type: Boolean, required: true },
  country: { type: String, required: true },
  image: { type: String },
  

}, { timestamps: true });

export default mongoose.model('Brand', brandSchema);
