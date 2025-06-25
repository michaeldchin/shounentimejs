const { Sequelize, Op } = require('sequelize');

const { sequelize } = require('./sqlClient');

const PodcastTopics = sequelize.define('podcastTopics', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    topic: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
    },
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
PodcastTopics.sync();

const addPodcastTopic = async (topic, guildId, userId) => {
    return await PodcastTopics.create({
        topic,
        guildId,
        addedBy: userId,
    });
};

const getPodcastTopicById = async (id) => {
    return await PodcastTopics.findOne({ where: { id } });
};

const getRandomPodcastTopic = async (guildId) => {
    return await PodcastTopics.findOne({
        where: {
            guildId: {
                [Op.or]: [ guildId, null],
            },
        },
        order: sequelize.random(),
    });
};

const getRandomServerPodcastTopic = async (guildId) => {
    return await PodcastTopics.findOne({
        where: { guildId },
        order: sequelize.random(),
    });
};

module.exports = {
    addPodcastTopic,
    getPodcastTopicById,
    getRandomPodcastTopic,
    getRandomServerPodcastTopic,
};
