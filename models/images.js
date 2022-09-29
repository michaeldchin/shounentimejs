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
    guildId: Sequelize.STRING,
});

// Creates Table if it doesn't exists.
Images.sync();

const addImage = async (url, guildId) => {
    return await Images.create({
        url,
        guildId,
    });
};

const getImage = async (params) => {
    return await Images.findOne(params);
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