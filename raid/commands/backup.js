const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'backup',
    description: 'Creates a backup of the server',
    async execute(client, message, args) {

        const guild = message.guild;

        try {
            const bans = await guild.bans.fetch();
            const banList = bans.map(ban => ({
                user: {
                    id: ban.user.id,
                    username: ban.user.username,
                    discriminator: ban.user.discriminator,
                },
                reason: ban.reason,
            }));

            const channels = guild.channels.cache.map(channel => ({
                id: channel.id,
                name: channel.name,
                type: channel.type,
                position: channel.position,
                parent: channel.parentId,
                topic: channel.topic,
            }));

            const roles = guild.roles.cache.map(role => ({
                id: role.id,
                name: role.name,
                color: role.color,
                hoist: role.hoist,
                position: role.position,
                permissions: role.permissions.bitfield.toString(),
                mentionable: role.mentionable,
            }));

            const members = guild.members.cache.map(member => ({
                user: {
                    id: member.user.id,
                    username: member.user.username,
                    discriminator: member.user.discriminator,
                    bot: member.user.bot,
                },
                nickname: member.nickname,
                roles: member.roles.cache.map(role => role.id),
                joinedAt: member.joinedAt,
            }));

            const backupData = {
                id: guild.id,
                name: guild.name,
                bans: banList,
                channels: channels,
                roles: roles,
                members: members,
                createdAt: guild.createdAt,
            };

            const backupDir = path.join(__dirname, '../backups');
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir);
            }

            const fileName = `${guild.name.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
            const filePath = path.join(backupDir, fileName);

            const replacer = (key, value) => (typeof value === 'bigint' ? value.toString() : value);

            fs.writeFileSync(filePath, JSON.stringify(backupData, replacer, 2), 'utf-8');

            message.channel.send(`Backup created successfully: \`${fileName}\``);
        } catch (error) {
            console.error('Error creating backup:', error);
            message.channel.send('An error occurred while creating the backup.');
        }
    },
};
