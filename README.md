# QAbifyBot
QAbifyBot hires you a taxi!

1) In "Javascript" folder you can find two files:
- botClass.js with the logic of the bot.
- bot.spec.js with the testing code.

The calls to the real API are disabled to make the tests.
However there's a mocked array with the full info.

2) In root folder you can find the SpecRunner.htlm file to run the test files.

3) In root folder too, there's a file named SlackBot.js with the logic for a Bot User to use in Slack.
I tried to integrate the bot into a real workspace using BotKit (https://github.com/howdyai/botkit/blob/master/docs/readme.md#botkit---building-blocks-for-building-bots) but I could not connect to Slack, so the code can not be tested.  
