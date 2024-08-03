module.exports = {
    name: 'nuke',
    description: 'Deletes all channels in the server',
    async execute(client, message, args) {

        const guild = message.guild;
        const channels = guild.channels.cache;

        let count = 0;
        const colors = ['32', '31', '34']; 

        channels.forEach((channel, index) => {
            setTimeout(() => {
                channel.delete().then(() => {
                    count++;
                    const color = colors[count % colors.length];
                    console.log(`\x1b[${color}m%s\x1b[0m`, `[+] | ${count} Salon supprimé`);
                }).catch(console.error);
            }, index * 1000); 
        });

        message.channel.send('Nuke complete. All channels have been deleted.');
    },
};
