  // Mock data for testing
const taxis = [{
    "state": "free",
    "name": "Skoda4",
    "location": {
      "lon": 1.3123,
      "lat": 38.123
    },
    "city": "Madrid"
  },
  {
    "state": "free",
    "name": "Renault",
    "location": {
      "lon": 2.154,
      "lat": 41.39
    },
    "city": "Barcelona"
  },
  {
    "state": "free",
    "name": "Hyundai",
    "location": {
      "lon": 1.2313,
      "lat": 38.41
    },
    "city": "Madrid"
  },
  {
    "state": "free",
    "name": "Opel",
    "location": {
      "lon": 1.399,
      "lat": 38.88
    },
    "city": "Madrid"
  }
];

class QAbifyBot {
  constructor() {
    this.maxDistance = 100;
    this._response = 'Ok! I will order you a taxi';
    this._nextAnswer = 'Ok! I will search for your nearest taxi';
  }

  // Confirm that the user said 'taxi'
  execute(command) {
    const lowerCasedCommand = command.toLowerCase();
    const taxiInCommand = lowerCasedCommand.indexOf('taxi') > -1;
    if (!taxiInCommand) {
      this._response = 'Sorry, I dont understand you';
    }

    return this;
  }

  // Returns newest response
  response() {
    return this._response;
  }

  nextAnswer() {
    return this._nextAnswer;
  }

  //
  searchTaxi(location) {
    let yourTaxi = 'No free taxi near you';
    let distance = 1000000000000;

    // This will get user location directly from its browser
    // navigator.geolocation.getCurrentPosition(function(position) {
    //   location = {
    //     lon: position.coords.longitude,
    //     lat: position.coords.latitude
    //   };
    // });

    // This function retrieves data from API
    // and chooses one taxi comparing locations
  //   fetch('http://35.204.38.8:4000/api/v1/taxis')
  //   .then(response => response.json())
  //   .then(json => {
  //     this.taxis = json;
  //     this.taxis.forEach(taxi => {
  //       if (taxi.state === 'free') {
  //         let _calcDistance = this.calcDistance(taxi.location, location);
  //         if (_calcDistance < distance) {
  //           distance = _calcDistance;
  //           yourTaxi = (distance < this.maxDistance) ? taxi : 'No free taxi near you';
  //         }
  //       }
  //     });
  //     this._nextAnswer = (yourTaxi === 'No free taxi near you') ? `Sorry, there's no free taxi near you` : `Your taxi in ${yourTaxi.city} is on it's way!`;
  //     console.log (this._nextAnswer);
  //     console.log (yourTaxi);
  //   })
  //   .catch(error => console.log(error.message));
  // }

  // Checks every taxi and calculates its distance to the user's location
  taxis.forEach(taxi => {
    if (taxi.state === 'free') {
      let _calcDistance = this.calcDistance(taxi.location, location);
      if (_calcDistance < distance) {
        distance = _calcDistance;
        yourTaxi = (distance < this.maxDistance) ? taxi : 'No free taxi near you';
      }
    }
  });

  // Informs the user if there's a taxi near
  this._nextAnswer = (yourTaxi === 'No free taxi near you') ? `Sorry, there's no free taxi near you` : `Your taxi in ${yourTaxi.city} is on it's way!`;
}

// Returns distance between the taxi's location and the user's location
  calcDistance(localization1, localization2) {
    var p = 0.017453292519943295; // Math.PI / 18
    var c = Math.cos;
    var a = 0.5 - c((localization2.lat - localization1.lat) * p) / 2 +
      c(localization1.lat * p) * c(localization2.lat * p) *
      (1 - c((localization2.lon - localization1.lon) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }

  // Set chosen taxi's status to 'hired'
  hireATaxi(taxi) {

    // API request
    // const city = taxi.city;
    // const car = taxi.name;
    // const data = {
	  //   "state": "hired"
    // };
    // const message = '';
    // fetch(`http://35.204.38.8:4000/api/v1/taxis/${city}/${car}`, {
    //   method: "POST",
    //   body: JSON.stringify(data)
    // })
    // .then(response => message = `Your taxi is on its way!`);
    // .catch(error => message = error);
    //
    // return message;

    if (taxi) {
      taxi.status = 'hired';
      return `Your taxi is on its way!`;
    }
    else {
      return `Sorry, something went wrong.`;
    }
  }

}
