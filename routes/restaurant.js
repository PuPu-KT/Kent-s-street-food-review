const express = require('express')
const router = express.Router()
const restaurantController = require('../controllers/restaurantController')

router.get('/', function(req, res, next) {
  res.render('restaurant', {
    title: 'Restaurant'
  })
})

// route to get all restaurants
router.get('/all', restaurantController.getAll)

// route to get one restaurant by id
router.get('/:id', restaurantController.getOne)

// route to create restaurant
router.post('/create', restaurantController.createRestaurant)

module.exports = router

//
// module.exports = {
//   index:  restaurantsIndex,
//   // >> show:   restaurantsShow
// };
//
// const Restaurant = require("../models/restaurant");
//
// function restaurantsIndex(req, res){
//   Restaurant.find({}, (err, restaurants) => {
//     if (err) return res.status(500).json({ message: "Something went wrong." });
//     return res.status(200).json({ restaurants });
//   });
// }
