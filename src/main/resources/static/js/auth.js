// Referencias a elementos del DOM
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Modales
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));

// Estado de autenticación
let currentUser = null;

// Observador de estado de autenticación
firebase.auth().onAuthStateChanged((user) => {
    console.log('Estado de autenticación cambiado:', user ? 'Usuario autenticado' : 'Usuario no autenticado');
    
    if (user) {
        // Usuario está autenticado
        currentUser = user;
        loginBtn.classList.add('d-none');
        registerBtn.classList.add('d-none');
        logoutBtn.classList.remove('d-none');
        
        // Obtener el token y enviarlo al backend
        user.getIdToken(true).then(token => {
            console.log('Token obtenido correctamente');
            localStorage.setItem('authToken', token);
        }).catch(error => {
            console.error('Error al obtener el token:', error);
        });
    } else {
        // Usuario no está autenticado
        currentUser = null;
        loginBtn.classList.remove('d-none');
        registerBtn.classList.remove('d-none');
        logoutBtn.classList.add('d-none');
        localStorage.removeItem('authToken');
    }
});

// Función de inicio de sesión
loginBtn.addEventListener('click', () => {
    loginModal.show();
});

// Función de registro
registerBtn.addEventListener('click', () => {
    registerModal.show();
});

// Manejar el formulario de login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('Login exitoso:', userCredential.user.email);
            loginModal.hide();
            loginForm.reset();
        })
        .catch((error) => {
            console.error('Error de autenticación:', error);
            alert('Error al iniciar sesión: ' + error.message);
        });
});

// Manejar el formulario de registro
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('Registro exitoso:', userCredential.user.email);
            registerModal.hide();
            registerForm.reset();
        })
        .catch((error) => {
            console.error('Error de registro:', error);
            alert('Error al registrarse: ' + error.message);
        });
});

// Función de cierre de sesión
logoutBtn.addEventListener('click', () => {
    console.log('Iniciando proceso de logout...');
    firebase.auth().signOut()
        .then(() => {
            console.log('Logout exitoso');
        })
        .catch(error => {
            console.error('Error al cerrar sesión:', error);
            alert('Error al cerrar sesión: ' + error.message);
        });
});

// Función para obtener el token actual
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    return currentUser !== null;
} 