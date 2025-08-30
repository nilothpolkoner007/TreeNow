import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  district: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true, default: 'India' },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  trees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tree' }],
  climate: {
    type: String,
    enum: ['tropical', 'subtropical', 'temperate', 'arid', 'semi-arid'],
    required: true
  },
  rainfall: {
    annual: { type: Number }, // in mm
    season: { type: String, enum: ['monsoon', 'winter', 'summer', 'year-round'] }
  },
  soilType: {
    type: String,
    enum: ['clay', 'sandy', 'loamy', 'rocky', 'alluvial', 'black-cotton']
  }
}, { timestamps: true });

// Index for faster location queries
locationSchema.index({ state: 1, district: 1, city: 1 });
locationSchema.index({ coordinates: '2dsphere' });

const Location = mongoose.model('Location', locationSchema);
export default Location;