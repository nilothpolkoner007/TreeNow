import mongoose from 'mongoose';

const treeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scientificName: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  watering: { type: String, required: true },
  sunlight: { type: String, required: true },
  specialCare: { type: String, required: true }, 
  pruning: { type: String, required: true },
  fertilization: { type: String, required: true },

});

const Tree = mongoose.model('Tree', treeSchema);
export default Tree;
