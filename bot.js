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
const FACT1 = [list_Commands.fact1.id,list_Commands.fact1.id2]
const FACT2 = [list_Commands.fact2.id,list_Commands.fact2.id2]
const TODAY = list_Commands.today.id
const JOKE = list_Commands.joke.id
const WAN = list_Commands.wan.id
const RAHUL = list_Commands.rahul.id

const FACT1_API = 'https://uselessfacts.jsph.pl/random.json?language=en'
const FACT2_API = 'https://useless-facts.sameerkumar.website/api'
const JOKE_API = 'https://sv443.net/jokeapi/v2/joke/Any'
const TODAY_FACT_API = 'https://uselessfacts.jsph.pl/today.json?language=en'
const N_FACT_API = 'http://numbersapi.com/random/trivia'

var today;
var facts1 = [];
var facts2 = [];
var n_facts = [];
var joke1 = [];
var joke2 = [];

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
    fetch(FACT1_API).then(
        function(response){
            if(response.status !== 200){
                console.log("There was a problem. Status Code: " + response.status);
                return;
            }
            response.json().then(function(data){
                let fact1 = data;
                facts1.push(fact1.text);
            })
        }
    ).catch(function(err){
        console.log('error: ', err);
    })
    fetch(FACT2_API).then(
        function(response){
            if(response.status !== 200){
                console.log("There was a problem. Status Code: " + response.status);
                return;
            }
            response.json().then(function(data){
                let fact2 = data;
                facts2.push(fact2.data);
            })
        }
    ).catch(function(err){
        console.log('error: ', err);
    })
}

function getJoke(){
    fetch(JOKE_API).then(
        function(response){
            if(response.status !== 200){
                console.log("There was a problem. Status Code: " + response.status);
                return;
            }
            response.json().then(function(data){
                sortJoke(data);
            })
        }
    ).catch(function(err){
        console.log('error: ', err);
    })
}

function sortJoke(data){
    console.log(joke1+"2nd"+joke2);
    if(joke1.length != 0){
        joke1.pop()
        if (joke2.length != 0){
            joke2.pop();
        }
    }
    if(data.type == "single"){
        joke1.push(data.joke);
    }
    else if(data.type == "twopart"){
        joke1.push(data.setup)
        joke2.push(data.delivery)
    }
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
    getJoke();
});

client.on('message', msg => {
    if(msg.content === `${BOT_PREFIX}${FACT1[0]}` || msg.content === `${BOT_PREFIX}${FACT1[1]}`){
        msg.channel.send("Random Fact: " + facts1).then(msg => 
            msg.delete({timeout: 20000})).then(msg.member.lastMessage.delete({timeout: 20000}));
        facts1.pop();
        getFacts();
    };
})

client.on('message', msg => {
    if(msg.content === `${BOT_PREFIX}${FACT2[0]}` || msg.content === `${BOT_PREFIX}${FACT2[1]}`){
        msg.channel.send("Random Fact: " + facts2).then(msg => 
            msg.delete({timeout: 20000})).then(msg.member.lastMessage.delete({timeout: 20000}));
        facts2.pop();
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

client.on('message', msg => {
    if(msg.content === `${BOT_PREFIX}${JOKE}`){
        if(joke2.length == 0){
            msg.channel.send(joke1).then(msg => 
                msg.delete({timeout: 20000})).then(msg.member.lastMessage.delete({timeout: 20000}));
            getJoke();
        }else{
            msg.channel.send("(1/2) "+joke1+"\n"+"(2/2) "+joke2).then(msg => 
                msg.delete({timeout: 20000})).then(msg.member.lastMessage.delete({timeout: 20000}));
            getJoke();
        }
        
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
        \`${FACT1}\` : ${list_Commands.fact1.desc}
        \`${FACT2}\` : ${list_Commands.fact2.desc}
        \`${NUM_FACT}\` : ${list_Commands.num_fact.desc}
        \`${TODAY}\` : ${list_Commands.today.desc}
        \`${WAN}\` : ${list_Commands.wan.desc}
        \`${RAHUL}\` : ${list_Commands.rahul.desc}
        `);
    if(msg.content === `${BOT_PREFIX}${BOT_COMMANDS}` && msg.guild.id==="389172899820470272"){
        msg.channel.send(embed)
        .then(msg => 
          msg.delete({timeout: 10000}))
          .then(msg.member.lastMessage
              .delete({timeout: 10000}));
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