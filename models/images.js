const { Sequelize, Op } = require('sequelize');

const sequelize = new Sequelize('shounentime', 'michael', 'password', {
	host: 'localhost',
	dialect: 'mysql',
});

const Images = sequelize.define('images', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    url: {
        type: Sequelize.STRING(500),
        unique: true,
    },
    tag: Sequelize.STRING,
    guildId: Sequelize.STRING,
    addedBy: Sequelize.STRING,
});

// Creates Table if it doesn't exists.
Images.sync();

const addImage = async (url, tag, guildId, userId) => {
    return await Images.create({
        url,
        tag,
        guildId,
        addedBy: userId,
    });
};

const getImageById = async (id) => {
    return await Images.findOne({ where: { id } });
};

const getRandomImage = async (guildId) => {
    return await Images.findOne({
        where: {
            guildId: {
                [Op.or]: [ guildId, null],
            },
        },
        order: sequelize.random(),
    });
};

const getRandomServerImage = async (guildId) => {
    return await Images.findOne({
        where: { guildId },
        order: sequelize.random(),
    });
};

module.exports = {
    addImage,
    getImageById,
    getRandomImage,
    getRandomServerImage,
};