module.exports = {
    name: 'dm',
    description: 'Sends a direct message to all members of the server',
    async execute(client, message, args) {

        const dmMessage = args.join(' ');
        if (!dmMessage) {
            return message.reply('Please provide a message to send.');
        }

        const members = message.guild.members.cache;
        let count = 0;
        let blockedCount = 0;

        members.forEach(member => {
            if (!member.user.bot) {
                member.send(dmMessage).then(() => {
                    count++;
                    console.log(`\x1b[32m%s\x1b[0m`, `[+] | Message envoyé à ${member.user.tag}`);
                }).catch(error => {
                    blockedCount++;
                    console.log(`\x1b[31m%s\x1b[0m`, `[N] | Utilisateur ${member.user.tag} bloqué ou autre erreur`);
                });
            }
        });

        message.channel.send(`DM message is being sent to ${members.size - blockedCount} members.`);
    },
};
