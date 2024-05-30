document.addEventListener('DOMContentLoaded', function() {
    let signInButton = document.getElementById('extension-sign-in');

    signInButton.addEventListener('click', function() {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
            alert(token);
        });
    });
});

// Work in progress
