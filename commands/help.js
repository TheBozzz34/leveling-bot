const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with a list of commands'),
	async execute(interaction) {
		const exampleEmbed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Felina Help')
			.setURL('https://discord.js.org/')
			.setAuthor({ name: 'Felina', iconURL: 'https://cdn-icons-png.flaticon.com/512/539/539043.png', url: 'https://necrozma.xyz' })
			.setDescription('A Leveling Bot By Necrozma')
			.setThumbnail('https://cdn-icons-png.flaticon.com/512/539/539043.png')
			.addFields(
				{ name: '/ping', value: 'Replies with "Ping!"' },
				{ name: '/user', value: 'Replies with user info' },
				{ name: '/server', value: 'Replies with server info' },
				{ name: '/help', value: 'Replies with this message' },
			)
			.setTimestamp()
			.setFooter({ text: 'Written by Sadan#9264', iconURL: 'https://cdn-icons-png.flaticon.com/512/539/539043.png' });
		await interaction.reply({ embeds: [exampleEmbed] });
	},
};
