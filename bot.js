require('dotenv').config();
const {list_Commands} = require("./commands");

const { time } = require('console');
const Discord = require('discord.js');
const fetch = require("node-fetch");
const cron = require('cron');
const client = new Discord.Client();

const BOT_PREFIX = '!'
const BOT_COMMANDS = list_Commands.commands.id
const NUM_FACT = list_Commands.num_fact.id
const FACT = [list_Commands.fact.id,list_Commands.fact.id2]
const TODAY = list_Commands.today.id
const WAN = list_Commands.wan.id
const RAHUL = list_Commands.rahul.id

const FACT_API = 'https://uselessfacts.jsph.pl/random.json?language=en'
const TODAY_FACT_API = 'https://uselessfacts.jsph.pl/today.json?language=en'
const N_FACT_API = 'http://numbersapi.com/random/trivia'

var today;
var facts = [];
var n_facts = [];

var currentTime = new Date().toLocaleTimeString();

function getToday(){
    fetch(TODAY_FACT_API).then(
        function(response){
            if(response.status !== 200){
                console.log("There was a problem. Status Code: " + response.status);
                return;
            }
            response.json().then(function(data){
                today = data.text;
            })
        }
    ).catch(function(err){
        console.log('error: ', err);
    })
}

function getFacts(){
    fetch(FACT_API).then(
        function(response){
            if(response.status !== 200){
                console.log("There was a problem. Status Code: " + response.status);
                return;
            }
            response.json().then(function(data){
                let fact = data;
                facts.push(fact.text);
            })
        }
    ).catch(function(err){
        console.log('error: ', err);
    })
}

function getNumFacts(){
    fetch(N_FACT_API).then(
        function(response){
            if(response.status !== 200){
                console.log("There was a problem. Status Code: " + response.status);
                return;
            }
            response.text().then(function(data){
                n_facts.push(data);
            })
        }
    ).catch(function(err){
        console.log('error: ', err);
    })
}

client.on('ready', () => {
    console.log("BOT IS READY!!")
    getFacts();
    getNumFacts();
    getToday();
});

client.on('message', msg => {
    if(msg.content === `${BOT_PREFIX}${FACT[0]}` || msg.content === `${BOT_PREFIX}${FACT[1]}`){
        msg.channel.send("Random Fact: " + facts).then(msg => 
            msg.delete({timeout: 20000})).then(msg.member.lastMessage.delete({timeout: 20000}));
        facts.pop();
        getFacts();
    };
})

client.on('message', msg => {
    if(msg.content === `${BOT_PREFIX}${TODAY}`){
        msg.channel.send("RFOTD: " + today).then(msg => 
            msg.delete({timeout: 20000})).then(msg.member.lastMessage.delete({timeout: 20000}));
    };
})

client.on('message', msg => {
    if(msg.content === `${BOT_PREFIX}${NUM_FACT}`){
        msg.channel.send("Number Fact: " + n_facts).then(msg => 
            msg.delete({timeout: 20000})).then(msg.member.lastMessage.delete({timeout: 20000}));
        n_facts.pop();
        getNumFacts();
    };
})

client.on('message', msg =>{
    if(msg.content === `${BOT_PREFIX}${WAN}`){
        msg.member.send("Wan is gay");
    }
})

client.on('message', msg =>{
    if(msg.content == `${BOT_PREFIX}${RAHUL}`){
        msg.member.send("Rahul is a great guy");
    }
})

client.on('message', msg =>{
    if(msg.content === `${BOT_PREFIX}${BOT_COMMANDS}`){
        const embed = new Discord.MessageEmbed()
        .setTitle('Commands')
        .setColor(0xff0000)
        .setDescription(`
        Prefix: ${BOT_PREFIX}
        \`${FACT}\` : ${list_Commands.fact.desc}
        \`${NUM_FACT}\` : ${list_Commands.num_fact.desc}
        \`${TODAY}\` : ${list_Commands.today.desc}
        \`${WAN}\` : ${list_Commands.wan.desc}
        \`${RAHUL}\` : ${list_Commands.rahul.desc}
        `);
    if(msg.content === `${BOT_PREFIX}${BOT_COMMANDS}` && msg.guild.id==="389172899820470272"){
        msg.channel.send(embed)
        .then(msg => 
          msg.delete({timeout: 5000}))
          .then(msg.member.lastMessage
              .delete({timeout: 5000}));
    }else{
        msg.channel.send(embed)
    };
      
    }
})


client.on('message', msg =>{
    if(msg.content == '!time'){
        msg.channel.send(currentTime);
        client.channels.send
    }
})


client.login(process.env.BOT_TOKEN)