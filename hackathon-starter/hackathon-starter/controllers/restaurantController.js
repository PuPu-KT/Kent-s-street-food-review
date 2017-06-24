const Restaurant = require('../models/Restaurant')

exports.getAll = function(req, res) {
  Restaurant.find(function(err, restaurants) {
    if (err) res.json({
      message: 'could not find restaurants because: ' + err
    })
    let name, address
    restaurants.forEach(function(item){
      name = item.name
      address = item.address
    })
    res.render('show-restaurants', {
      title: 'Show me my Restaurants',
      restaurants: restaurants
    })
  })
}

exports.getOne = function(req, res) {
  Restaurant.findById(req.params.id
  , function(err, restaurant) {
    if (err) res.json({
      message: 'could not find restaurant because: ' + err
    })
    res.json(restaurant)
  })
}

exports.createRestaurant = function(req, res) {
  let restaurant = new Restaurant()
  // name: String,
  // address: String,
  // lat: Number,
  // lng: Number,
  // contact: String
  restaurant.name = req.body.name
  restaurant.address = req.body.address
  restaurant.lat = req.body.lat
  restaurant.lng = req.body.lng
  restaurant.contact = req.body.contact

  restaurant.save(function(err, restaurant) {
    if (err) res.json({
      message: 'could not save restaurant because: ' + err
    })
    res.send('saved')
  })
}
