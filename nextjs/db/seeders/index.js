//import { QueryInterface } from 'sequelize';
const UserSeed = require('./20231013102801-demo-user');

module.exports = function(query) {
    return Promise.all([ // Returning and thus passing a Promise here
        // Independent seeds first
        UserSeed.up(query),
    ]).then(() => {
        // More seeds that require IDs from the seeds above
    }).then(() => {
        console.log('********** Successfully seeded db **********');
    });
}
