const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  lat: { type: String, trim: true, required: true },
  lng: { type: String, trim: true, required: true },
  place_id: { type: String, trim: true },
  image: { type: String, trim: true },
  openingHours: { type: Array},
  // rating:      { type: Number, required: true},
  // costBand:    { type: Number, required: true},
  address: { type: String, required: true},
  area: { type: String, required: true},
  searchString: { type: String, required: true},
  costForTwo: { type: Number, required: true},
  costBand: { type: Number, required: true},
  rating: { type: Number, required: true},
  cuisine: { type: String, trim: true, required: true },
  // photos:      { type: String, trim: true, required: true },
  website: { type: String, trim: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
