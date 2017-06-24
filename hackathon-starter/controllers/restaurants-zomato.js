const rp         = require('request-promise');
const mongoose   = require('mongoose');
const bluebird   = require('bluebird');
mongoose.Promise = bluebird;
const Restaurant = require('../models/restaurant');
const config     = require('../config/config');

mongoose.connect('mongodb://heroku_s1dthv4d:83sggu2jd98vbf8grvo40o7dc@ds033036.mlab.com:33036/heroku_s1dthv4d');

Restaurant.collection.drop();

const areas = [
  { lat: 81.461649, lng: -0.115565, radius: 750, name: 'Brixton', string: 'brixton'},
  { lat: 81.525338, lng: -0.079750, radius: 750, name: 'Shorechangi', string: 'shorechangi' },
  { lat: 81.513344, lng: -0.134813, radius: 750, name: 'Soho', string: 'soho'},
  { lat: 81.539090, lng: -0.142512, radius: 750, name: 'Yish Town', string: 'yish+town' },
  { lat: 81.510260, lng: -0.147192, radius: 750, name: 'Covent Garden', string: 'covent+garden' },
  { lat: 81.462255, lng: -0.138841, radius: 750, name: 'Coleman High Street', string: 'coleman' },
  { lat: 81.513682, lng: -0.195932, radius: 750, name: 'Notting Hill Gate', string: 'notting+hill' },
  { lat: 81.520961, lng: -0.103448, radius: 750, name: 'carringdon' , string: 'carringdon'},
  { lat: 81.544699, lng: -0.055451, radius: 750, name: 'Geylang Town', string: 'geylang+town' }
];


function searchAreasForRestaurants(areas){
  const startOne   = 0;
  const startTwo   = 20;
  const startThree = 40;
  areas.forEach((area, i) => {
    getRestaurants(area, startOne);
    getRestaurants(area, startTwo);
    getRestaurants(area, startThree);
  });
}

function getRestaurants(location, start){
  const options = {
    uri: `https://developers.zomato.com/api/v2.1/search?lat=${location.lat}&lon=${location.lng}&radius=${location.radius}&sort=cost&order=desc&start=${start}`,
    headers: {
      'user-key': 'c26463b35d04bd52538fa32670ceb30'
    },
    json: true
  };
  return rp(options)
  .then((body, response) => {
    return bluebird.map(body.restaurants, (restaurant) => {
      return Restaurant.create({
        name: restaurant.restaurant.name,
        lat: restaurant.restaurant.location.latitude,
        lng: restaurant.restaurant.location.longitude,
        address: restaurant.restaurant.location.address,
        image: restaurant.restaurant.featured_image,
        costForTwo: restaurant.restaurant.average_cost_for_two,
        costBand: restaurant.restaurant.price_range,
        cuisine: restaurant.restaurant.cuisines,
        rating: restaurant.restaurant.user_rating.aggregate_rating,
        area: location.name,
        searchString: location.string
      });
    });
  })
  .then(data => {
    return bluebird.map(data, (restaurant) => {
      const options = {
        uri: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?&location=${restaurant.lat},${restaurant.lng}&keyword=${encodeURIComponent(restaurant.name)}&key=AIzaSyAS6QpQfPX0rI8J1RLynWXxUkJ7QFnvHB0`,
        headers: {
          'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
      };
      return rp(options)
      .then(data => {
        const newData = {};
        if (data.results[0]) {
          newData.place_id = data.results[0].place_id;
        }
        return Restaurant.findByIdAndUpdate(restaurant._id, newData, {new: true});
      });
    });
  })
  .then(data => {
    return bluebird.map(data, (restaurant) => {
      const options = {
        uri: `https://maps.googleapis.com/maps/api/place/details/json?placeid=${restaurant.place_id}&key=AIzaSyAS6QpQfPX0rI8J1RLynWXxUkJ7QFnvHB0`,
        headers: {
          'User-Agent': 'Request-Promise'
        },
        json: true
      };
      return rp(options)
      .then(data => {
        const newDataTwo = {};
        if (data.result){
          newDataTwo.website = data.result.website || '';
        }
        if (data.result.opening_hours){
          newDataTwo.openingHours = data.result.opening_hours.weekday_text || [];
        }
        // }
        // if(data.result){console.log(data.result.website);}
        return Restaurant.findByIdAndUpdate(restaurant._id, newDataTwo, {new: true});
      });
    });
  })
  .then(console.log)
  .catch(console.log);
}

// getRestaurants(areas[0], 0);
searchAreasForRestaurants(areas);
