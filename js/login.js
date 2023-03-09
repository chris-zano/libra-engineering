import "https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js";
import "https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyCvn1T4YvYzNItenZ3E40qgCRZI8ZjqEVk",
    authDomain: "libra-engineering.firebaseapp.com",
    projectId: "libra-engineering",
    storageBucket: "libra-engineering.appspot.com",
    messagingSenderId: "568176612388",
    appId: "1:568176612388:web:7112aba10823b7b845f4b1",
    measurementId: "G-NSZBHTHVZ9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
}
else {
    main();
}

function main() {
    document.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault()
        console.log('trying to submit...');

        //inform the user that the process is loading
        changeButtonAppearance(e.target.querySelector('#submit-btn'),'on');

        //pass the username and password into an object
        const credentials = {
            username: getUserCredentials().username,
            password: getUserCredentials().password
        }

        //a function to authenticate the user
        const db = firebase.firestore();
        db.collection("users")
            .get()
            .then((querySnapshot) => {
                if(querySnapshot.docs.length === 0) {
                    alert('No user in the database! Sign up instead')
                    window.location.href = './pages/signup.html'
                }
                else if(querySnapshot.docs.length === 1){
                    querySnapshot.forEach((doc) => {
                        //check if username matches
                        if(doc.data().username == credentials.username){
                            //check if password matches
                            if(doc.data().password == credentials.password) {
                                console.log('passwords match')
                                //redirect back to the home page
                                window.sessionStorage.setItem('authState', JSON.stringify(true))
                                window.location.href = '../index.html'
                            }
                            else { //if passwordds do not match alert user and clear password field and change button back to normal
                                alert('passwords don\'t match');
                                document.getElementById('password').value = '';
                                changeButtonAppearance(document.querySelector('#submit-btn'),'off');
                            }
                        }
                        else {
                            alert('Username does not match')
                        }
                    });
                }
            });
    })

}

function getUserCredentials() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    return {
        username: username,
        password: password
    }
}

function changeButtonAppearance(button,context) {
    if(context == 'on') {
        button.textContent = 'Loading...';
        button.style.backgroundColor = '#fff';
        button.style.border = '1px solid #111';
        button.style.color = '#111';
    }
    else if(context == 'off') {
        button.textContent = 'CONTINUE';
        button.style.backgroundColor = '#0e830e';
        button.style.border = '1px solid #fff';
        button.style.color = '#fff'; 
    }

}

