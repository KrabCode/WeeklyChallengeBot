var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

function getRandomChallengeTopic() {
    let topics = ["water", "trees", "text", "hue", "circle", "wave", "map", "organic", "noise", "retro", "pixelated"];
    let randomIndex = Math.floor(Math.random() * topics.length);
    return topics[randomIndex];
}

// TODO :
// submission input for rich embed output via either text json or slash command
// count submission embeds for a given topic in the last n days and display reaction counts


bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) === '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'random':{
                bot.sendMessage({
                    to: channelID,
                    message: 'This week\'s challenge is: ' + getRandomChallengeTopic()
                });
                break;
            }
            case 'submit':
                bot.sendMessage({
                    to: channelID,
                    message: 'Your submission was accepted.'
                });
                break;
            case 'count':{
                bot.getMessages({channelID, }, function (error, messages){
                    messages.forEach(msg => {
                        /*  {
                              id: '891723337129132063',
                              type: 0,
                              content: '!count',
                              channel_id: '891723293525147749',
                              author: {
                                id: '427926485018345473',
                                username: 'Krab',
                                avatar: '1549a9fb533e06e6e68c182f5303a3a9',
                                discriminator: '7933',
                                public_flags: 0
                              },
                              attachments: [],
                              embeds: [],
                              mentions: [],
                              mention_roles: [],
                              pinned: false,
                              mention_everyone: false,
                              tts: false,
                              timestamp: '2021-09-26T16:30:10.990000+00:00',
                              edited_timestamp: null,
                              flags: 0,
                              components: []
                            }
                        * */
                    });
                });
                break;
            }
        }
    }
});