

// User defined constants
const AuthInfo = require("./auth.json");
const botPrefix = 's!';

// import the discord.js module
const Discord = require('discord.js');
const DateTime = require('node-datetime');
var dice = require('rpg-dice');
var Cleverbot = require('cleverbot-node');
var request = require('request');
cleverbot = new Cleverbot;
cleverbot.configure({botapi: "CC1gdby2uPTvQNIbLg2fI6df8hg"});


var parkingPhrases = ["Not a single spot available, I paid $250 for this!?", "Thank your local parking services member, there's no spots available!", 
						"Remember all that money you spent on a parking pass? You're not gonna use it in a parking deck right now.",
						"YOU CANNOT PARK IN A PARKING DECK, THEY ARE TOO SMALL FOR THE AMOUNT OF STUDENTS HERE",
						"You'd think with the amount of money you spent on a pass you'd be able to park, guess again!",
						"No dice, and no spots.", "You'd have better luck avoiding the JMFlu than parking right now.",
						"Surprise! There's no spots available", "Do I really even have to explain this?"];
var parkingDecks = ["Warsaw Avenue Deck", "Mason Street Deck", "Champions Drive Deck"];
// Temp function
String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index + 1, this.length);
}

// create an instance of a Discord Client, and call it bot
const bot = new Discord.Client();

// the token of your bot - https://discordapp.com/developers/applications/me
const token = AuthInfo.token;

// Gets the current date/time of our bot to be logged.
var dateTime = require('node-datetime');
var dt = dateTime.create();
var formatted = dt.format('f, d @ H:M:S');

// Ready event starts the bot, and gets it ready to go.
bot.on('ready', () => {
  console.log('Let\'s get started: ' + formatted);
  bot.user.setGame('Overwatch');
});

