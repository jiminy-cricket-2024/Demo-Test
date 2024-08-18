import Swal from 'sweetalert2'

const apiBaseUrl = 'https://asp.cloudclusters.net'
let accesses = [];
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app');
const showSignUpButton = document.getElementById('showSignUp');
const showSignInButton = document.getElementById('showSignIn');



export const showSignUp = () => {
    authContainer.classList.add('right-panel-active');
}
export function showSignIn () {
    authContainer.classList.remove('right-panel-active');
}
export function trySignUp(event) {
    event.preventDefault();

    const form = document.getElementById('signUpForm');
    const username = form.elements['username'].value;
    const password = form.elements['password'].value;

    fetch(apiBaseUrl + '/User/addUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .then(data => {
            Swal.fire({
                title: "Success",
                text: "You are registered and pending approval!",
                icon: "success"
            });
        })
        .catch(error => {
            Swal.fire({
                title: "Error",
                text: "Internal server error!",
                icon: "error"
            });
            console.error('Error:', error);
        });
}
export async function trySignIn(event) {
    event.preventDefault();

    const form = document.getElementById('signInForm');
    const username = form.elements['username'].value;
    const password = form.elements['password'].value;

    try {
        const signInResponse = await fetch(apiBaseUrl + '/User/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!signInResponse.ok) {
            throw new Error('Failed to sign in');
        }

        const signInData = await signInResponse.json();
        let token = signInData.token;
        sessionStorage.setItem('bearerToken', token);
        token = "Bearer " + token;

        const pagesResponse = await fetch(apiBaseUrl + '/User/getUsersAssignedPages', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });

        if (!pagesResponse.ok) {
            throw new Error('Failed to get assigned pages');
        }
        const pagesData = await pagesResponse.json();
        appContainer.classList.add('logged-in');
        setCookie("signcheck", "checked", 7);
        accesses = pagesData;
    } catch (error) {
        Swal.fire({
            title: "Warning",
            text: "Login credential mismatch or internal server error!",
            icon: "warning"
        });
        console.error('Error:', error);
    }
}
