const {Intents} = require("discord.js");
const {Client} = require('discord.js');
const {token} = require('./config.json');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

let challengePrompts = [
    "water", "trees", "text", "hue", "circle", "wave", "map", "organic", "noise", "retro", "pixelated", "fractal", // Krab
    "rhythm", "sharp", "red", "grid", "duplicate", "shrinking", "calm", "speed", // pseudo_me
    "mathematical", "proc-gen", "2D", "3D", // Pyro
    "screentone / hatching", "glitch", "chase", "portal", "thrust", "update", "rolling", // nking
    "orbit", "launch", "fly", "paper plane", "garden", "rain", "waterfall", "corridor" // CaveHex
];

function getRandomChallengePrompt() {
    let randomIndex = Math.floor(Math.random() * challengePrompts.length);
    return challengePrompts[randomIndex];
}

client.once('ready', () => {
    console.log('Ready!');
});

// client.on('messageCreate', async interaction => {  });

function getOptionValue(link, interaction) {
    let options = interaction.options._hoistedOptions;
    for (let i = 0; i < options.length; i++) {
        if (options[i].name === link) {
            return options[i].value;
        }
    }
    return '{ option not found }';
}

let submitExplanation = ' submitted an artwork for the current challenge:\n';

function getSubmissionsOnly(messages) {
    let result = [];
    messages.forEach(message => {
        if (message.content.includes(submitExplanation)) {
            result.push(message);
        }
    });
    return result;
}

client.on('interactionCreate', async interaction => {
    console.log("interaction get: ");
    console.dir(interaction);
    if (!interaction.isCommand()) {
        return;
    }

    const {commandName} = interaction;
    if (commandName === 'ping') {
        await interaction.reply('pong');
    } else if (commandName === 'next') {
        await interaction.reply('The next challenge is: **' + getRandomChallengePrompt() + '**');
    } else if (commandName === 'count') {
        interaction.channel.messages.fetch({limit: 100}).then(messages => {
            console.log(`Received ${messages.size} messages`);
            let submissions = getSubmissionsOnly(messages);
            console.log(`Filtered them down to ${submissions.length} submissions`);
            interaction.reply('The winner is unknown as of yet');
        });
    } else if (commandName === 'submit') {
        let link = getOptionValue('link', interaction);
        if (link === undefined) {
            await interaction.reply('please specify a link to your artwork');
            return;
        }
        const message = await interaction.reply({ content: interaction.user.username + submitExplanation + link, fetchReply: true});
        await message.react('❤');
    }
});

client.login(token);