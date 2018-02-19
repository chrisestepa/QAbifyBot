var Botkit = require('botkit');

var controller = Botkit.slackbot(configuration);


// give the bot something to listen for.
controller.hears('hello',['direct_message','direct_mention','mention'],function(bot,message) {

  bot.reply(message,'Hello yourself.');

});
