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
        allowNull: false
    },
    channelId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    reminderDate: {
        type: Sequelize.DATE,
        allowNull: false
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
        guildId
    });
};

// const getQuoteById = async (id) => {
//     return await Quotes.findOne({ where: { id } });
// };

// const getRandomQuote = async (guildId) => {
//     return await Quotes.findOne({
//         where: {
//             guildId: {
//                 [Op.or]: [ guildId, null],
//             },
//         },
//         order: sequelize.random(),
//     });
// };

// const getRandomServerQuote = async (guildId) => {
//     return await Quotes.findOne({
//         where: { guildId },
//         order: sequelize.random(),
//     });
// };

module.exports = {
    addReminder
};