import mongoose from 'mongoose';

const bonsaiSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scientificName: { type: String, required: true },
  image: { type: String, required: true },
  owner: { type: String, required: true },
  link: { type: String, required: true },
  age: { type: Number, required: true },
  description: { type: String, required: true },
  watering: { type: String, required: true },
  sunlight: { type: String, required: true },
  pruning: { type: String, required: true },
  fertilization: { type: String, required: true },
  price: { type: Number, default: 100000000000000000000 },
});

const Bonsai = mongoose.model('Bonsai', bonsaiSchema);
export default Bonsai;
