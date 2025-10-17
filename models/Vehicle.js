import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  name: { type: String, required: true },
  color: [{ type: String }],
  price: { type: Number, required: true },
  image: { type: String },
}, { timestamps: true });

export default mongoose.model('Vehicle', vehicleSchema);
