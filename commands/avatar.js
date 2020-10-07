const { Guild, SystemChannelFlags } = require("discord.js");

module.exports = {
    name: 'avatar',
    description: "This command returns the select user's avatar.",

    execute(message, args, client) {

        const username = args.shift().toLowerCase();
        let user_ud;

        try {
            user_id = client.users.cache.find(usr => usr.username.toLowerCase() == username).id;
        }
        // If the user
        catch {
            message.channel.send("User not found");
            return;
        }
        message.channel.send("Here is the user's avatar");
        message.channel.send(client.users.resolve(user_id).displayAvatarURL());
    }
}