// create an event listener for messages
bot.on('message', message => {
	
	// Parsing multiple arguments
	var messageParts = message.content.split(" ");
  
    // Embeds the 1024x res avatar of user as a .gif (Nitro Support).
	if (messageParts[0] === (botPrefix + 'av')) {
		var mentions = message.mentions;
		
		// Returns self avatar if no users are pinged.
		if (mentions.users.firstKey() === undefined) {			
			message.channel.sendFile(message.author.displayAvatarURL, 'default.gif');
		}
	  
	    // Returns first pinged user's avatar.
		else {
			message.channel.sendFile(mentions.users.get(mentions.users.firstKey()).displayAvatarURL, 'default.gif');
		} 
	}
	
	if (messageParts[0] === (botPrefix + 'pog')) {
		var pogify = "";
		
		for (var i = 1; i < messageParts.length; i++) {
			pogify += " <:PogChamp:284009049123586049> ";
			pogify += messageParts[i].toUpperCase();					
		}
		
		pogify += " <:PogChamp:284009049123586049> " + message.author;
		
		message.delete();
		message.channel.sendMessage(pogify);
	}
	
	if (message.toString().includes("<@296398888775057418>")) {
		cleverbot.write(message.toString(), function (response) {
			message.channel.sendMessage(response.output);
		});
	}
	
	if (messageParts[0] === (botPrefix + 'roll')) {
		var rolls = dice.roll(messageParts[1]).rolls;
		if (rolls == "") {
			message.channel.send("The syntax of the command is: ```s!roll #d#```");
		}
		
		else {
			message.channel.send("```You rolled: " + rolls + "```");
		}			
	}
	
	if (messageParts[0] === (botPrefix + 'parking')) {
		

		var milliseconds = (new Date).getTime();

		request("https://www.jmu.edu/cgi-bin/parking_get_sign_data.cgi?date=" + milliseconds, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var warsawStart = body.substring(body.indexOf("<SignId>10</SignId>"), body.indexOf("<SignId>10</SignId>") + 185);
				var parkingWarsaw = warsawStart.substring(warsawStart.indexOf("<Display>") + 20, warsawStart.indexOf("<\Display>"));
				parkingWarsaw = parkingWarsaw.replace(/\D/g,'');
				if (parkingWarsaw == "")
					parkingWarsaw = parkingPhrases[Math.floor(Math.random()*parkingPhrases.length)];
				
				var masonStart = body.substring(body.indexOf("<SignId>24</SignId>"), body.indexOf("<SignId>24</SignId>") + 185);
				var parkingMason = masonStart.substring(masonStart.indexOf("<Display>") + 20, masonStart.indexOf("<\Display>"));
				parkingMason = parkingMason.replace(/\D/g,'');
				if (parkingMason == "")
					parkingMason = parkingPhrases[Math.floor(Math.random()*parkingPhrases.length)];
				
				var championsStart = body.substring(body.indexOf("<SignId>2</SignId>"), body.indexOf("<SignId>2</SignId>") + 185);
				var parkingChampions = championsStart.substring(championsStart.indexOf("<Display>") + 20, championsStart.indexOf("<\Display>"));
				parkingChampions = parkingChampions.replace(/\D/g,'');
				if (parkingChampions == "")
					parkingChampions = parkingPhrases[Math.floor(Math.random()*parkingPhrases.length)];
				
				var today = new Date().toLocaleString();
				
				if (parkingWarsaw == "No" || parkingMason == "No" || parkingChampions == "No")
				{
					var parking = "As of: " + today + "\n";
					for (var i = 0; i < 3; i++)
					{
						if (i == 0)
							parking += parkingDecks[i] + ": " + parkingWarsaw;
						if (i == 1)
							parking += parkingDecks[i] + ": " + parkingMason;
						if (i == 2)
							parking += parkingDecks[i] + ": " + parkingChampions;
					}
				}					
				else
					message.channel.sendMessage("As of: " + today + "\n" + "Warsaw Avenue Deck Spots: " + parkingWarsaw + " \n" + "Mason Street Deck Spots: " + parkingMason + " \n" + "Champions Drive Deck Spots: " + parkingChampions + " ");
			}
		})
	}
	
	if (messageParts[0] === (botPrefix + 'deal')) {
		var request = require('request');
		theURL = "http://www.cheapshark.com/api/1.0/games?title=" + messageParts[1] + "&limit=3";
		request(theURL, function (error, response, body) {
			if (!error && response.statusCode == 200) {			
				var json = { title : "", salePrice : "", retailPrice : "", savings : "", thumb : "", steamID : ""};
				
				var title = body.substring(body.indexOf("external"), body.indexOf("external") + 100);
				title = title.substring(11, title.indexOf("thumb") - 3);
				json.title = title;
				
				if (body.indexOf("external") === -1) {
					message.channel.send("Game not found!");
					
					return;
				}
				
				var salePrice = body.substring(body.indexOf("cheapest"), body.indexOf("cheapest") + 60);
				salePrice = "$" + salePrice.substring(11, salePrice.indexOf(",") - 1)
				json.salePrice = salePrice;
				
				var thumb = body.substring(body.indexOf("thumb"), body.indexOf("thumb") + 150)
				thumb = thumb.substring(8, thumb.indexOf("gameID") - 5)
				thumb = thumb.replace(/\\\//g, "/");
				json.thumb = thumb;
				
				var dealID = body.substring(body.indexOf("cheapestDealID"), body.indexOf("cheapestDealID") + 100)
				dealID = dealID.substring(17, dealID.indexOf("external") - 3)
				theURL = "http://www.cheapshark.com/api/1.0/deals?id=" + dealID;
				
				request(theURL, function (error, response, body) {
					if (!error && response.statusCode == 200) {	
						var retailPrice = body.substring(body.indexOf("retailPrice"), body.indexOf("retailPrice") + 60)
						retailPrice = "$" + retailPrice.substring(14, retailPrice.indexOf("steamRatingText") - 3)
						json.retailPrice = retailPrice;
						
						var savings = parseFloat(retailPrice.substring(1), retailPrice.length) - parseFloat(salePrice.substring(1), salePrice.length)
						savings = "$" + savings;
						json.savings = savings;
						
						var steamID = body.substring(body.indexOf("steamAppID"), body.indexOf("steamAppID") + 40)
						steamID = steamID.substring(13, steamID.indexOf("salePrice") - 3)
						steamID = "http://store.steampowered.com/app/" + steamID;
						json.steamID = steamID;
						var	format = json.thumb + "\n```\nTitle: " + json.title + "\nRetail Price: " + json.retailPrice + "\nSale Price: " + 
								json.salePrice + "\nTotal Savings: " + json.savings + "\nStore Page: " + json.steamID + "```"
						message.channel.send(format);
				}
			})
			
		}
	})
	}
});

// log our bot in
bot.login(token);