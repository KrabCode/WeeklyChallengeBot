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
    let topics = [
        "water", "trees", "text", "hue", "circle", "wave", "map", "organic", "noise", "retro", "pixelated", "fractal" // krab
        ,"rhythm","sharp","red","grid","duplicate","shrinking","calm","speed" // pseudo_me
    ];
    let randomIndex = Math.floor(Math.random() * topics.length);
    return topics[randomIndex];
}

// TODO :
// submission input for rich embed output via either text json or slash command
// count submission embeds for a given topic in the last n days and display reaction counts
const exampleEmbed = {
    color: 0x0099ff,
    title: 'Some title',
    url: 'https://discord.js.org',
    author: {
        name: 'Some name',
        icon_url: 'https://i.imgur.com/AfFp7pu.png',
        url: 'https://discord.js.org',
    },
    description: 'Some description here',
    thumbnail: {
        url: 'https://i.imgur.com/AfFp7pu.png',
    },
    fields: [
        {
            name: 'Regular field title',
            value: 'Some value here',
        },
        {
            name: '\u200b',
            value: '\u200b',
            inline: false,
        },
        {
            name: 'Inline field title',
            value: 'Some value here',
            inline: true,
        },
        {
            name: 'Inline field title',
            value: 'Some value here',
            inline: true,
        },
        {
            name: 'Inline field title',
            value: 'Some value here',
            inline: true,
        },
    ],
    image: {
        url: 'https://i.imgur.com/AfFp7pu.png',
    },
    timestamp: new Date(),
    footer: {
        text: 'Some footer text here',
        icon_url: 'https://i.imgur.com/AfFp7pu.png',
    },
};

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) === '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch (cmd) {
            // !ping
            case 'random': {
                bot.sendMessage({
                    to: channelID,
                    message: 'This week\'s challenge is: ' + getRandomChallengeTopic()
                });
                break;
            }
            case 'submit':
                bot.sendMessage({
                    to: channelID,
                    embed: exampleEmbed
                });
                break;
            case 'count': {
                let count = 0;
                let scores = {};
                bot.getMessages({channelID,}, function (error, messages) {
                    messages.forEach(msg => {
                        if (msg.content.substring(0, 7) === "!submit") {
                            console.dir(msg);
                            if (msg.reactions !== undefined) {
                                msg.reactions.forEach(react => {
                                    if(msg.reactions.emoji !== null){
                                        console.log();
                                        console.log("react.emoji: ");
                                        console.dir(react.emoji);
                                        console.log();
                                        console.log("react.emoji.name: ");
                                        console.dir(react.emoji.name);
                                    }
                                });
                            }
                        }
                    });
                    bot.sendMessage({
                        to: channelID,
                        message: 'count of submits: ' + count
                    });
                });
                break;
            }
        }
    }
});