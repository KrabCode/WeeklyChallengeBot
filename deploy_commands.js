const {SlashCommandBuilder} = require("@discordjs/builders");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const challengePrompts = require('./challengePrompts.js').getPrompts();

let topicOptions = [];

for(let i = 0; i < challengePrompts.length; i++){
    let prompt = challengePrompts[i];
    topicOptions.push([prompt,prompt]);
}

const commands = [
    new SlashCommandBuilder()
        .setName('announce-next-challenge')
        .setDescription('picks a random challenge'),

    new SlashCommandBuilder()
        .setName('count')
        .addStringOption(option =>
            option.setName('topic')
                .setDescription('topic to count votes on')
                .addChoices(topicOptions)
                .setRequired(true))
        .setDescription('counts votes and declares the winner'),

    new SlashCommandBuilder()
        .setName('submit')
        .setDescription('submit your artwork to participate in the challenge')
        .addStringOption(option =>
            option.setName('link')
                .setDescription('link to your image/video artwork hosted somewhere online like imgur')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('topic')
                .setDescription('the challenge topic you chose for your artwork')
                .addChoices(topicOptions)
                .setRequired(true))

];

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);