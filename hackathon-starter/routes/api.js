const express = require ('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');

// get a list of restarant from the db
router.get('/restaurants', function(req, res, next){
    /* Restarant.find({}).then(function(restaurants){
        res.send(restarants);
    }); */
    Restaurant.geoNear(
        {type: 'Point', coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]},
        {maxDistance: 100000, spherical: true}
    ).then(function(restaurants){
        res.send(restaurants);
    }).catch(next);
});

// add a new restarant to the db
router.post('/restaurants', function(req, res, next){
    Restaurant.create(req.body).then(function(restaurant){
        res.send(restaurant);
    }).catch(next);
});

// update a restaurant in the db
router.put('/restaurants/:id', function(req, res, next){
    Restaurant.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
        Restaurant.findOne({_id: req.params.id}).then(function(restaurant){
            res.send(restaurant);
        });
    }).catch(next);
});

// delete a restaurant from the db
router.delete('/restaurants/:id', function(req, res, next){
    Restaurant.findByIdAndRemove({_id: req.params.id}).then(function(restaurant){
        res.send(restaurant);
    }).catch(next);
});

module.exports = router;
