// Could not resolve connection issues with Slack

// Tool for building bots
const botkit = require('botkit');

// Bot configuration
var slackController = botkit.slackbot({
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENT_SECRET,
  scopes: ['bot'],
  json_file_store: __dirname + '/.data/db/'
});

// Start bot
slackController.startTicking();
var bot = slackController.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM();

// Bot response to 'taxi' in direct message, direct mention and mention
slackController.hears('taxi',['direct_message','direct_mention','mention'],function(bot,message) {
  bot.reply(message,`Hi, there! . Let me check your location.`);

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
  navigator.geolocation.getCurrentPosition(function (position) {
    let location = {
      lon: position.coords.longitude,
      lat: position.coords.latitude
    };
    return location;
  });
}

// This function gets the distance between every taxi and the user location
// and returns the nearest taxi; if there's no free taxi near, the bot sends
// a message informing
function checkTaxi(taxis, location) {
  let distance = 1000000;
  let maxDistance = 200;
  let choosenTaxi;

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

  // Bot post a message in Slack
  if (choosenTaxi !== `There's no free taxi near you right now`) {
    bot.reply(message, `Your taxi is on it's way!`);
  }
  else {
    bot.reply(message, choosenTaxi);
  }
}

// Returns distance between the taxi's location and the user's location
function calcDistance(taxiLocation, userLocation) {
  var p = 0.017453292519943295; // Math.PI / 18
  var c = Math.cos;
  var a = 0.5 - c((userLocation.lat - taxiLocation.lat) * p) / 2 + c(taxiLocation.lat * p) * c(userLocation.lat * p) * (1 - c((userLocation.lon - taxiLocation.lon) * p)) / 2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }
