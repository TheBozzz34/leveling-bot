/* eslint-disable no-mixed-spaces-and-tabs */
const { SlashCommandBuilder } = require('discord.js');
const Levels = require('discord-xp');
Levels.setURL(require('../config.json').mongoURL);

module.exports = {
 	data: new SlashCommandBuilder()
 		.setName('xpset')
 		.addUserOption(option => option.setName('user').setDescription('user').setRequired(true))
 		.addIntegerOption(option => option.setName('xp').setDescription('xp').setRequired(true))
 		.setDescription('Sets a users xp'),
 	async execute(interaction) {
 		const user = interaction.options.getUser('user');
 		const xp = interaction.options.getInteger('xp');
 		if (!interaction.member.permissions.has('0x0000000000000008')) return interaction.reply({ content: 'You do not have permission to use this command!', ephemeral: true });
 		if (!user) return interaction.reply({ content: 'You need to specify a user!', ephemeral: true });
 		if (!xp) return interaction.reply({ content: 'You need to specify a xp!', ephemeral: true });
 		const userXp = await Levels.setXp(user.id, interaction.guild.id, xp);
 		interaction.reply({ content: `Set ${user.username}'s xp to ${userXp.xp}`, ephemeral: true });
 	},
};

