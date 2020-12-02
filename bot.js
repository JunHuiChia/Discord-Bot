require('dotenv').config();

const { time } = require('console');
const Discord = require('discord.js');
const fetch = require("node-fetch");
const cron = require('cron');
const client = new Discord.Client();

const BOT_PREFIX = '!'
const BOT_COMMANDS = 'commands'
const NUM_FACT = 'num'
const FACT = ['fact','facts']
const WAN = 'wan'

const FACT_API = 'https://uselessfacts.jsph.pl/random.json?language=en'
const N_FACT_API = 'http://numbersapi.com/random/trivia'

var facts = [];
var n_facts = [];

var currentTime = new Date().toLocaleTimeString();

client.on('ready', () => {
    console.log("BOT IS READY!!")
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
    if(currentTime == "01:50:00"){

    }

});

client.on('message', msg => {
    if(msg.content === `${BOT_PREFIX}${FACT[0]}` || msg.content === `${BOT_PREFIX}${FACT[1]}`){
        msg.channel.send("Random Fact: " + facts).then(msg => 
            msg.delete({timeout: 20000})).then(msg.member.lastMessage.delete({timeout: 20000}));
        facts.pop();
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
    };
})

client.on('message', msg => {
    if(msg.content === `${BOT_PREFIX}${NUM_FACT}`){
        msg.channel.send("Number Fact: " + n_facts).then(msg => 
            msg.delete({timeout: 20000})).then(msg.member.lastMessage.delete({timeout: 20000}));
        n_facts.pop();
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
    };
})

client.on('message', msg =>{
    if(msg.content === `${BOT_PREFIX}${WAN}`){
        msg.member.send("Wan is gay")
    }
})

client.on('message', msg =>{
    if(msg.content === `${BOT_PREFIX}${BOT_COMMANDS}`){
        msg.reply(
        "\n List of commands : "+
        "\n"+BOT_PREFIX+NUM_FACT+" : Random facts about numbers"+
        "\n"+BOT_PREFIX+FACT[1]+" : Random facts about anything"+
        "\n"+BOT_PREFIX+WAN+" : Easter Egg").then(msg => 
            msg.delete({timeout: 5000})).then(msg.member.lastMessage.delete({timeout: 5000}));
    }
})

client.on('message', msg =>{
    if(msg.content == '!time'){
        msg.channel.send(currentTime);
        client.channels.send
    }
})


client.login(process.env.BOT_TOKEN)