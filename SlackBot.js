const botkit = require('botkit');

var slackController = botkit.slackbot({
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENT_SECRET,
  scopes: ['bot'],
  redirectUri: 'http://localhost:3000/oauth',
  json_file_store: __dirname + '/.data/db/'
});

slackController.startTicking();

var bot = slackController.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM();

slackController.hears('taxi',['direct_message','direct_mention','mention'],function(bot,message) {
  bot.reply(message,`Hi, there! . Let me check your location.`);
  searchForTaxis();
});

function searchForTaxis() {
  const location = getLocation();

  fetch('http://35.204.38.8:4000/api/v1/taxis')
  .then(response => response.json())
  .then(json => {
    taxis = json;
    checkTaxi(taxis, location);
  })
  .catch(error => console.log(error));
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(function (position) {
    let location = {
      lon: position.coords.longitude,
      lat: position.coords.latitude
    };
    return location;
  });
}

function checkTaxi(taxis, location) {
  const _calcDistance = calcDistance(taxi.location, location);
  let distance = 1000000;
  let maxDistance = 200;
  let choosenTaxi;

  taxis.forEach(taxi => {
    if (taxi.state === 'free') {
      if (_calcDistance < distance) {
        distance = _calcDistance;
        choosenTaxi = distance < maxDistance ? taxi : `There's no free taxi near you right now`;
      }
    }
  });

  if (choosenTaxi !== `There's no free taxi near you right now`) {
    bot.reply(message, `Your taxi is on it's way!`);
  }
  else {
    bot.reply(message, choosenTaxi);
  }
}
