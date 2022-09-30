const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('shounentime', 'michael', 'password', {
	host: 'localhost',
	dialect: 'mysql',
});

const Quotes = sequelize.define('quotes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    quote: {
        type: Sequelize.STRING(1000),
        allowNull: false,
    },
    author: Sequelize.STRING,
    guildId: Sequelize.STRING,
    addedBy: Sequelize.STRING,
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

const getQuote = async (params) => {
    return await Quotes.findOne({ where: params });
};

const getRandomQuote = async () => {
    return await Quotes.findOne({
        order: sequelize.random(),
    });
};

module.exports = {
    addQuote,
    getQuote,
    getRandomQuote,
};