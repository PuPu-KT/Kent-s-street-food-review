require('../spec_helper');
const Restaurant = require('../../models/restaurant');

// const token = process.env.TOKEN;

describe("Restaurant Controller Test", () => {
  beforeEach(done => {
    Restaurant.collection.drop();
    done();
  });
  describe("GET /api/restaurant", () => {

    beforeEach(done => {
      const Restaurant = new Restaurant ({
          name: "Ben's",
          url:  "www.bens.com",
          address: "123 Ben street Benville"
      });
      restaurant.save((err, shoe) => {
        done();
      });
    });

    it ("should return a 200 response", function(done) {
      api
        .get('/api/restaurants')
        .set('Accept', 'application/json')
        .expect(200, done);
    });

    it ('should return a JSON object', function(done) {
      api
        .get('/api/restaurants')
        .set('Accept', 'application/json')
        .end((err, res) => {
          console.log(res.body);
          expect(res.body).to.be.an('object');
          done();
        });
    });

    it ('should return an array of restaurants', function(done) {
      api
        .get('/api/restaurants')
        .set('Accept', 'application/json')
        .end((err, res) => {
          console.log(res.body);
          expect(res.body.restaurants).to.be.an('object');
          done();
        });
    });

  });
});
