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
    person_name: Sequelize.STRING,
    count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
});

People.sync();

const incrementPerson = async (_id, _name) => {
    let person = await People.findOne({ where: { id: _id } });
    if (!person) {
        person = await People.create({
            id: _id,
            person_name: _name,
        });
    }
    person.increment('count');
};

module.exports = {
    incrementPerson,
};