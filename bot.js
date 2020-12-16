/* jshint esversion: 6 */

require('dotenv').config();
const {list_Commands} = require("./commands");

const { time } = require('console');
const Discord = require('discord.js');
const fetch = require("node-fetch");
const { send } = require('process');
const client = new Discord.Client();

const BOT_PREFIX = '$'
const { commands, num_fact, fact1, fact2, todayD, joke, wan, rahul, meme} = list_Commands

const FACT1_API = 'https://uselessfacts.jsph.pl/random.json?language=en'
const FACT2_API = 'https://useless-facts.sameerkumar.website/api'
const JOKE_API = 'https://sv443.net/jokeapi/v2/joke/Any'
const TODAY_FACT_API = 'https://uselessfacts.jsph.pl/today.json?language=en'
const N_FACT_API = 'http://numbersapi.com/random/trivia'
const MEME_API = 'https://meme-api.herokuapp.com/gimme'

var today;
var facts1Array = [];
var facts2Array = [];
var n_facts = [];
var joke1 = [];
var joke2 = [];
var meme_img;

function dailyFact(){
        getToday();
    const fotd = new Discord.MessageEmbed()
        .setTitle('Fact of the day!')
        .setColor(0xff0000)
        .setDescription(`${today}`);
        client.channels.cache.get("389172900336238613").send(fotd);
}

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

function getFacts1(){
    fetch(FACT1_API).then(
        function(response){
            if(response.status !== 200){
                console.log("There was a problem. Status Code: " + response.status);
                return;
            }
            response.json().then(function(data){
                let fact_data = data;
                facts1Array.push(fact_data.text);
            })
        }
    ).catch(function(err){
        console.log('error: ', err);
    })
}
function getFacts2(){
    fetch(FACT2_API).then(
        function(response){
            if(response.status !== 200){
                console.log("There was a problem. Status Code: " + response.status);
                return;
            }
            response.json().then(function(data){
                let fact_data2 = data;
                facts2Array.push(fact_data2.data);
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

function setStatus(){
    client.user.setPresence({
        status: 'online',
        activity: {
            name: `${BOT_PREFIX}${commands.id}`,
            type: 'PLAYING',
        }
    })
}

function getMeme(){
    fetch(MEME_API).then(
        function(response){
            if(response.status !== 200){
                console.log("There was a problem. Status Code: " + response.status);
                return;
            }
            response.json().then(function(data){
                meme_img = data.url;
            })
        }
    ).catch(function(err){
        console.log('error: ', err);
    })
}

client.on('ready', () => {
    console.log("BOT IS READY!!")
    getFacts1();
    getFacts2();
    getNumFacts();
    getToday();
    getJoke();
    setStatus();
    getMeme();
    setInterval(dailyFact, 86400000); //86400000
});

function sendMessage(preMessage,infoStored,msg){
        msg.channel.send(preMessage + infoStored).then(msg => 
        msg.delete({timeout: 20000})).then(msg.member.lastMessage.delete({timeout: 20000}));
    
    
}

client.on('message', msg => { //fact1 
    //move if msg-content here and keep sending in the other one
    if(msg.content === `${BOT_PREFIX}${fact1.id}` || msg.content === `${BOT_PREFIX}${fact1.id2}` ){
        sendMessage("Random Fact: ",facts1Array,msg);
        facts1Array.pop();
        getFacts1();
    }
})

client.on('message', msg => { //fact2
    if(msg.content === `${BOT_PREFIX}${fact2.id}` || msg.content === `${BOT_PREFIX}${fact2.id2}`){
        sendMessage("Random Fact: ", facts2Array,msg);
        facts2Array.pop();
        getFacts2();
    };
})

client.on('message', msg => { //today
    if(msg.content === `${BOT_PREFIX}${todayD.id}`){
        sendMessage("FOTD: ", today,msg);
    };
})

client.on('message', msg => { //num
    if(msg.content === `${BOT_PREFIX}${num_fact.id}`){
        sendMessage("Number Fact: ",n_facts,msg);
        n_facts.pop();
        getNumFacts();
    };
})

client.on('message', msg => { //joke
    if(msg.content === `${BOT_PREFIX}${joke.id}`){
        if(joke2.length == 0){
            sendMessage("",joke1,msg);
            getJoke();
        }else{
            msg.channel.send("(1/2) "+joke1+"\n"+"(2/2) "+joke2).then(msg => 
                msg.delete({timeout: 20000})).then(msg.member.lastMessage.delete({timeout: 20000}));
            getJoke();
        }
        
    };
})

client.on('message', msg =>{ //wan
    if(msg.content === `${BOT_PREFIX}${wan.id}`){
        msg.member.send("Wan is gay");
    }
})

client.on('message', msg =>{ //rahul
    if(msg.content == `${BOT_PREFIX}${rahul.id}`){
        msg.member.send("Rahul is a great guy");
    }
})

client.on('message', msg =>{ //commands - should clean up abit
    if(msg.content === `${BOT_PREFIX}${commands.id}`){
        const embed = new Discord.MessageEmbed()
        .setTitle('Commands')
        .setColor(0xff0000)
        .setDescription(`
        Prefix: \`${BOT_PREFIX}\`
        \`${fact1.id}\` : ${fact1.desc}
        \`${fact2.id}\` : ${fact2.desc}
        \`${num_fact.id}\` : ${num_fact.desc}
        \`${todayD.id}\` : ${todayD.desc}
        \`${wan.id}\` : ${wan.desc}
        \`${rahul.id}\` : ${rahul.desc}
        \`${joke.id}\` : ${joke.desc}
        \`${meme.id}\` : ${meme.desc}
        `);
    if(msg.content === `${BOT_PREFIX}${commands.id}` && msg.guild.id==="389172899820470272"){
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

client.on('message', msg => {
    if(msg.content == `${BOT_PREFIX}${meme.id}`){
        sendMessage("",meme_img,msg);
        getMeme();
    }
})

client.on('message', msg =>{ //time, has no use.
    if(msg.content == '!time'){
        var currentTime = new Date().toLocaleTimeString();
        msg.channel.send(currentTime);
        client.channels.send
    }
})


client.login(process.env.BOT_TOKEN)