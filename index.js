const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const { Server } = require('http');
const login_key = fs.readFileSync('./credentials/client_login.key', { encoding: 'utf-8' });
//const { twitch_get_bearer_token } = require('./twitch_api');
const manage_data = require('./manage_data');
const data = manage_data.get_data();

const prefix = '!';

client.commands = new Discord.Collection();
// Reading command files
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}
// Displaying one-time online status
client.once('ready', () => {
    console.log('Bot is online!');
    // twitch_get_bearer_token( (response) => {
    //     console.log(response);
    // });
});

// Reading message to determine if they are a command
client.on('message', (message) => {
    // If user exists in file incriment message_count
    if (!!data.user_data[message.author.id]) {
        data.user_data[message.author.id].message_count += 1;
        manage_data.writeToData(data);
    }
    // Manages bot message count
    else if (message.author.bot) {
        // If bot profile exists, increment message count
        if(!!data.bot_data[message.author.id]) {
            data.bot_data[message.author.id].message_count += 1;
            manage_data.writeToData(data);
        }
        // If bot does not exist, create profile
        else {
            manage_data.createBotProfile(message);
        }
    }
    // If user does not exist, create profile
    else {
        console.log("User not found");
        manage_data.createUserProfile(message);
    }

    // Checking if bot prefix was used or author is bot
    // || message.author.bot
    if (!message.content.startsWith(prefix)) {
        return;
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        client.commands.get('ping').execute(message, args);
    }
    else if (command === 'profile') {
        client.commands.get('profile').execute(message, args, data, Discord);
    }
    else if (command === 'portfolio') {
        client.commands.get('portfolio').execute(message, args);
    }
    else if (command === 'avatar') {
        client.commands.get('avatar').execute(message, args, client);
    }
    else if (command === 'help') {
        client.commands.get('help').execute(message, args);
    }
    else if (command === 'ratfact') {
        client.commands.get('rat-facts').execute(message);
    }
    else if (command === 'pong') {
        message.channel.send("?ping");
    }
    else if (command === 'yee') {
        let str = '';
        for (let index = 0; index < 50; index++) {
            str += "fuyck thisssss\n";
        }
        message.channel.send(str);
    }
});



client.login(login_key);