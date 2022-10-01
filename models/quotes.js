const { Sequelize, Op } = require('sequelize');

const { sequelize } = require('./sqlClient');

const Quotes = sequelize.define('quotes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    quote: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
    },
    author: Sequelize.STRING,
    guildId: Sequelize.STRING,
    addedBy: Sequelize.STRING,
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
Quotes.sync();

const addQuote = async (quote, author, guildId, userId) => {
    return await Quotes.create({
        quote,
        author,
        guildId,
        addedBy: userId,
    });
};

const getQuoteById = async (id) => {
    return await Quotes.findOne({ where: { id } });
};

const getRandomQuote = async (guildId) => {
    return await Quotes.findOne({
        where: {
            guildId: {
                [Op.or]: [ guildId, null],
            },
        },
        order: sequelize.random(),
    });
};

const getRandomServerQuote = async (guildId) => {
    return await Quotes.findOne({
        where: { guildId },
        order: sequelize.random(),
    });
};

module.exports = {
    addQuote,
    getQuoteById,
    getRandomQuote,
    getRandomServerQuote,
};