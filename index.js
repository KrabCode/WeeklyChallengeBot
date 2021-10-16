const {Intents} = require("discord.js");
const {Client} = require('discord.js');
const {token} = require('./config.json');

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


client.on('interactionCreate', async interaction => {
    console.log("interaction get");
    console.log(interaction);
    if (!interaction.isCommand()) {
        return;
    }

    const {commandName} = interaction;
    if (commandName === 'announce-next-challenge') {
        await interaction.reply('The next challenge is: **' + getRandomChallengePrompt() + '**');


    } else if (commandName === 'count') {
        let challengeTopic = getOptionValue('topic', interaction);

        interaction.channel.messages.fetch({limit: 100}).then(messages => {
            console.log(`Received ${messages.size} messages`);
            let submissions = getCurrentChallengeSubmissionsOnly(messages, challengeTopic);
            if (submissions.length === 0) {
                interaction.reply("No submissions found for **" + challengeTopic + "**");
                return;
            }
            console.log(`Filtered them down to ${submissions.length} submissions`);
            submissions.sort(function(a, b) {
                return b.reactions.message.reactions.cache.get('❤').count -
                       a.reactions.message.reactions.cache.get('❤').count;
            });
            let submission;
            let allVotes = {};
            let longestUsername = 999;
            for (let i = 0; i < submissions.length; i++) {
                submission = submissions[i];
                let username = submission.interaction.user.username;
                let userVotes = submission.reactions.message.reactions.cache.get('❤').count;
                if(username.length < longestUsername){
                    longestUsername = username.length;
                }
                if(allVotes[username] != null){
                    allVotes[username] = Math.max(allVotes[username], userVotes)
                }else{
                    allVotes[username] = userVotes;
                }
            }

            let header = "Leaderboard for **" + challengeTopic + "**:\n";
            var table = "";
            let usersAlreadyInTable = [];
            for(let i = 0; i < submissions.length; i++){
                let username = submission.interaction.user.username;
                if(usersAlreadyInTable.includes(username)){
                    continue;
                }
                table += username + " - " +  allVotes[username];
                usersAlreadyInTable.push(username);
            }
            console.log(table.toString());
            interaction.reply(header + table);
        });


    } else if (commandName === 'submit') {
        let link = getOptionValue('link', interaction);
        let topic = getOptionValue('topic', interaction);
        if (link === undefined) {
            await interaction.reply('please specify a link to your artwork');
            return;
        }
        const message = await interaction.reply({
            content: interaction.user.username + submitFillerText + "**" + topic +  "**\n" + link,
            fetchReply: true
        });
        await message.react('❤');
    }
});

let submitFillerText = ' submitted an artwork for ';

function getCurrentChallengeSubmissionsOnly(messages, topic) {
    let result = [];
    messages.forEach(message => {
        if (message.author.username === 'Weekly Challenge Bot' && message.content.includes(submitFillerText + "**" + topic + "**")) {
            result.push(message);
        }
    });
    return result;
}

client.login(token);