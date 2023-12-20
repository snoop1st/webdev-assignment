// userDao.js

const userCredentialsDAO = {
    'test': 'test',
    'test2': 'test2',
    'nikos': 'qwerty',
};

// Function to get a user by username
function getUserByUsername(username) {
    if (userCredentialsDAO.hasOwnProperty(username)) {
        return {
            username: username,
            password: userCredentialsDAO[username],
        };
    } else {
        return null;
    }
}

module.exports = {
    getUserByUsername
};
