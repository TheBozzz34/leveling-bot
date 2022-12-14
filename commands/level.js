const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Levels = require('discord-xp');
const randomHex = require('random-hex');
const mongoURL = require('../config.json').mongoURL;
Levels.setURL(mongoURL);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('level')
		.setDescription('Gets your current user level')
		.addUserOption(option => option.setName('user').setDescription('user')),
	async execute(interaction) {
		// const level = Levels.fetch(interaction.user.id, '771017297816846387', false);
		// console.log(level);
		// await interaction.reply({ content: 'logged', ephemeral: true });
		const user = interaction.options.getUser('user');
		if (!user) {
			const level = await Levels.fetch(interaction.user.id, interaction.guild.id, true);
			const nextXp = Levels.xpFor(level.level + 1);
			const xpNeeded = nextXp - level.xp;
			const embed = new EmbedBuilder()
				.setTitle(`${interaction.user.username}'s level`)
				.setColor(randomHex.generate())
				.setDescription(`You are currently level **${level.level}!**`)
				.setFooter({
					text: `You have ${level.xp} XP and need ` + xpNeeded + ' XP to level up!',
					iconURL: interaction.user.displayAvatarURL(),
				});
			// console.log(`You have ${level.xp} XP and need ` + xpNeeded + ' XP to level up!');
			return await interaction.reply({ embeds: [embed] });
		}
		const level = await Levels.fetch(user.id, interaction.guild.id, true);
		const nextXp = Levels.xpFor(level.level + 1);
		const xpNeeded = nextXp - level.xp;
		const embed = new EmbedBuilder()
			.setTitle(`${user.username}'s level`)
			.setColor(randomHex.generate())
			.setDescription(`${user.username} is currently level **${level.level}!**`)
			.setFooter({
				text: `${user.username} hase ${level.xp} XP and needs ` + xpNeeded + ' XP to level up!',
				iconURL: user.displayAvatarURL(),
			});
		// console.log(`You have ${level.xp} XP and need ` + xpNeeded + ' XP to level up!');
		await interaction.reply({ embeds: [embed] });
		// await interaction.reply({ content: `Your current level is ${level.level}!`, ephemeral: true });
	},
};
