var DiscordIO = require('discord.io');
const DiscordJS = require('discord.js')
var logger = require('winston');
var auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new DiscordIO.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ' + bot.username + ' - (' + bot.id + ')');
});

function getRandomChallengeTopic() {
    let topics = [
        "water", "trees", "text", "hue", "circle", "wave", "map", "organic", "noise", "retro", "pixelated", "fractal", // Krab
        "rhythm","sharp","red","grid","duplicate","shrinking","calm","speed", // pseudo_me
        "mathematical", "proc-gen", "2D", "3D", // Pyro
        "screentone / hatching", "glitch", "chase", "portal", "thrust", "update", "rolling", // nking
        "orbit", "launch", "fly", "paper plane", "garden", "rain", "waterfall", "corridor" // CaveHex
    ];
    let randomIndex = Math.floor(Math.random() * topics.length);
    return topics[randomIndex];
}

// TODO :
// submission input for rich embed output via either text, json or slash command
// count submission embeds for a given topic in the last n days and display reaction counts

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) === '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        switch (cmd) {
            // !ping
            case 'random': {
                bot.sendMessage({
                    to: channelID,
                    message: 'The next challenge prompt is: ' + getRandomChallengeTopic()
                });
                break;
            }
            case 'submit':
                let embed = new DiscordJS.MessageEmbed();
                console.log(message.substring(8));
                let msgParts = message.substring(8).split(' ');
                console.log(msgParts);
                embed.setTitle(msgParts[0]);
                embed.setThumbnail(msgParts[1])
                embed.setDescription("hello");
                embed.setImage(msgParts[1]);
                embed.setURL(msgParts[1]);
                // TODO fix animated imgur embed or abandon embeds
                // test with "!submit Krab https://i.imgur.com/OwXPbQZ.mp4"
                bot.sendMessage({
                    to: channelID,
                    embed: embed.toJSON()
                });
                break;
            case 'count': {
                let count = 0;
                let scores = {};
                bot.getMessages({channelID,}, function (error, messages) {
                    messages.forEach(msg => {
                        console.dir(msg);
                        if (msg.content.substring(0, 7) === "!submit") {
                            console.dir(msg);
                            if (msg.reactions !== undefined) {
                                msg.reactions.forEach(react => {
                                    if(msg.reactions.emoji !== null){
                                        // TODO count votes for each user, then sort users by vote count and display
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