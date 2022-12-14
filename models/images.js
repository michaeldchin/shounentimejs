const { Sequelize, Op } = require('sequelize');

const { sequelize } = require('./sqlClient');

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