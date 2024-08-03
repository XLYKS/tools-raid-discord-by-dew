const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`
\x1b[35m╔══════════════════════════════════════════════════╗
║               Démarrage du Bot RAID              ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║ Connecté en tant que: ${client.user.tag}         ║
║                                                  ║
╠══════════════════════════════════════════════════╣
║                 Informations                     ║
║ ------------------------------------------------ ║
║ Connecté : ${client.user.tag}                    ║
║                                                  ║
╠══════════════════════════════════════════════════╣
║                 Configuration                    ║
║ ------------------------------------------------ ║
║ Prefix : ${config.prefix}                        ║
║ Statut : ${client.user.presence.status}          ║
║                                                  ║
╠══════════════════════════════════════════════════╣
║                  Commandes                       ║
║ ------------------------------------------------ ║
║ spam <message>   : spam 100 messages dans tous   ║
║                   les salons                     ║
║ nuke             : delete tous les salons du     ║
║                   serveur                        ║
║ dm               : dm tous les membres du serveur║
║ name <text>     : change le nom de tous les      ║
║                   utilisateurs du serveur        ║
║ backup           : sauvegarde un serveur en .json║
║                                                  ║
╚══════════════════════════════════════════════════╝\x1b[0m
    `);
});

client.on('messageCreate', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        command.execute(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.login(config.token).catch(err => {
    console.error('\x1b[31m[N] Erreur de connexion :\x1b[0m', err);
});
