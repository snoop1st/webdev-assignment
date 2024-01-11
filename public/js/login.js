// Initiate the login popup
document.addEventListener('DOMContentLoaded', function () {
    const closeButton = document.querySelector('.close-button');
    const loginPopup = document.getElementById('login-popup');

    closeButton.addEventListener('click', closeLoginPopup);
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && loginPopup.style.display === 'block') { // Allow to close the popup with escape key
            closeLoginPopup();
        }
    });

    // Check if the user is logged in from the localStorage
    const storedJsonResponse = localStorage.getItem('jsonResponse');
    if (storedJsonResponse) {
        const jsonResponse = JSON.parse(storedJsonResponse);
        updateUserInfo(jsonResponse);
    }
});

// Close the login popup
function closeLoginPopup() {
    document.getElementById('login-popup').style.display = 'none';
    loginPopupVisible = false;
}

// Open the login popup
function openLoginPopup(event) {
    event.preventDefault();
    document.getElementById('login-popup').style.display = 'block';
    loginPopupVisible = true;
}

function updateUserInfo(jsonResponse) {
    const userInfo = document.getElementById('user-info');
    const loggedUsername = document.getElementById('logged-username');
    const favoritesLink = document.getElementById('favorites-link');

    loggedUsername.textContent = jsonResponse.username;
    userInfo.style.display = 'block';

    // Set the href attribute of the favorites link
    if (favoritesLink) {
        favoritesLink.href = `favorite-ads.html?username=${jsonResponse.username}&sessionId=${jsonResponse.uuid}`;
    }
}

// Authenticate the user with the database
function authenticateUser(username, password) {
    if (userCredentialsDAO.hasOwnProperty(username)) {
        if (userCredentialsDAO[username] === password) {
            let userUuid = getSessionCookie(username);

            if (!userUuid) {
                userUuid = uuidv4();
                setSessionCookie(username, userUuid);
            }

            return {
                statusCode: 200,
                body: {
                    sessionId: userUuid,
                },
            };
        }
    }

    return {
        statusCode: 401,
        body: {
            error: 'Invalid credentials',
        },
    };
}

// Login function
function login() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const authenticationResult = authenticateUser(username, password);

    if (authenticationResult.statusCode === 200) {
        closeLoginPopup();
        window.jsonResponse = {
            sessionId: authenticationResult.body.sessionId,
            username: username,
            uuid: authenticationResult.body.sessionId,
        };          
        localStorage.setItem('jsonResponse', JSON.stringify(window.jsonResponse));
        updateUserInfo(window.jsonResponse);

        console.log('Logged in with UUID:', window.jsonResponse.uuid);
        console.log('Logged in with Username:', window.jsonResponse.username);
        
        const currentUrl = window.location.href;
    
        if (currentUrl.includes('favorite')) // Handle the case when changes account while on
        // favorite page (because it would show the previous user's favorites, big security issue)
            window.location.href = 'index.html';
        else // Else just reload in all other pages
            window.location.reload();

    } else {
        console.error('Error:', authenticationResult.body.error);
        alert('Invalid credentials. Please try again.');
    }
}

// All the following functions are used to handle the login sessions
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + '; ' + expires + '; path=/';
}

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
    setCookie(username, sessionId, 1);
}

function getSessionCookie(username) {
    return getCookie(username);
}
