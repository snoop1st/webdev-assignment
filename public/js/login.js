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

// Define a constant object for username-password pairs
const userCredentials = {
    'test': 'test', //f82b4bb9-503b-4fb1-995a-eedaabdb4cec
    'test2': 'test2', //9395d747-8b92-42e2-9686-9cc6162d46d7
    'nikos': 'qwerty',
};

function login() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    const username = usernameInput.value;
    const password = passwordInput.value;

    const authenticationResult = authenticateUser(username, password);

    if (authenticationResult.statusCode === 200) {
        let sessionId = getSessionCookie(username);

        if (!sessionId) {
            sessionId = uuidv4();
            setSessionCookie(username, sessionId);
        }

        // Log the generated session ID to the console
        console.log('Generated Session ID:', sessionId);

        // Construct the JSON response with the session ID
        const jsonResponse = {
            sessionId: sessionId,
            username: username, // Pass the username to the AFS endpoint
            uuid: sessionId // Pass a new UUID to the AFS endpoint
        };

        // Log the JSON response to the console
        console.log('JSON Response:', jsonResponse);

        // Update the user-info section
        const userInfo = document.getElementById('user-info');
        const loggedUsername = document.getElementById('logged-username');
        loggedUsername.textContent = username;
        userInfo.style.display = 'block';

        // Close the login popup after successful login
        closeLoginPopup();

        // Set the jsonResponse as a global variable
        window.jsonResponse = jsonResponse;

        // Display the JSON response instead of redirecting
        const messageContainer = document.getElementById('login-message');
        localStorage.setItem('jsonResponse', JSON.stringify(jsonResponse));

        // Optionally, you can clear the login form
        usernameInput.value = '';
        passwordInput.value = '';
    } else {
        // Display an error message for unsuccessful authentication
        console.error('Error:', authenticationResult.body.error);
        alert('Invalid credentials. Please try again.');
    }
}




// Function to authenticate the user
function authenticateUser(username, password) {
    // Check if the provided username exists in the userCredentials object
    if (userCredentials.hasOwnProperty(username)) {
        // Check if the provided password matches the stored password for the username
        if (userCredentials[username] === password) {
            const sessionId = uuidv4(); // Generate a unique session ID
            return {
                statusCode: 200,
                body: {
                    sessionId: sessionId,
                },
            };
        }
    }

    // If username or password is incorrect, return an error response
    return {
        statusCode: 401,
        body: {
            error: 'Invalid credentials',
        },
    };
}

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
function setSessionCookie(username, sessionId) {
    setCookie(username, sessionId, 1); // Set the session cookie to expire in 1 day
}

// Function to get the user's session UUID from the cookie works only for one session 
//of running the Node server, thus everytime the server is restarted, the cookie is deleted
function getSessionCookie(username) {
    return getCookie(username);
}


