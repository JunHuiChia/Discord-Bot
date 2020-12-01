require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

const BOT_PREFIX = '!'


client.on('ready', () => {
    console.log("BOT IS READY!!")
});

client.on('message', msg => {
    if(msg.content === `${BOT_PREFIX}ping`) {
        msg.reply('Pong!');
    }
})

client.login(process.env.BOT_TOKEN)