module.exports = {
    name: 'name',
    description: 'Renames all members of the server with the given text',
    async execute(client, message, args) {

        const newName = args.join(' ');
        if (!newName) {
            return message.reply('Please provide a name to set.');
        }

        const members = message.guild.members.cache.filter(member => !member.user.bot);
        let count = 0;
        let failedCount = 0;
        const colors = ['32', '33', '34']; 

        for (const member of members.values()) {
            const previousName = member.displayName;
            try {
                await member.setNickname(newName);
                count++;
                const color = colors[count % colors.length];
                console.log(`\x1b[${color}m%s\x1b[0m`, `--| [*] Name ${previousName} --> ${newName}`);
            } catch (error) {
                failedCount++;
                console.log(`\x1b[31m%s\x1b[0m`, `--| [N] Failed to rename ${member.user.tag}`);
            }
        }

        message.channel.send(`Renamed ${count} members to ${newName}. ${failedCount} members could not be renamed.`);
    },
};
