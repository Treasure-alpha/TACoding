fetchData();

async function fetchData() {
    try{
        const input = document.getElementById("pokemonName");
        if (!input) {
            console.warn('No #pokemonName element found.');
            return;
        }

        const pokemonName = input.value.trim().toLowerCase();
        if (!pokemonName) {
            console.warn('No Pokémon name provided.');
            return;
        }

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)

        if (!response.ok) {
            throw new Error("couldn't fetch the resource")
        }
        const data = await response.json()
        const pokemonsprite = data.sprites && data.sprites.front_default;
        const imgElement = document.getElementById("pokemonSprite");
        if (!imgElement) {
            console.warn('No #pokemonSprite element found.');
            return;
        }

        if (pokemonsprite) {
            imgElement.src = pokemonsprite;
            imgElement.style.display = "block";
        } else {
            imgElement.style.display = "none";
            console.warn('No sprite available for this Pokémon.');
        }
       
    } 
    catch (error) {
        console.error('Error fetching Pokémon data:', error)
    }
}

// --- Signup + Login demo (client-side only, localStorage) ---
document.addEventListener('DOMContentLoaded', () => {
    // --- Signup handler (null-safe) ---
    const signupForm = document.getElementById('signup-form');
    const signupError = document.getElementById('signup-error');
    const signupSuccess = document.getElementById('signup-success');

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (signupError) signupError.textContent = '';
            if (signupSuccess) signupSuccess.style.display = 'none';

            const first = (document.getElementById('signup-firstname')?.value || '').trim();
            const last = (document.getElementById('signup-lastname')?.value || '').trim();
            const email = (document.getElementById('signup-email')?.value || '').trim().toLowerCase();
            const password = (document.getElementById('signup-password')?.value || '');
            const age = (document.getElementById('signup-age')?.value || '');
            const gender = (document.getElementById('signup-gender')?.value || '');

            if (!first || !last || !email || !password) {
                if (signupError) signupError.textContent = 'Please fill out all required fields.';
                return;
            }

            if (!/^\S+@\S+\.\S+$/.test(email)) {
                if (signupError) signupError.textContent = 'Please enter a valid email address.';
                return;
            }

            if (password.length < 8) {
                if (signupError) signupError.textContent = 'Password must be at least 8 characters long.';
                return;
            }

            const users = JSON.parse(localStorage.getItem('pw_users') || '[]');
            if (users.find(u => u.email === email)) {
                if (signupError) signupError.textContent = 'An account with that email already exists.';
                return;
            }

            users.push({ first, last, email, password, age, gender });
            localStorage.setItem('pw_users', JSON.stringify(users));

            if (signupSuccess) {
                signupSuccess.textContent = `Thanks ${first}! Your account was created.`;
                signupSuccess.style.display = 'block';
            }
            signupForm.reset();
        });
    }

    // --- Login handler (null-safe) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = (document.getElementById('login-email')?.value || '').trim().toLowerCase();
            const password = (document.getElementById('login-password')?.value || '');
            const users = JSON.parse(localStorage.getItem('pw_users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                alert(`Welcome back, ${user.first || 'Trainer'}!`);
                loginForm.reset();
            } else {
                alert('Invalid email or password.');
            }
        });
    }

    // --- Tab switching: ensure initial visible form and toggle on click ---
    const tabs = document.querySelectorAll('.auth-tabs .tab');
    const forms = document.querySelectorAll('.auth-form');

    if (tabs && tabs.length) {
        // show form matching .active tab (or first tab)
        const initial = document.querySelector('.auth-tabs .tab.active') || tabs[0];
        if (initial) {
            const targetId = initial.dataset.target;
            forms.forEach(f => {
                if (f.id === targetId) f.classList.remove('hidden');
                else f.classList.add('hidden');
            });
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                tabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-pressed', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-pressed', 'true');

                const targetId = tab.dataset.target;
                forms.forEach(form => {
                    if (form.id === targetId) form.classList.remove('hidden');
                    else form.classList.add('hidden');
                });
            });
        });
    }

    // --- Pokémon search handlers ---
    const pokemonInput = document.getElementById('pokemonName');
    const searchBtn = document.getElementById('pokemon-search-btn'); // optional button id if you have one

    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            fetchData();
        });
    } else if (pokemonInput) {
        // allow Enter key on input to trigger fetch
        pokemonInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                fetchData();
            }
        });

        // if input has a value on load, fetch once
        if (pokemonInput.value && pokemonInput.value.trim()) {
            fetchData();
        }
    }
});
