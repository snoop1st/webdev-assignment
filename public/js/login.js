let loginPopupVisible = false; // Track the visibility of the login popup
let jsonResponse; // Declare jsonResponse in the global scope

document.addEventListener('DOMContentLoaded', function () {
    // Add event listeners for closing the popup
    const closeButton = document.querySelector('.close-button');
    const loginPopup = document.getElementById('login-popup');

    closeButton.addEventListener('click', closeLoginPopup);
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && loginPopup.style.display === 'block') {
            closeLoginPopup();
        }
    });
});

function closeLoginPopup() {
    document.getElementById('login-popup').style.display = 'none';
    loginPopupVisible = false;
}

function openLoginPopup(event) {
    event.preventDefault(); // Prevent the default behavior of the click event
    document.getElementById('login-popup').style.display = 'block';
    loginPopupVisible = true;
}

const userCredentialsDAO = {
    'test': 'test',
    'test2': 'test2',
    'nikos': 'qwerty',
};

// Function to authenticate the user using DAO
function authenticateUser(username, password) {

    // Check if the provided username exists in the userCredentialsDAO object
    if (userCredentialsDAO.hasOwnProperty(username)) {
        if (userCredentialsDAO[username] === password) {
            // Check if the user already has a session UUID cookie
            let userUuid = getSessionCookie(username);

            if (!userUuid) {
                // If not, generate a new UUID and set the cookie
                userUuid = uuidv4();
                setSessionCookie(username, userUuid);
            }

            console.log('Authentication successful for:', username);
            return {
                statusCode: 200,
                body: {
                    sessionId: userUuid,
                },
            };
        }
    }

    // If username or password is incorrect, return an error response
    console.log('Authentication failed for:', username);
    return {
        statusCode: 401,
        body: {
            error: 'Invalid credentials',
        },
    };
}

// Function to set a session cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + '; ' + expires + '; path=/';
}

// Function to get a cookie value
function getCookie(name) {
    const cookieName = name + '=';
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return '';
}

// Function to set a session cookie
function setSessionCookie(username, sessionId) {
    setCookie(username, sessionId, 1); // Set the session cookie to expire in 1 day
}

// Function to get the user's session UUID from the cookie
function getSessionCookie(username) {
    return getCookie(username);
}

// Function to trim leading and trailing whitespace from username and password
function login() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const userInfo = document.getElementById('user-info');
    const loggedUsername = document.getElementById('logged-username');

    const username = usernameInput.value.trim(); // Trim whitespace
    const password = passwordInput.value.trim(); // Trim whitespace

    const authenticationResult = authenticateUser(username, password);

    if (authenticationResult.statusCode === 200) {
        // Close the login popup upon successful login
        closeLoginPopup();

        // Set the jsonResponse as a global variable
        window.jsonResponse = {
            sessionId: authenticationResult.body.sessionId,
            username: username,
            uuid: authenticationResult.body.sessionId,
        };

        // Save user session data in local storage
        localStorage.setItem('jsonResponse', JSON.stringify(window.jsonResponse));

        // Update the user-info section
        loggedUsername.textContent = username;
        userInfo.style.display = 'block';

        console.log('Logged in with UUID:', window.jsonResponse.uuid);
        console.log('Logged in with Username:', window.jsonResponse.username);
    } else {
        // Display an error message for unsuccessful authentication
        console.error('Error:', authenticationResult.body.error);
        alert('Invalid credentials. Please try again.');
    }
}
