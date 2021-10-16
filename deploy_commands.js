const {SlashCommandBuilder} = require("@discordjs/builders");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

let challengePrompts = [
    "water", "trees", "text", "hue", "circle", "wave", "map", "organic",  "pixelated", "fractal", // Krab
    "rhythm", "sharp", "red", "grid", "duplicate", "shrinking", "calm", "speed", // pseudo_me
    "mathematical", "proc-gen", "2D", "3D", // Pyro
    "screentone / hatching", "glitch", "chase", "portal", "thrust", "update", "rolling", // nking
    "orbit", "launch", "fly", "paper plane", "garden", "rain", "waterfall", "corridor" // CaveHex
];

let topicOptions = [

];

for(let i = 0; i < challengePrompts.length; i++){
    let prompt = challengePrompts[i];
    topicOptions.push([prompt]);
}

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
        .addStringOption(option =>
            option.setName('challenge')
                .setDescription('the challenge topic you chose for your artwork')
                .addChoices(topicOptions
        ).setRequired(true))

];

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);