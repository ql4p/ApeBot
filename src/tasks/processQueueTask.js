const { WOMClient } = require('@wise-old-man/utils');
const db = require('../../models');

module.exports = async (client) => {
    const womClient = new WOMClient();
    const TASK_NAME = 'processRegistrationQueue';

    const getTaskTemplateId = async () => {
        const taskTemplate = await db.TaskTemplate.findOne({
            where: { taskName: TASK_NAME }
        });
        return taskTemplate ? taskTemplate.id : null;
    };

    const logTaskExecution = async (taskTemplateId, status, message) => {
        await db.TaskLog.create({
            taskTemplateId,
            lastRunTime: new Date(),
            status,
            message
        });
    };

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const handleProcessingRequests = async () => {
        const requests = await db.ProcessingRequest.findAll({
            where: { status: 'approved' }
        });

        if (requests.length === 0) {
            console.log('No processing requests to handle.');
            return false;
        }

        for (const request of requests) {
            const [user, created] = await db.User.findOrCreate({
                where: { discordId: request.discordId }
            });

            if (created) {
                console.log(`User created: ${request.discordId}`);
            }

            try {
                const playerDetails = await womClient.players.getPlayerDetails(request.rsn);
                const { id: womId, displayName: womUsername } = playerDetails;

                await db.Account.create({
                    userId: user.id,
                    womId,
                    womUsername,
                    isMain: true,
                    inClan: false
                });

                console.log(`Account created for RSN: ${request.rsn}`);
                
                await request.update({ status: 'completed' });
                
                await db.ProcessingLog.create({
                    requestId: request.id,
                    action: 'completed',
                    actionBy: null, // No specific user action for this
                    timestamp: new Date()
                });

            } catch (error) {
                console.error(`Failed to fetch details for RSN ${request.rsn}:`, error);
                
                await db.ProcessingLog.create({
                    requestId: request.id,
                    action: 'failed-fetch',
                    actionBy: null,
                    timestamp: new Date()
                });
            }

            // Delay to respect rate limits
            await delay(1000);
        }

        return true;
    };

    const runTask = async () => {
        const taskTemplateId = await getTaskTemplateId();
        if (!taskTemplateId) {
            console.error(`Task template with name "${TASK_NAME}" not found.`);
            return;
        }

        try {
            const processed = await handleProcessingRequests();
            if (processed) {
                await logTaskExecution(taskTemplateId, 'success', 'Queue processed successfully');
            }
        } catch (error) {
            console.error('Error processing the queue:', error);
            await logTaskExecution(taskTemplateId, 'error', error.message);
        }
    };

    await runTask();
    setInterval(runTask, 60000);
};
