const { SlashCommandBuilder } = require('discord.js');
const Levels = require('discord-xp');
Levels.setURL(require('../config.json').mongoURL);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('levelset')
		.addUserOption(option => option.setName('user').setDescription('user').setRequired(true))
		.addIntegerOption(option => option.setName('level').setDescription('level').setRequired(true))
		.setDescription('Sets a users level'),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const level = interaction.options.getInteger('level');
		if (!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });
		if (!user) return interaction.reply({ content: 'You need to specify a user!', ephemeral: true });
		if (!level) return interaction.reply({ content: 'You need to specify a level!', ephemeral: true });
		const userLevel = await Levels.setLevel(user.id, interaction.guild.id, level);
		interaction.reply({ content: `Set ${user.username}'s level to ${userLevel.level}`, ephemeral: true });
	},
};
