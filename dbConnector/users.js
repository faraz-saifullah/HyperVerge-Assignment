let DataService = require('../utils/datasource/DataService');

class UsersDbConnector {
    async createNewUser(userDetails) {
        const sqlQuery = {
            text: `INSERT INTO users (name, email, phone, type) values ($1, $2, $3, $4)`,
            values: [userDetails.name, userDetails.email, userDetails.phone, userDetails.type]
        };
        return await new DataService().executeQueryAsPromise(sqlQuery, true);
    }

    async selectUserWithPhone(phoneNumber) {
        const sqlQuery = {
            text: `SELECT * FROM users where phone = ($1)`,
            values: [phoneNumber]
        }
        return await new DataService().executeQueryAsPromise(sqlQuery);
    }
}

module.exports = UsersDbConnector;
