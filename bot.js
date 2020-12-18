/* jshint esversion: 6 */

require('dotenv').config();
const { list_Commands } = require('./commands');

const { time } = require('console');
const Discord = require('discord.js');
const fetch = require('node-fetch');
const { send } = require('process');
const client = new Discord.Client();

const BOT_PREFIX = '$';
const {
	commands,
	num_fact,
	fact1,
	fact2,
	todayD,
	joke,
	wan,
	rahul,
	meme,
	weather,
} = list_Commands;

const weatherEmbed = (
	temp,
	maxTemp,
	minTemp,
	feelTemp,
	humidity,
	wind,
	cloudness,
	icon,
	author,
	profile,
	cityName,
	country
) =>
	new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setAuthor(`Hello, ${author}`, profile)
		.setTitle(`It is ${Math.ceil(temp)}\u00B0 C in ${cityName}, ${country}`)
		.addField(`Maximum Temperature:`, `${maxTemp}\u00B0 C`, true)
		.addField(`Minimum Temperature:`, `${minTemp}\u00B0 C`, true)
		.addField(`Feels like:`, `${feelTemp}\u00B0 C`, true)
		.addField(`Humidity:`, `${humidity} %`, true)
		.addField(`Wind Speed:`, `${wind} m/s`, true)
		.addField(`Cloudiness:`, `${cloudness}`, true)
		.setThumbnail(`http://openweathermap.org/img/w/${icon}.png`)
		.setFooter('Made by Jun');

const FACT1_API = 'https://uselessfacts.jsph.pl/random.json?language=en';
const FACT2_API = 'https://useless-facts.sameerkumar.website/api';
const JOKE_API = 'https://sv443.net/jokeapi/v2/joke/Any';
const TODAY_FACT_API = 'https://uselessfacts.jsph.pl/today.json?language=en';
const N_FACT_API = 'http://numbersapi.com/random/trivia';
const MEME_API = 'https://meme-api.herokuapp.com/gimme';

var today;
var facts1Array = [];
var facts2Array = [];
var n_facts = [];
var joke1 = [];
var joke2 = [];
var meme_img;

function dailyFact() {
	getToday();
	const fotd = new Discord.MessageEmbed()
		.setTitle('Fact of the day!')
		.setColor(0xff0000)
		.setDescription(`${today}`);
	client.channels.cache.get('389172900336238613').send(fotd);
}

function getToday() {
	fetch(TODAY_FACT_API)
		.then(function (response) {
			if (response.status !== 200) {
				console.log(
					'There was a problem. Status Code: ' + response.status
				);
				return;
			}
			response.json().then(function (data) {
				today = data.text;
			});
		})
		.catch(function (err) {
			console.log('error: ', err);
		});
}

function getFacts1() {
	fetch(FACT1_API)
		.then(function (response) {
			if (response.status !== 200) {
				console.log(
					'There was a problem. Status Code: ' + response.status
				);
				return;
			}
			response.json().then(function (data) {
				let fact_data = data;
				facts1Array.push(fact_data.text);
			});
		})
		.catch(function (err) {
			console.log('error: ', err);
		});
}
function getFacts2() {
	fetch(FACT2_API)
		.then(function (response) {
			if (response.status !== 200) {
				console.log(
					'There was a problem. Status Code: ' + response.status
				);
				return;
			}
			response.json().then(function (data) {
				let fact_data2 = data;
				facts2Array.push(fact_data2.data);
			});
		})
		.catch(function (err) {
			console.log('error: ', err);
		});
}

function getJoke() {
	fetch(JOKE_API)
		.then(function (response) {
			if (response.status !== 200) {
				console.log(
					'There was a problem. Status Code: ' + response.status
				);
				return;
			}
			response.json().then(function (data) {
				sortJoke(data);
			});
		})
		.catch(function (err) {
			console.log('error: ', err);
		});
}

function sortJoke(data) {
	if (joke1.length != 0) {
		joke1.pop();
		if (joke2.length != 0) {
			joke2.pop();
		}
	}
	if (data.type == 'single') {
		joke1.push(data.joke);
	} else if (data.type == 'twopart') {
		joke1.push(data.setup);
		joke2.push(data.delivery);
	}
}

function getNumFacts() {
	fetch(N_FACT_API)
		.then(function (response) {
			if (response.status !== 200) {
				console.log(
					'There was a problem. Status Code: ' + response.status
				);
				return;
			}
			response.text().then(function (data) {
				n_facts.push(data);
			});
		})
		.catch(function (err) {
			console.log('error: ', err);
		});
}

function setStatus() {
	client.user.setPresence({
		status: 'online',
		activity: {
			name: `${BOT_PREFIX}${commands.id}`,
			type: 'PLAYING',
		},
	});
}

function getMeme() {
	fetch(MEME_API)
		.then(function (response) {
			if (response.status !== 200) {
				console.log(
					'There was a problem. Status Code: ' + response.status
				);
				return;
			}
			response.json().then(function (data) {
				meme_img = data.url;
			});
		})
		.catch(function (err) {
			console.log('error: ', err);
		});
}

