const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  lat: Number,
  lng: Number,
  contact: String
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
