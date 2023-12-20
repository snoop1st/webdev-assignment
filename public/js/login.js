document.addEventListener('DOMContentLoaded', function () {
    const closeButton = document.querySelector('.close-button');
    const loginPopup = document.getElementById('login-popup');

    closeButton.addEventListener('click', closeLoginPopup);
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && loginPopup.style.display === 'block') {
            closeLoginPopup();
        }
    });

    const storedJsonResponse = localStorage.getItem('jsonResponse');
    if (storedJsonResponse) {
        const jsonResponse = JSON.parse(storedJsonResponse);
        updateUserInfo(jsonResponse);
    }
});

function closeLoginPopup() {
    document.getElementById('login-popup').style.display = 'none';
    loginPopupVisible = false;
}

function openLoginPopup(event) {
    event.preventDefault();
    document.getElementById('login-popup').style.display = 'block';
    loginPopupVisible = true;
}

function updateUserInfo(jsonResponse) {
    const userInfo = document.getElementById('user-info');
    const loggedUsername = document.getElementById('logged-username');

    loggedUsername.textContent = jsonResponse.username;
    userInfo.style.display = 'block';
}

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
  
      // Save user session data in a cookie
      setSessionCookie(username, window.jsonResponse);
  
      // Update the user-info section
      loggedUsername.textContent = username;
      userInfo.style.display = 'block';
  
      console.log('Logged in with UUID:', window.jsonResponse.uuid);
      console.log('Logged in with Username:', window.jsonResponse.username);
  
      // Optionally update UI to show user's favorites after login
      updateFavoritesUI(window.jsonResponse.uuid);
    } else {
      // Display an error message for unsuccessful authentication
      console.error('Error:', authenticationResult.body.error);
      alert('Invalid credentials. Please try again.');
    }
}