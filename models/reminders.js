const { Sequelize, Op } = require('sequelize');

const { sequelize } = require('./sqlClient');

const Reminders = sequelize.define('reminders', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    reminder: {
        type: Sequelize.STRING(500),
        allowNull: false,
    },
    channelId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    reminderDate: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    reminderSent: {
        type: Sequelize.BOOLEAN,
        defaultValue: sequelize.literal(false),
        allowNull: false,
    },
    discordId: Sequelize.STRING,
    guildId: Sequelize.STRING,
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    },
});

// Creates Table if it doesn't exists.
Reminders.sync();

const addReminder = async (reminder, channelId, reminderDate, discordId, guildId) => {
    return await Reminders.create({
        reminder,
        channelId,
        reminderDate,
        discordId,
        guildId,
    });
};

const listReminders = async (discordId, date) => {
    return await Reminders.findAll({
        where: {
            discordId,
            reminderDate: {
                [Op.gt]: date,
            },
        },
    });
};

const getDueReminders = async () => {
    return await Reminders.findAll({
        where: {
            reminderDate: {
                [Op.lt]: Date.now(),
            },
            reminderSent: {
                [Op.eq]: false,
            },
        },
    });
};

const setSentFlag = async (id) => {
    return await Reminders.update(
        { reminderSent: true },
        { where: { id } },
    );
};

module.exports = {
    addReminder,
    listReminders,
    getDueReminders,
    setSentFlag,
};