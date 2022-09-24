const { SlashCommandBuilder } = require('discord.js');
const Levels = require('discord-xp');
Levels.setURL('mongodb+srv://root:848200@cluster0.tu5vc.mongodb.net');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('level')
		.setDescription('Gets your current user level'),
	async execute(interaction) {
		const level = Levels.fetch(interaction.user.id, '771017297816846387', false);
        console.log(level);
		await interaction.reply({ content: 'logged', ephemeral: true });
	},
};
