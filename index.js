const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

const login_key = fs.readFileSync('./credentials/client_login.key', {encoding: 'utf-8'})
const prefix = '!';

client.commands = new Discord.Collection();
// Reading command files
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}

// Displaying one-time online status
client.once('ready', () => {
    console.log('Bot is online!');
})

// Reading message to determine if they are a command
client.on('message', (message) => {
    if(!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === 'ping') {
        client.commands.get('ping').execute(message, args);
    }
})


client.login(login_key);