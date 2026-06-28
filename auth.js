document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const fullname = document.getElementById('fullname').value.trim();
            const email = document.getElementById('regEmail').value.trim().toLowerCase();
            const pwd = document.getElementById('regPassword').value;
            const pwd2 = document.getElementById('regPasswordConfirm').value;

            if (!fullname || !email || !pwd) {
                alert('Veuillez remplir tous les champs.');
                return;
            }
            if (pwd.length < 6) {
                alert('Le mot de passe doit contenir au moins 6 caractères.');
                return;
            }
            if (pwd !== pwd2) {
                alert('Les mots de passe ne correspondent pas.');
                return;
            }

            // Stockage simple côté client pour démonstration
            const user = { fullname: fullname, email: email, password: pwd };
            localStorage.setItem('eshop_user', JSON.stringify(user));
            alert('Compte créé avec succès. Vous pouvez maintenant vous connecter.');
            window.location.href = 'login.html';
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const pwd = document.getElementById('password').value;

            const stored = JSON.parse(localStorage.getItem('eshop_user') || 'null');
            if (!stored) {
                alert('Aucun compte trouvé. Veuillez créer un compte.');
                window.location.href = 'register.html';
                return;
            }
            if (stored.email === email && stored.password === pwd) {
                alert('Connexion réussie.');
                // Pour la démo on stocke un token simple
                localStorage.setItem('eshop_logged_in', JSON.stringify({ email: stored.email, name: stored.fullname }));
                window.location.href = 'index.html';
            } else {
                alert('Identifiants invalides.');
            }
        });
    }
});
