fetchData();

async function fetchData() {
    try{

        const pokemonName = document.getElementById("pokemonName").value.toLowerCase();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)

        if (!response.ok) {
            throw new Error("couldn't fetch the resource")
        }
        const data = await response.json()
        const pokemonsprite = data.sprites.front_default;
        const imgElement = document.getElementById("pokemonSprite");
        imgElement.src = pokemonsprite;
        imgElement.style.display = "block";
       
    } 
    catch (error) {
        console.error('Error fetching Pokémon data:', error)
    }
}

// --- Signup + Login demo (client-side only, localStorage) ---
document.addEventListener('DOMContentLoaded', () => {
    // Tab switching for combined auth section
    const tabs = document.querySelectorAll('.auth-tabs .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // update active state on tabs
            tabs.forEach(t => {
                t.classList.toggle('active', t === tab);
                t.setAttribute('aria-pressed', t === tab ? 'true' : 'false');
            });
            // show/hide forms
            const targetId = tab.getAttribute('data-target');
            document.querySelectorAll('.auth-form').forEach(f => {
                if (f.id === targetId) f.classList.remove('hidden'); else f.classList.add('hidden');
            });
        });
    });
    const signupForm = document.getElementById('signup-form');
    const signupError = document.getElementById('signup-error');
    const signupSuccess = document.getElementById('signup-success');

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            signupError.textContent = '';
            signupSuccess.style.display = 'none';

            const first = document.getElementById('signup-firstname').value.trim();
            const last = document.getElementById('signup-lastname').value.trim();
            const email = document.getElementById('signup-email').value.trim().toLowerCase();
            const password = document.getElementById('signup-password').value;

            // basic validation
            if (!first || !last || !email || !password) {
                signupError.textContent = 'Please fill out all fields.';
                return;
            }

            if (!/^\S+@\S+\.\S+$/.test(email)) {
                signupError.textContent = 'Please enter a valid email address.';
                return;
            }

            if (password.length < 6) {
                signupError.textContent = 'Password must be at least 6 characters long.';
                return;
            }

            // check if user exists
            const users = JSON.parse(localStorage.getItem('pw_users') || '[]');
            if (users.find(u => u.email === email)) {
                signupError.textContent = 'An account with that email already exists.';
                return;
            }

            // store user (note: storing passwords in localStorage is insecure! This is a demo.)
            users.push({ first, last, email, password });
            localStorage.setItem('pw_users', JSON.stringify(users));

            signupSuccess.textContent = `Thanks ${first}! Your account was created.`;
            signupSuccess.style.display = 'block';
            signupForm.reset();
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim().toLowerCase();
            const password = document.getElementById('login-password').value;
            const users = JSON.parse(localStorage.getItem('pw_users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                alert(`Welcome back, ${user.first}!`);
                loginForm.reset();
            } else {
                alert('Invalid email or password.');
            }
        });
    }
});