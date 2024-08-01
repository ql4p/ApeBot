const { SlashCommandBuilder } = require('@discordjs/builders');
const { ProcessingRequest, ProcessingLog, User, Account } = require('../../../models');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register your RuneScape username')
    .addStringOption(option =>
      option.setName('rsn')
        .setDescription('Your RuneScape username')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    const rsn = interaction.options.getString('rsn');
    const discordId = interaction.user.id;

    // Check if the user is already registered
    const existingUser = await User.findOne({ where: { discordId } });
    if (existingUser) {
      return interaction.reply({ content: 'You are already registered.', ephemeral: true });
    }

    // Check if the user has an approved role
    const member = interaction.guild.members.cache.get(discordId);
    const approvedRole = member.roles.cache.some(role => role.name === 'Clan Member');

    try {
      let request;

      if (approvedRole) {
        // Auto approve
        request = await ProcessingRequest.create({ discordId, rsn, status: 'approved' });
        
        // Log the approval action
        await ProcessingLog.create({
          requestId: request.id,
          action: 'approved',
          actionBy: null, // Automated
          timestamp: new Date()
        });

        return interaction.reply({ content: 'Your registration has been approved and is being processed.', ephemeral: true });
      } else {
        // Manual approval required
        request = await ProcessingRequest.create({ discordId, rsn, status: 'pending' });

        // Log the pending request
        await ProcessingLog.create({
          requestId: request.id,
          action: 'pending',
          actionBy: null, // Automated
          timestamp: new Date()
        });

        // Send message to admin channel for manual approval
        const adminChannel = interaction.guild.channels.cache.find(channel => channel.name === 'admin-channel');
        if (adminChannel) {
          const row = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`approve-${request.id}`)
                .setLabel('Approve')
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId(`reject-${request.id}`)
                .setLabel('Reject')
                .setStyle(ButtonStyle.Danger),
            );

          await adminChannel.send({ content: `New registration request from <@${discordId}>: RSN: ${rsn}`, components: [row] });
        }

        return interaction.reply({ content: 'Your registration request has been submitted for manual approval.', ephemeral: true });
      }
    } catch (error) {
      console.error('Error processing registration:', error);
      return interaction.reply({ content: 'There was an error processing your registration.', ephemeral: true });
    }
  },
};
