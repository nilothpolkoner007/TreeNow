import mongoose from 'mongoose';

const diseaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  images: [{ type: String, required: true }],
    tree: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tree' }],
    symptoms: [{ type: String, required: true }],
    solutions: [{ type: String, }],
    category: { type: String, default: '' },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true },
);

const Disease = mongoose.model('Disease', diseaseSchema);
export default Disease;
