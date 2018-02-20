// Tool for building bots
var Botkit = require ('botkit');
var fetch = require ('node-fetch');
var controller = Botkit.slackbot();
var bodyParser = require('body-parser');

require ('dotenv').config();

// Bot configuration
var bot = controller.spawn({
  token: process.env.BOT_TOKEN
 });

// Start bot
bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

// Bot response to 'taxi' in direct message, direct mention and mention
controller.hears('taxi',['direct_message','direct_mention','mention'],function(bot,message) {
  bot.reply(message,`Hi, there! . Let me check your location.`);

  channel = message.channel;

  searchForTaxis();
});

// This function retrieves a taxi list and trigger checkTaxi()
function searchForTaxis() {
  const location = getLocation();

  // Get info about all taxis from Cabify API
  fetch('http://35.204.38.8:4000/api/v1/taxis')
  .then(response => response.json())
  .then(json => {
    taxis = json;
    checkTaxi(taxis, location);
  })
  .catch(error => console.log(error));
}

// Get user location
function getLocation() {

  // Mocked location
  const location = {
    "lon": 1.3123,
    "lat": 38.123
  };

  // This should get user location but doesn't work
  // navigator.geolocation.getCurrentPosition(function (position) {
  //   let location = {
  //     lon: position.coords.longitude,
  //     lat: position.coords.latitude
  //   };
    return location;
}

// This function gets the distance between every taxi and the user location
// and returns the nearest taxi; if there's no free taxi near, the bot sends
// a message informing
function checkTaxi(taxis, location) {
  let distance = 1000000;
  let maxDistance = 200;
  let choosenTaxi;
  const data = {
    state: 'hired'
  };

  // Checks every taxi and calculates its distance to the user's location
  taxis.forEach(taxi => {
    if (taxi.state === 'free') {
      let _calcDistance = calcDistance(taxi.location, location);
      if (_calcDistance < distance) {
        distance = _calcDistance;
        choosenTaxi = distance < maxDistance ? taxi : `There's no free taxi near you right now`;
      }
    }
  });

  // Try to change taxi's state to hired
  fetch(`http://35.204.38.8:4000/api/v1/taxis/${choosenTaxi.city}/${choosenTaxi.name}`,{
    method: 'post',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
  .then(response => {
    if (response.status !== 200) {
      choosenTaxi = `There was an error trying to hire your taxi, please try again`;
    }
  })
  .catch(error => console.log(error));


  // Bot post a message in Slack
  if (choosenTaxi !== `There's no free taxi near you right now`) {
    bot.say({
      text: `Your taxi is on it's way!`,
      channel
  });
    bot.say({
      text: JSON.stringify(choosenTaxi),
      channel
    });
  }
  else {
    bot.say({
      text: choosenTaxi,
      channel
    });
  }
}

// Returns distance between the taxi's location and the user's location
function calcDistance(taxiLocation, userLocation) {
  var p = 0.017453292519943295; // Math.PI / 18
  var c = Math.cos;
  var a = 0.5 - c((userLocation.lat - taxiLocation.lat) * p) / 2 + c(taxiLocation.lat * p) * c(userLocation.lat * p) * (1 - c((userLocation.lon - taxiLocation.lon) * p)) / 2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }
