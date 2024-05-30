document.addEventListener('DOMContentLoaded', function() {
    setVisibility();

    // get buttons for log in and log out
    let signInButton = document.getElementById('extension-sign-in');
    let signOutButton = document.getElementById('extension-sign-out');

    // set HTML content for users who already logged in and refreshed
    document.getElementById('user-email').innerText = localStorage.getItem('userEmail');
    document.getElementById('login-date').innerText = localStorage.getItem('loginDate');

    // add click event to sign in - login through OAuth2
    signInButton.addEventListener('click', function() {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
            // save authentication token
            localStorage.setItem('authToken', token);

            // query API for user email
            let req = new XMLHttpRequest();
            req.open('GET', 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
            req.onload = function() {
                localStorage.setItem('userEmail', JSON.parse(req.response).email);
                document.getElementById('user-email').innerText = localStorage.getItem('userEmail');
            };
            req.send();

            // save the date of login (today)
            localStorage.setItem('loginDate', new Date().toDateString());
            document.getElementById('login-date').innerText = localStorage.getItem('loginDate');

            // hide login, show logout
            setVisibility();
        });
    });

    // add click event to sign out
    signOutButton.addEventListener('click', function() {
        chrome.identity.removeCachedAuthToken({token: localStorage.getItem('authToken')}, function (){
            localStorage.removeItem("authToken");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("loginDate");
            setVisibility();
        });
    });
});

// Function to flip visibility between the two states: logged in and logged out.
// Depending on whether the authentication is available, show one section or the other.
function setVisibility() {
    if(!localStorage.getItem('authToken')) {
        document.getElementById('extension-sign-in').style.display = 'block';
        document.getElementById('user-info').style.display = 'none';
    }
    else {
        document.getElementById('extension-sign-in').style.display = 'none';
        document.getElementById('user-info').style.display = 'block';
    }
}
