const { WOMClient } = require('@wise-old-man/utils');
const { groupId, clanPassword } = require('../../config/config.json').wom;
const db = require('../../models');

module.exports = async (client) => {
    const womClient = new WOMClient();
    const TASK_NAME = 'updateWOMGroup';

    const getTaskTemplateId = async () => {
        const taskTemplate = await db.TaskTemplate.findOne({
            where: { taskName: TASK_NAME }
        });
        return taskTemplate ? taskTemplate.id : null;
    };

    const getLastTaskLog = async (taskTemplateId) => {
        return db.TaskLog.findOne({
            where: { taskTemplateId },
            order: [['lastRunTime', 'DESC']]
        });
    };

    const logTaskExecution = async (taskTemplateId, status, message) => {
        await db.TaskLog.create({
            taskTemplateId,
            lastRunTime: new Date(),
            status,
            message
        });
    };

    const updateGroup = async () => {
        const taskTemplateId = await getTaskTemplateId();
        if (!taskTemplateId) {
            console.error(`Task template with name "${TASK_NAME}" not found.`);
            return;
        }

        const lastLog = await getLastTaskLog(taskTemplateId);
        const now = new Date();

        if (lastLog) {
            const lastRunTime = new Date(lastLog.lastRunTime);
            const oneHour = 60 * 60 * 1000;
            const oneMinute = 60 * 1000;

            if (lastLog.status === 'error') {
                // Retry after 1 minute if it failed
                if (now - lastRunTime >= oneMinute) {
                    try {
                        await womClient.groups.updateAll(groupId, clanPassword);
                        console.log('Group updated successfully');
                        await logTaskExecution(taskTemplateId, 'success', 'Group updated successfully');
                    } catch (error) {
                        console.error('Error updating group:', error);
                        await logTaskExecution(taskTemplateId, 'error', error.message);
                    }
                } else {
                    console.log('Waiting for retry delay.');
                }
            } else if (lastLog.status === 'success') {
                // Check if an hour has passed
                if (now - lastRunTime >= oneHour) {
                    try {
                        await womClient.groups.updateAll(groupId, clanPassword);
                        console.log('Group updated successfully');
                        await logTaskExecution(taskTemplateId, 'success', 'Group updated successfully');
                    } catch (error) {
                        console.error('Error updating group:', error);
                        await logTaskExecution(taskTemplateId, 'error', error.message);
                    }
                } else {
                    console.log('Not enough time has passed since last successful execution.');
                }
            }
        } else {
            // If no logs exist, perform the update
            try {
                await womClient.groups.updateAll(groupId, clanPassword);
                console.log('Group updated successfully');
                await logTaskExecution(taskTemplateId, 'success', 'Group updated successfully');
            } catch (error) {
                console.error('Error updating group:', error);
                await logTaskExecution(taskTemplateId, 'error', error.message);
            }
        }
    };

    // Run the task initially and then set it to repeat every minute
    await updateGroup();
    setInterval(updateGroup, 60000); // Run script every minute
};
