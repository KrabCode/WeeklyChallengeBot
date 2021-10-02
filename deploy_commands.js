const {SlashCommandBuilder} = require("@discordjs/builders");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),

    new SlashCommandBuilder()
        .setName('next')
        .setDescription('Picks a random challenge'),

    new SlashCommandBuilder()
        .setName('count')
        .setDescription('Counts votes and declares the winner'),

    new SlashCommandBuilder()
        .setName('submit')
        .setDescription('Submit your artwork to participate in the challenge')
        .addStringOption(option =>
            option.setName('link')
                .setDescription('link to your image/video artwork hosted somewhere online like imgur')
                .setRequired(true))
];

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);