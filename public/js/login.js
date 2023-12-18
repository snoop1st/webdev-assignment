let loginPopupVisible = false; // Track the visibility of the login popup

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

        function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Invalid credentials');
            }
            return response.json();
        })
        .then(data => {
            let sessionId = getCookie(username + '_sessionId');

            if (!sessionId) {
                sessionId = uuidv4();
                setCookie(username + '_sessionId', sessionId, 365); // Set the cookie to expire in 365 days
            }

            console.log('User UUID:', sessionId);

            // Update the user-info section
            const userInfo = document.getElementById('user-info');
            const loggedUsername = document.getElementById('logged-username');
            loggedUsername.textContent = username;
            userInfo.style.display = 'block';

            // Close the login popup after successful login
            closeLoginPopup();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Invalid credentials. Please try again.');
        })
        .finally(() => {
            // Redirect to category.html
            window.location.href = 'category.html?id=' + sessionId;
        });
}


        // Function to set a cookie
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