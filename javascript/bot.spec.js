//TESTING

describe('My awesome QAbify bot', () => {

  // If the user text something with "taxi" in it, the Bot informs that he's going to order a taxi
  it(`does respond to any command that includes the word "taxi"`, () => {
    let bot = new QAbifyBot();

    expect(bot.execute('Order pizza on my taxi').response()).toEqual('Ok! I will order you a taxi');
    expect(bot.execute('Order me a taxi').response()).toEqual('Ok! I will order you a taxi');
    expect(bot.execute('I want a tAxi').response()).toEqual('Ok! I will order you a taxi');
    expect(bot.execute('Order me a TAXI').response()).toEqual('Ok! I will order you a taxi');
  });

  // If the user text something without "taxi" in it, the Bot informs that he does not understand you
  it(`doesn't understand any command that not includes the word "taxi"`, () => {
    let bot = new QAbifyBot();

    expect(bot.execute('Order me a pizza!').response()).toEqual('Sorry, I dont understand you');
    expect(bot.execute('Order me a Tasi').response()).toEqual('Sorry, I dont understand you');
    expect(bot.execute('Order me a car').response()).toEqual('Sorry, I dont understand you');
  });

  // If the user wants a taxi, the bot informs that he's going to search the nearest taxi
  it(`tells you that he's going to search for your nearest taxi`, () => {
    let bot = new QAbifyBot();
    bot.execute('Order me a TAXI');

    expect(bot.nextAnswer()).toEqual('Ok! I will search for your nearest taxi');
  });

  // The bot informs about the nearest available taxi to the user's location
  it('tells you about your nearest free taxi', () => {
    let bot = new QAbifyBot();
    // Mocked location somewhere in Madrid
    let fakeLocation = {
      "lon": 1.392,
      "lat": 38.86
    };
    bot.execute('Order me a TAXI');
    bot.searchTaxi(fakeLocation);

    expect(bot.nextAnswer()).toEqual(`Your taxi in Madrid is on it's way!`);
  });

  // The bot informs about the nearest available taxi to the user's location
  it('sends you a taxi in Barcelona if you are in Barcelona', () => {
    let bot = new QAbifyBot();
    // Mocked location somewhere in Barcelona
    let fakeLocation = {
      "lon": 2.152,
      "lat": 41.413
    };
    bot.execute('Order me a TAXI');
    bot.searchTaxi(fakeLocation);

    expect(bot.nextAnswer()).toEqual(`Your taxi in Barcelona is on it's way!`);
  });

  // The bot informs if there's no available taxi at that moment
  it(`tells you if there's no free taxi at the moment`, () => {
    let bot = new QAbifyBot();
    let fakeLocation = {
      "lon": 4.152,
      "lat": 41.413
    };
    bot.execute('Order me a TAXI');
    bot.searchTaxi(fakeLocation);

    expect(bot.nextAnswer()).toEqual(`Sorry, there's no free taxi near you`);
  });

  // The bot confirms that the user's taxi is hired
  it(`tells you if your taxi is hired`, () => {
    let bot = new QAbifyBot();
    let fakeLocation = {
      "lon": 2.152,
      "lat": 41.413
    };
    let fakeTaxi = {
      "state": "free",
      "name": "Renault",
      "location": {
        "lon": 2.154,
        "lat": 41.39
      },
      "city": "Barcelona"
    };
    bot.execute('Order me a TAXI');
    bot.searchTaxi(fakeLocation);

    expect(bot.hireATaxi(fakeTaxi)).toEqual(`Your taxi is on its way!`);
  });

  // The bot informs if there's an error hiring the taxi
  it(`tells you if there was an error hiring the taxi`, () => {
    let bot = new QAbifyBot();
    let fakeLocation = {
      "lon": 2.152,
      "lat": 41.413
    };
    let fakeTaxi = {
      "state": "free",
      "name": "Renault",
      "location": {
        "lon": 2.154,
        "lat": 41.39
      },
      "city": "Barcelona"
    };
    bot.execute('Order me a TAXI');
    bot.searchTaxi(fakeLocation);

    expect(bot.hireATaxi()).toEqual(`Sorry, something went wrong.`);
  });

});
