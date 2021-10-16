const {Intents} = require("discord.js");
const {Client} = require('discord.js');
const {token} = require('./config.json');
const util = require('util')

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});


const challengePrompts = require('./challengePrompts.js').getPrompts();

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

let submitExplanation = ' submitted an artwork under the topic: ';

function getCurrentChallengeSubmissionsOnly(messages, topic) {
    let result = [];
    messages.forEach(message => {
        if (message.author.username === 'Weekly Challenge Bot' && message.content.includes(submitExplanation + topic)) {
            result.push(message);
        }
    });
    return result;
}

client.on('interactionCreate', async interaction => {
    console.log("interaction get: ");
    // console.dir(interaction);
    if (!interaction.isCommand()) {
        return;
    }

    const {commandName} = interaction;
    if (commandName === 'announce-next-challenge') {
        await interaction.reply('The next challenge is: **' + getRandomChallengePrompt() + '**');


    } else if (commandName === 'count') {
        let challengeTopic = getOptionValue('topic', interaction);
        let leaderboard = "Leaderboard:";


        interaction.channel.messages.fetch({limit: 100}).then(messages => {
            console.log(`Received ${messages.size} messages`);
            let submissions = getCurrentChallengeSubmissionsOnly(messages, challengeTopic);
            if (submissions.length === 0) {
                interaction.reply("No submissions found for topic: " + challengeTopic);
                return;
            }
            console.log(`Filtered them down to ${submissions.length} submissions`);
            let submission;
            for (let i = 0; i < submissions.length; i++) {
                submission = submissions[i];
                let reactions = submission.reactions.message.reactions;
                let count = reactions.cache.get('❤').count;
                leaderboard += "\n" + submission.interaction.user.username + ":\t\t\t" + count;
            }
            console.log("Posting leaderboard: \n" + leaderboard);
            interaction.reply(leaderboard);
        });


    } else if (commandName === 'submit') {
        let link = getOptionValue('link', interaction);
        let topic = getOptionValue('topic', interaction);
        if (link === undefined) {
            await interaction.reply('please specify a link to your artwork');
            return;
        }
        const message = await interaction.reply({
            content: interaction.user.username + submitExplanation + topic + "\n" + link,
            fetchReply: true
        });
        await message.react('❤');
    }
});

client.login(token);