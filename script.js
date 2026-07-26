// ============= DATA =============
let currentUser = null;
let allCards = [];
let selectedCardId = null;
const ADMIN_USERNAME = 'chaudhary456light';
const ADMIN_PASSWORD = 'lightspeedy';

// ============= DEFAULT CARDS =============
const defaultCards = [
    { type: 'visa', name: 'HDCF PREMIUM', number: '4060 6388 2281 4074', exp: '08/29', cvv: '123', balance: '2500', price: 100, status: 'instock' },
    { type: 'visa', name: 'AVIS SUBSCRIBE', number: '4512 7890 3456 7890', exp: '12/28', cvv: '456', balance: '1800', price: 80, status: 'instock' },
    { type: 'mastercard', name: 'GOLD ELITE', number: '5423 4567 8901 2345', exp: '06/30', cvv: '789', balance: '3200', price: 150, status: 'instock' },
    { type: 'rupay', name: 'SELECT PLUS', number: '6521 3456 7890 1234', exp: '03/27', cvv: '321', balance: '1100', price: 50, status: 'outstock' },
    { type: 'visa', name: 'SIGNATURE BLACK', number: '4789 0123 4567 8901', exp: '09/29', cvv: '654', balance: '4500', price: 120, status: 'soldout' }
];

// ============= INIT =============
function init() {
    // Load cards from localStorage or use default
    let saved = localStorage.getItem('shopCards');
    if (saved) {
        allCards = JSON.parse(saved);
    } else {
        allCards = defaultCards;
        localStorage.setItem('shopCards', JSON.stringify(allCards));
    }
    
    // Check if user logged in
    let user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        updateUIForUser();
    }
    
    renderCards('all');
    document.getElementById('totalCards').textContent = allCards.length;
    
    // Check admin access
    if (localStorage.getItem('isAdmin') === 'true') {
        showAdminPanel();
    }
}

// ============= AUTH =============

function showAuthModal(type) {
    document.getElementById('authModal').style.display = 'flex';
    switchAuthTab(type);
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

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

function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    
    if (password !== confirm) { alert('❌ Passwords do not match!'); return; }
    if (password.length < 6) { alert('❌ Password must be at least 6 characters!'); return; }
    
    // Check if user already exists
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        alert('❌ User already exists! Please login.');
        return;
    }
    
    let newUser = { name, email, phone, password, isAdmin: false, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('✅ Account created successfully! Please login.');
    closeModal('authModal');
    switchAuthTab('login');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Check admin credentials
    if (email === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        if (currentUser) {
            localStorage.setItem('isAdmin', 'true');
            alert('✅ Admin access granted!');
            closeModal('authModal');
            showAdminPanel();
            return;
        } else {
            alert('⚠️ Please login with your account first!');
            return;
        }
    }
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        alert('❌ Invalid credentials!');
        return;
    }
    
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    alert('✅ Login successful!');
    closeModal('authModal');
    updateUIForUser();
}

function googleLogin() {
    alert('🔵 Google Login - Please use Email/Password or Signup!');
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    currentUser = null;
    alert('✅ Logged out!');
    window.location.reload();
}

function updateUIForUser() {
    document.getElementById('userBadge').style.display = 'inline-block';
    document.getElementById('userNameDisplay').textContent = currentUser.name || currentUser.email;
    document.getElementById('authBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-block';
    document.getElementById('dashboardBtn').style.display = 'inline-block';
}

// ============= CARDS =============

function renderCards(filter = 'all') {
    const grid = document.getElementById('cardsGrid');
    const filtered = filter === 'all' ? allCards : allCards.filter(c => c.type === filter);
    
    if (filtered.length === 0) {
        grid.innerHTML = `<p style="color: #66aaff; text-align:center; padding:40px;">No cards available</p>`;
        return;
    }
    
    grid.innerHTML = filtered.map((card, index) => `
        <div class="card-item">
            <div class="card-type">${card.type.toUpperCase()}</div>
            <div class="card-number">${card.number}</div>
            <div class="card-details">
                <span>EXP: ${card.exp}</span>
                <span>CVV: ${card.status === 'soldout' ? '***' : card.cvv}</span>
            </div>
            <div class="card-balance">BAL: $${card.balance}</div>
            <div class="card-price">💰 ₹${card.price}</div>
            <div class="card-status status-${card.status}">${card.status.toUpperCase()}</div>
            <button class="purchase-btn" onclick="openPurchase(${index})" ${card.status !== 'instock' ? 'disabled' : ''}>
                ${card.status === 'instock' ? '🛒 PURCHASE' : '🔒 SOLD OUT'}
            </button>
        </div>
    `).join('');
}

function filterCards(type) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderCards(type);
}

// ============= PURCHASE =============

function openPurchase(index) {
    if (!currentUser) {
        alert('⚠️ Please login first!');
        showAuthModal('login');
        return;
    }
    
    const card = allCards[index];
    if (!card || card.status !== 'instock') {
        alert('❌ Card not available!');
        return;
    }
    
    selectedCardId = index;
    document.getElementById('purchaseAmount').textContent = card.price;
    document.getElementById('purchaseCardInfo').innerHTML = `
        <p><strong>Card:</strong> ${card.type.toUpperCase()} - ${card.number}</p>
        <p><strong>Balance:</strong> $${card.balance}</p>
        <p><strong>Price:</strong> ₹${card.price}</p>
    `;
    document.getElementById('purchaseModal').style.display = 'flex';
}

function verifyPayment() {
    const transactionId = document.getElementById('transactionId').value;
    const screenshot = document.getElementById('screenshotUpload').files[0];
    
    if (!transactionId) { alert('❌ Enter UTR/Transaction ID!'); return; }
    if (!screenshot) { alert('❌ Upload payment screenshot!'); return; }
    
    alert('⏳ Verifying payment...');
    
    setTimeout(() => {
        try {
            const card = allCards[selectedCardId];
            if (!card) { alert('❌ Card not found!'); return; }
            
            // Update card status
            card.status = 'soldout';
            allCards[selectedCardId] = card;
            localStorage.setItem('shopCards', JSON.stringify(allCards));
            
            // Save to user purchases
            let purchases = JSON.parse(localStorage.getItem('purchases_' + currentUser.email) || '[]');
            purchases.push({
                cardId: selectedCardId,
                type: card.type,
                number: card.number,
                exp: card.exp,
                cvv: card.cvv,
                balance: card.balance,
                price: card.price,
                transactionId: transactionId,
                purchasedAt: new Date().toISOString()
            });
            localStorage.setItem('purchases_' + currentUser.email, JSON.stringify(purchases));
            
            alert('✅ Payment verified! Card details saved.');
            closeModal('purchaseModal');
            renderCards('all');
            document.getElementById('totalCards').textContent = allCards.length;
            alert(`🔓 Card CVV: ${card.cvv}`);
            
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    }, 2000);
}

// ============= ADMIN PANEL =============

function showAdminPanel() {
    if (document.getElementById('adminPanel')) return;
    
    const container = document.querySelector('.container');
    const adminDiv = document.createElement('div');
    adminDiv.id = 'adminPanel';
    adminDiv.style.cssText = `
        margin-top: 20px;
        padding: 20px;
        background: rgba(0, 150, 255, 0.05);
        border: 2px solid #ff6b6b;
        border-radius: 15px;
    `;
    adminDiv.innerHTML = `
        <h3 style="color: #ff6b6b;">🔐 ADMIN PANEL</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
            <input type="text" id="adminCardType" placeholder="Type (visa/mastercard/rupay)"
