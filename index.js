const chalk = require('chalk');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { token, guildId, clientId, mongoURL } = require('./config.json');


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

const pino = require('pino');
const logger = pino();
module.exports = logger;

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const Levels = require('discord-xp');
Levels.setURL(mongoURL);

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	logger.info(chalk.blue('Logged in as: %s#%s'), client.user.username, client.user.discriminator);
	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('primary')
				.setLabel('Acccess Server')
				.setStyle(ButtonStyle.Danger),
		);
	client.channels.cache.get('791692816430399518').send({
		content: 'Hello World!',
		components: [row],
	});
});

client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
	if (interaction.customId === 'primary') {
		interaction.reply({ content: 'Pong!', ephemeral: true });
		console.log(interaction.member.id);
		interaction.member.roles.add('955601037153149069').catch(console.error);
		interaction.member.roles.remove('1023669852537356388').catch(console.error);
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on('guildMemberAdd', member => {
	const joinEmbed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('**' + member.user.tag + '** joined the server')
		.setDescription('There are now **' + member.guild.memberCount + '** members')
		.setTimestamp()
		.setFooter({ text: 'Written by Sadan#9264', iconURL: 'https://cdn-icons-png.flaticon.com/512/539/539043.png' });
	member.roles.add(member.guild.roles.cache.find(i => i.name === 'Not Verified'));
	member.guild.channels.cache.find(i => i.name === '👋・joins-leaves').send({ embeds: [joinEmbed] });
	Levels.createUser(member.user.id, guildId);
});

client.on('guildMemberRemove', member => {
	const leaveEmbed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('**' + member.user.tag + '** has left')
		.setDescription('There are now **' + member.guild.memberCount + '** members')
		.setTimestamp()
		.setFooter({ text: 'Written by Sadan#9264', iconURL: 'https://cdn-icons-png.flaticon.com/512/539/539043.png' });
	member.guild.channels.cache.find(i => i.name === '👋・joins-leaves').send({ embeds: [leaveEmbed] });
	Levels.deleteUser(member.user.id, guildId);
});


client.on('messageCreate', message => {
	if (message.content.includes('discord.gg/' || 'discordapp.com/invite/' || 'discord.com/invite/')) {
		message.delete()
			.then(message => {
				const inviteEmbed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle('**' + message.author.tag + '** has been warned for sending an invite link')
					.setDescription('**' + message.content + '**')
					.setTimestamp()
					.setFooter({ text: 'Written by Sadan#9264', iconURL: 'https://cdn-icons-png.flaticon.com/512/539/539043.png' });
				message.guild.channels.cache.find(i => i.name === '📛・moderation-logs').send({ embeds: [inviteEmbed] });
			});
	  }
	if (message.author.bot) return;
	if (message.channel.type === 'DM') return;
	if (message.content.startsWith('!')) return;
	const randomXp = Math.floor(Math.random() * 29) + 1;
	Levels.appendXp(message.author.id, guildId, randomXp);
	// message.channel.send({ content: 'You have gained ' + randomXp + ' XP!' });
});

client.login(token);