const { Sequelize } = require('sequelize');

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
    url: Sequelize.STRING(2000),
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

const getImage = async (params) => {
    return await Images.findOne({ where: { params } });
};

const getRandomImage = async () => {
    return await Images.findOne({
        order: sequelize.random(),
    });
};

module.exports = {
    addImage,
    getImage,
    getRandomImage,
};