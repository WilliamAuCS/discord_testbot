module.exports = {
    name: 'portfolio', 
    description: "This command is for testing", 

    execute(message, args) {

        if(message.member.roles.cache.has("763196865441038356")){
            message.channel.send('https://WilliamAuCS.com');
        }
        else {
            message.channel.send("User does not have access");
        }
        
    }
}