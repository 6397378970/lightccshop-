// ============= FIREBASE SETUP =============
let currentUser = null;
let purchasedCards = [];
let allCards = [];

// ============= AUTH FUNCTIONS =============

// Show Auth Modal
function showAuthModal(type) {
    document.getElementById('authModal').style.display = 'flex';
    switchAuthTab(type);
}

// Switch Auth Tabs
function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    if (tab === 'login') {
        document.querySelector('.auth-tab:first-child').classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.querySelector('.auth-tab:last-child').classList.add('active');
        document.getElementById('signupForm').classList.add('active');
    }
}

// Handle Signup
async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    
    if (password !== confirm) {
        alert('❌ Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        alert('❌ Password must be at least 6 characters!');
        return;
    }
    
    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });
        
        // Save user data to Firestore
        await firebase.firestore().collection('users').doc(userCredential.user.uid).set({
            name: name,
            email: email,
            phone: phone,
            createdAt: new Date().toISOString()
        });
        
        alert('✅ Account created successfully!');
        closeModal('authModal');
        loadUserData();
    } catch (error) {
        alert('❌ Error: ' + error.message);
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        alert('✅ Login successful!');
        closeModal('authModal');
        loadUserData();
    } catch (error) {
        alert('❌ Error: ' + error.message);
    }
}

// Google Login
async function googleLogin() {
    const provider =
