const { Sequelize } = require('sequelize');

const { sequelize } = require('./sqlClient');

const People = sequelize.define('people', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
    },
    name: Sequelize.STRING,
    count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
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
People.sync();

const incrementPerson = async (id, name) => {
    let person = await People.findOne({ where: { id } });
    if (!person) {
        person = await People.create({
            id,
            name,
        });
    }
    person.increment('count');
};

const getTopPeople = async () => {
    const topPeople = await People.findAll({ order: [['count', 'DESC']] });
    return topPeople;
};

module.exports = {
    incrementPerson,
    getTopPeople,
};