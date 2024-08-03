module.exports = {
    name: 'spam',
    description: 'Spams a message in all channels 100 times',
    execute(client, message, args) {
        if (!args.length) {
            return message.channel.send('You need to provide a message to spam!');
        }

        const spamMessage = args.join(' ');
        const channels = message.guild.channels.cache.filter(channel => channel.isTextBased());

        let count = 0;
        const colors = ['32', '31', '34']; 

        for (let i = 0; i < 100; i++) {
            channels.forEach((channel) => {
                setTimeout(() => {
                    channel.send(spamMessage).then(() => {
                        count++;
                        const color = colors[count % colors.length];
                        console.log(`\x1b[${color}m%s\x1b[0m`, `[+] | ${count} Message envoiyé`);
                    }).catch(console.error);
                }, i * 1000); 
            });
        }
    },
};
