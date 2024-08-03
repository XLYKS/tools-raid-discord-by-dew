const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'backupload',
    description: 'Restores the server from a backup file',
    async execute(client, message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('You do not have the required permissions to use this command.');
        }

        if (args.length !== 1) {
            return message.reply('Please provide the name of the backup file.');
        }

        const backupFileName = args[0];
        const backupFilePath = path.join(__dirname, '../backups', backupFileName);

        if (!fs.existsSync(backupFilePath)) {
            return message.reply('Backup file not found.');
        }

        const guild = message.guild;

        try {
            const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf-8'));

            await Promise.all(guild.roles.cache.map(role => role.delete().catch(() => {})));
            await Promise.all(guild.channels.cache.map(channel => channel.delete().catch(() => {})));

            const roleMap = new Map();
            for (const roleData of backupData.roles) {
                const role = await guild.roles.create({
                    name: roleData.name,
                    color: roleData.color,
                    hoist: roleData.hoist,
                    position: roleData.position,
                    permissions: BigInt(roleData.permissions),
                    mentionable: roleData.mentionable,
                });
                roleMap.set(roleData.id, role.id);
            }

            const channelMap = new Map();
            for (const channelData of backupData.channels) {
                const channel = await guild.channels.create({
                    name: channelData.name,
                    type: channelData.type,
                    position: channelData.position,
                    topic: channelData.topic,
                    parent: channelData.parent ? channelMap.get(channelData.parent) : null,
                });
                channelMap.set(channelData.id, channel.id);
            }

            for (const banData of backupData.bans) {
                await guild.bans.create(banData.user.id, { reason: banData.reason }).catch(() => {});
            }

            message.channel.send(`Server restored successfully from \`${backupFileName}\``);
        } catch (error) {
            console.error('Error restoring backup:', error);
            message.channel.send('An error occurred while restoring the backup.');
        }
    },
};
