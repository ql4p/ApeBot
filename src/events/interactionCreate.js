const { Events, InteractionType, MessageActionRow, MessageButton } = require('discord.js');
const { ProcessingRequest, ProcessingLog } = require('../../models');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        } else if (interaction.type === InteractionType.MessageComponent && interaction.isButton()) {
            const [action, requestId] = interaction.customId.split('-');

            const request = await ProcessingRequest.findByPk(requestId);

            if (!request) {
                return interaction.reply({ content: 'Request not found.', ephemeral: true });
            }

            if (request.status !== 'pending') {
                return interaction.reply({ content: 'This request has already been processed.', ephemeral: true });
            }

            if (action === 'approve') {
                await request.update({ status: 'approved', actionBy: interaction.user.id });
                await ProcessingLog.create({ requestId: request.id, action: 'approved', actionBy: interaction.user.id });

                const adminChannel = interaction.guild.channels.cache.find(channel => channel.name === 'admin-channel');
                if (adminChannel && interaction.message) {
                    await interaction.message.edit({ 
                        content: `Registration request from <@${request.discordId}>: RSN: ${request.rsn} was approved by <@${interaction.user.id}>.`,
                        components: []
                    });
                }

                await interaction.reply({ content: `Request approved for <@${request.discordId}>.`, ephemeral: true });

                const user = await interaction.client.users.fetch(request.discordId);
                if (user) {
                    user.send(`Your registration request for RSN: ${request.rsn} has been approved.`);
                }
            } else if (action === 'reject') {
                await request.update({ status: 'rejected', actionBy: interaction.user.id });
                await ProcessingLog.create({ requestId: request.id, action: 'rejected', actionBy: interaction.user.id });

                const adminChannel = interaction.guild.channels.cache.find(channel => channel.name === 'admin-channel');
                if (adminChannel && interaction.message) {
                    await interaction.message.edit({ 
                        content: `Registration request from <@${request.discordId}>: RSN: ${request.rsn} was rejected by <@${interaction.user.id}>.`,
                        components: []
                    });
                }

                await interaction.reply({ content: `Request rejected for <@${request.discordId}>.`, ephemeral: true });

                const user = await interaction.client.users.fetch(request.discordId);
                if (user) {
                    user.send(`Your registration request for RSN: ${request.rsn} has been rejected.`);
                }
            }
        }
    },
};
