//registered user: qwerty, qwerty@qwerty.com, pw: qwerty

const App = App || {};

App.init = function() {
  this.apiUrl = window.location.origin + "/api";

  console.log(this.apiUrl);
  this.$main = $('main');

  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));
  $('.logout').on('click', this.logout.bind(this));
  $('.usersIndex').on('click', this.usersIndex.bind(this));
  this.$main.on('submit', 'form', this.handleForm);

  if (this.getToken()) {
    this.loggedInState();
  } else {
    this.loggedOutState();
  }
};

App.usersIndex = function(){
  console.log('yeah');
};



App.loggedInState = function(){
  $('.loggedOut').hide();
  $('.loggedIn').show();
  this.mapSetup();
};

App.loggedOutState = function(){
  $('.loggedOut').show();
  $('.loggedIn').hide();
  this.login();
};


App.register = function() {
  if (event) event.preventDefault();
  this.$main.html(`
    <h2>Register</h2>
    <form method="post" action="/register">
      <div class="form-group">
        <input class='form-control' type="text" name="user[username]"
        placeholder="Username">
      </div>
      <div class='form-group'>
        <input class='form-control' type="email" name="user[email]" placeholder ="Email">
      </div>
      <div class='form-group'>
        <input class='form-control' type="password" name="user[password]" placeholder="Password">
      </div>
      <div class='form-group'>
        <input class='form-control' type="password" name="user[passwordConfirmation]"
        placeholder="Password Confirmation">
      </div>
      <div class='form-group'>
        <input class='form-control' type="text" name="user[profileText]" placeholder="Write a few words about yourself">
        <input id="register" class='btn btn-primary' type="submit" value="Register">
    </form>
    `);
};

// const currentUser = {
//   name: $('')
// };

App.login = function() {
  this.$main.html(`
    <h2>Login</h2>
      <form method="post" action="/login">
        <div class='form-group'>
          <input class="form-control" type="email" name="email" placeholder="Email">
        </div>
        <div class='form-group'>
          <input class="form-control" type="password" name="password" placeholder="Password">
        </div>
        <input id='login' class='btn btn-primary' type="submit"  value="Login">
      </form>
    `);
};

App.logout = function() {
  event.preventDefault();
  this.removeToken();
  this.loggedOutState();
  // this.$main.html(`
  //   <div id='logged-out'></div>
  //   `);
};


App.handleForm = function(){
  event.preventDefault();

  let url = `${App.apiUrl}${$(this).attr('action')}`;
  let method = $(this).attr('method');
  let data   = $(this).serialize();

  return App.ajaxRequest(url, method, data, (data) => {
    if (data.token)
    App.setToken(data.token);
    App.loggedInState();
  });
};

App.ajaxRequest = function(url, method, data, callback) {
  return $.ajax({
    url,
    method,
    data,
    beforeSend:
    this.setRequestHeader.bind(this)
  })
  .done(callback)
  .fail(data => {
    console.log(data);
  });
};

App.setRequestHeader = function (xhr, settings) {
  xhr.setRequestHeader('Authorization',`Bearer ${this.getToken()}`);
};

App.setToken = function(token){
  return window.localStorage.setItem('token', token);
};

App.getToken = function(){
  return window.localStorage.getItem('token');
};

App.removeToken = function(){
  return window.localStorage.clear();
};

//**********map***************:

App.addInfoWindowForRestaurant = function(restaurant, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    if (typeof this.infowindow != "undefined") this.infowindow.close();

    this.infowindow = new
    google.maps.InfoWindow({
      content:`<div class='info-window'>
                <h4>${restaurant.name}</h4>
                <p>${restaurant.address}</p>
                <a href="${restaurant.url}" target="_blank">Website</a>
               </div>`
    });
    this.infowindow.open(this.map, marker);
    this.map.setCenter(marker.getPosition());
  });
};

const icon = {
  url: "./images/green_v.png",
  scaledSize: new google.maps.Size(30, 30),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(0, 0)
};

App.createMarkerForRestaurant = function(restaurant) {
  // console.log(restaurant)
  let latlng = new google.maps.LatLng(restaurant.lat, restaurant.lng);
  // console.log(latlng)
  let marker = new google.maps.Marker({
    position: latlng,
    map: this.map,
    icon: icon
  });
  this.addInfoWindowForRestaurant(restaurant, marker);
};

App.loopThroughRestaurants = (data) => {
  $.each(data.restaurants, (index, restaurant) => {
      App.createMarkerForRestaurant(restaurant);
  });
};

App.getRestaurants = function(){
  let url =  `${App.apiUrl}/restaurants`;
  App.ajaxRequest(url, "GET", null, App.loopThroughRestaurants);
};

App.mapSetup = function() {
  console.log("Setting up map init");

  $("main").html("<div id='map-canvas'></div>");
  let canvas = document.getElementById('map-canvas');
  let mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(51.506178,-0.088369),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles:
    [{"featureType":"administrative","elementType":"all","stylers":[{"hue":"#ff0000"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#b3b3b3"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"hue":"#ff0000"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#454545"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"hue":"#ff0000"},{"visibility":"on"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f0f0f0"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"},{"color":"#ffffff"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#9cc1dc"},{"visibility":"on"}]}]
  };
  this.map = new google.maps.Map(canvas, mapOptions);
  this.getRestaurants();
};

$(App.init.bind(App));
