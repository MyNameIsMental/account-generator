const Discord = require("discord.js");
const bot = new Discord.Client();
const prefix = "!";
const fs = require("fs");
const os = require("os");
const generated = new Set();


var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get(prefix, function (request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function () {
    console.log('App is running, server is listening on port ', app.get('port'));
});
bot.on("ready", () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});


bot.on("message", message => {
    if (message.channel.id === "713556712157609994") { //This will make the bot work only in that channel
        if (message.author.bot) return;
        var command = message.content
            .toLowerCase()
            .slice(prefix.length)
            .split(" ")[0];

        if (command === "test") {
            message.channel.send("Test done, bot is working");
        }

        if (command === "gen") {
            var moment = require('moment');
            var currentTime = moment().format();
            if (generated.has(message.author.id)) {
                message.channel.send(
                    "Please wait at least 5 minutes before generating another account!. - " + 
                    message.author
                );
               
            } else {
                let messageArray = message.content.split(" ");
                let args = messageArray.slice(1);
                if (!args[0])
                    return message.reply("Please, specify the service you want!");

                const filePath = __dirname + "/stock/" + args[0] + ".txt";

                fs.readFile(filePath, function (err, data) {
                    if (!err) {
                        data = data.toString();
                        var position = data.toString().indexOf("\n");
                        var firstLine = data.split("\n")[0];
                        message.author.send(firstLine);
                        if (position != -1) {
                            data = data.substr(position + 1);
                            fs.writeFile(filePath, data, function (err) {
                                const embed = {
                                    title: "Account Generated!",
                                    description: "Check your dm for the account's information!",
                                    color: 8519796,
                                    timestamp: currentTime,
                                    footer: {
                                        icon_url:
                                            "https://cdn.discordapp.com/avatars/530778425540083723/7a05e4dd16825d47b6cdfb02b92d26a5.png",
                                    },
                                    thumbnail: {
                                        url:
                                            "https://i.ibb.co/f9CvMvX/Untitled-1-8.png"
                                    },
                                    author: {
                                        name: "Account Generator",
                                        url: "https://discordapp.com",
                                        icon_url: bot.displayAvatarURL
                                    },
                                    fields: []
                                };
                                message.channel.send({ embed });
                                generated.add(message.author.id);
                                console.log(generated);
                                setTimeout(() => {
                                    generated.delete(message.author.id);
                                    console.log(generated);
                                }, 300000);
                                if (err) {
                                    console.log(err);
                                }
                            });
                        } else {
                            message.channel.send(
                                "Sorry, there isn't any account available for that service!"
                            );
                        }
                    } else {
                        message.channel.send(
                            "Sorry, that service doesn't exists on our database"
                        );
                    }
                });
            }
        }
        else
            if (command === "stats") {

                message.channel.send(`Total users: ${bot.users.size}`)
            }

        if (command === "add") {
            if (!message.member.hasPermission("ADMINISTRATOR"))
                return message.reply("Sorry, you can't do it, you are not an admin!");
            let messageArray = message.content.split(" ");
            let args = messageArray.slice(1);
            var account = args[0]
            var service = args[1]
            const filePath = __dirname + "/" + args[1] + ".txt";
            fs.appendFile(filePath, os.EOL + args[0], function (err) {
                if (err) return console.log(err);
                message.channel.send("Done!");
            });


        }
        if (command === "create") {
            if (!message.member.hasPermission("ADMINISTRATOR"))
                return message.reply("Sorry, you can't do it, you are not an admin!");
            let messageArray = message.content.split(" ");
            let args = messageArray.slice(1);
            const filePath = __dirname + "/stock/" + args[0] + ".txt";
            fs.writeFile(filePath, 'first:first', function (err) {
                if (err) throw err;
                message.channel.send("Done!")
            });
        }
        if (command === "stock"){
            var moment = require('moment');
            var currentTime = moment().format();
            var content;
            
            let messageArray = message.content.split(" ");
            let args = messageArray.slice(1);
            const dir = './stock';
            const stockFiles = fs.readdirSync(dir)
            var info = ' ';

            const embed = new Discord.RichEmbed()
                .setTitle("Stock Info")
                .setDescription(info)
                .setColor(8519796)
                .setTimestamp(currentTime)
                .setFooter("created by austin_hx#2583")
                .setThumbnail("https://i.ibb.co/f9CvMvX/Untitled-1-8.png")
                .setAuthor("Account Generator");
            
            for (var i = 0; i < stockFiles.length; ++i){
                const filePath = __dirname + "/stock/" + stockFiles[i];
                var content = fs.readFileSync(filePath, 'utf8');
                var stockVal = content.split("\n").length;
                var stockName = require('path').parse(stockFiles[i]).name;
                var capital = stockName.charAt(0).toUpperCase() + stockName.slice(1);
                embed.addField(capital, stockVal);
            }

            message.channel.send({ embed });
            
            console.log(generated);
            
        }

        if (command === "help"){         
            var moment = require('moment');
            var currentTime = moment().format(); 
            const embed = {
                title: "Available Commands",
                description: "!stock [Check Stock Info] \n !gen <hulu,disney,etc.> [Gen Account Info]",
                color: 8519796,
                timestamp: currentTime,
                footer: {
                    icon_url:
                        "https://cdn.discordapp.com/avatars/530778425540083723/7a05e4dd16825d47b6cdfb02b92d26a5.png",
                },
                thumbnail: {
                    url:
                        "https://i.ibb.co/f9CvMvX/Untitled-1-8.png"
                },
                author: {
                    name: "Account Generator",
                    url: "https://discordapp.com",
                    icon_url: bot.displayAvatarURL
                },
                fields: []
            };
            message.channel.send({ embed });
            
        }
    }
});

bot.login("NzEzMjM1NDc2NTA0NTEwNDc0.Xsh0uA.lugst2cmp9t1TOx3LC0Pu3OHAeo");