client.on('ready', () => {
	console.log('BOT IS READY!!');
	getFacts1();
	getFacts2();
	getNumFacts();
	getToday();
	getJoke();
	setStatus();
	getMeme();
	setInterval(dailyFact, 86400000);
});

function sendMessage(preMessage, infoStored, msg) {
	msg.channel
		.send(preMessage + infoStored)
		.then((msg) => msg.delete({ timeout: 20000 }))
		.then(msg.member.lastMessage.delete({ timeout: 20000 }));
}

client.on('message', (msg) => {
	//fact1
	if (
		msg.content === `${BOT_PREFIX}${fact1.id}` ||
		msg.content === `${BOT_PREFIX}${fact1.id2}`
	) {
		sendMessage('Random Fact: ', facts1Array, msg);
		facts1Array.pop();
		getFacts1();
	}

	//fact2
	else if (
		msg.content === `${BOT_PREFIX}${fact2.id}` ||
		msg.content === `${BOT_PREFIX}${fact2.id2}`
	) {
		sendMessage('Random Fact: ', facts2Array, msg);
		facts2Array.pop();
		getFacts2();
	}

	//today
	else if (msg.content === `${BOT_PREFIX}${todayD.id}`) {
		sendMessage('FOTD: ', today, msg);
	}

	//num
	else if (msg.content === `${BOT_PREFIX}${num_fact.id}`) {
		sendMessage('Number Fact: ', n_facts, msg);
		n_facts.pop();
		getNumFacts();
	}

	//joke
	else if (msg.content === `${BOT_PREFIX}${joke.id}`) {
		if (joke2.length == 0) {
			sendMessage('', joke1, msg);
			getJoke();
		} else {
			msg.channel
				.send('(1/2) ' + joke1 + '\n' + '(2/2) ' + joke2)
				.then((msg) => msg.delete({ timeout: 20000 }))
				.then(msg.member.lastMessage.delete({ timeout: 20000 }));
			getJoke();
		}
	}

	//wan
	else if (msg.content === `${BOT_PREFIX}${wan.id}`) {
		msg.member.send('Wan sucks');
	}

	//rahul
	else if (msg.content == `${BOT_PREFIX}${rahul.id}`) {
		msg.member.send('Rahul is a great guy');
	}

	//commands - should clean up abit
	else if (msg.content === `${BOT_PREFIX}${commands.id}`) {
		const embed = new Discord.MessageEmbed()
			.setTitle('Commands')
			.setColor(0xff0000).setDescription(`
        Prefix: \`${BOT_PREFIX}\`
        \`${fact1.id}\` : ${fact1.desc}
        \`${fact2.id}\` : ${fact2.desc}
        \`${num_fact.id}\` : ${num_fact.desc}
        \`${todayD.id}\` : ${todayD.desc}
        \`${wan.id}\` : ${wan.desc}
        \`${rahul.id}\` : ${rahul.desc}
        \`${joke.id}\` : ${joke.desc}
        \`${meme.id}\` : ${meme.desc}
        \`${weather.id} <City Name>\` : ${weather.desc}
        \`${weather.id2} <City Name>\` : ${weather.desc}
        `);
		if (
			msg.content === `${BOT_PREFIX}${commands.id}` &&
			msg.guild.id === '389172899820470272'
		) {
			msg.channel
				.send(embed)
				.then((msg) => msg.delete({ timeout: 10000 }))
				.then(msg.member.lastMessage.delete({ timeout: 10000 }));
		} else {
			msg.channel.send(embed);
		}
	}

	//memes
	else if (msg.content == `${BOT_PREFIX}${meme.id}`) {
		sendMessage('', meme_img, msg);
		getMeme();
	}
});

//Weather
client.on('message', (message) => {
	if (!message.content.startsWith(BOT_PREFIX) || message.author.bot) return;
	const args = message.content.slice(BOT_PREFIX.length).split(' ');
	const command = args.shift().toLowerCase();
	if (command === 'w' || command === 'weather') {
		fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${args}&units=metric&appid=${process.env.W_API_KEY}`
		)
			.then(function (response) {
				response.json().then(function (weather_data) {
					let apiData = weather_data;
					let currentTemp = apiData.main.temp;
					let maxTemp = apiData.main.temp_max;
					let minTemp = apiData.main.temp_min;
					let feelTemp = apiData.main.feels_like;
					let humidity = apiData.main.humidity;
					let wind = apiData.wind.speed;
					let author = message.author.username;
					let profile = message.author.displayAvatarURL;
					let icon = apiData.weather[0].icon;
					let cityName = args;
					let country = apiData.sys.country;
					let cloudness = apiData.weather[0].description;
					message.channel
						.send(
							weatherEmbed(
								currentTemp,
								maxTemp,
								minTemp,
								feelTemp,
								humidity,
								wind,
								cloudness,
								icon,
								author,
								profile,
								cityName,
								country
							)
						)
						.then((message) => message.delete({ timeout: 600000 }))
						.then(
							message.member.lastMessage.delete({
								timeout: 600000,
							})
						);
				});
			})
			.catch((err) => {
				message.reply(`Enter a vailid city name`);
			});
	}
});

client.login(process.env.BOT_TOKEN);
