const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('shounentime', 'michael', 'password', {
	host: 'localhost',
	dialect: 'mysql',
});

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