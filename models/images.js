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
    filename: Sequelize.STRING(255),
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

const ensureFilenameColumn = async () => {
    try {
        const [columns] = await sequelize.query(
            "SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'images' AND COLUMN_NAME = 'filename'",
        );
        if (columns.length === 0) {
            await sequelize.query('ALTER TABLE images ADD COLUMN filename VARCHAR(255) NULL');
            console.log('Migration: added images.filename column.');
        }
    }
    catch (error) {
        console.error('Migration failed (images.filename):', error.message);
    }
};

// Creates Table if it doesn't exists.
Images.sync().then(ensureFilenameColumn);

const addImage = async (url, tag, guildId, userId, filename) => {
    return await Images.create({
        url,
        filename,
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

const getImagesWithoutFilename = async (limit = 1000) => {
    return await Images.findAll({ where: { filename: null }, limit });
};

const setImageFilename = async (id, filename) => {
    return await Images.update({ filename }, { where: { id } });
};

const getDiscordImagesWithoutFilename = async (limit = null) => {
    const options = {
        where: {
            filename: null,
            url: {
                [Op.or]: [
                    { [Op.like]: 'https://cdn.discordapp.com/%' },
                    { [Op.like]: 'https://media.discordapp.net/%' },
                ],
            },
        },
        order: [['id', 'ASC']],
    };
    if (limit) {
        options.limit = limit;
    }
    return await Images.findAll(options);
};

const updateImageUrl = async (id, url) => {
    return await Images.update({ url }, { where: { id } });
};

module.exports = {
    addImage,
    getImageById,
    getRandomImage,
    getRandomServerImage,
    getImagesWithoutFilename,
    getDiscordImagesWithoutFilename,
    setImageFilename,
    updateImageUrl,
};
