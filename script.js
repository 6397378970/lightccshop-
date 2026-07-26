// ============= DATA =============
let currentUser = null;
let allCards = [];
let selectedCardIndex = null;
let isAdminMode = false;
let pendingPurchases = JSON.parse(localStorage.getItem('pendingPurchases') || '[]');

// ============= SECRET ADMIN CREDENTIALS =============
const ADMIN_USERNAME = 'chaudhary456light';
const ADMIN_PASSWORD = 'lightspeedy';

// ============= DEFAULT CARDS (CVV Hidden with ***) =============
const defaultCards = [
    {
        type: 'visa',
        name: 'HDCF PREMIUM',
        number: '4060 6388 2281 4074',
        exp: '08/29',
        cvv: '***',  // Hidden
        realCvv: '123',
        balance: '2500',
        price: 100,
        status: 'instock'
    },
    {
        type: 'visa',
        name: 'AVIS SUBSCRIBE',
        number: '4512 7890 3456 7890',
        exp: '12/28',
        cvv: '***',
        realCvv: '456',
        balance: '1800',
        price: 80,
        status: 'instock'
    },
    {
        type: 'mastercard',
        name: 'GOLD ELITE',
        number: '5423 4567 8901 2345',
        exp: '06/30',
        cvv: '***',
        realCvv: '789',
        balance: '3200',
        price: 150,
        status: 'instock'
    },
    {
        type: 'rupay',
        name: 'SELECT PLUS',
        number: '6521 3456 7890 1234',
        exp: '03/27',
        cvv: '***',
        realCvv: '321',
        balance: '1100',
        price: 50,
        status: 'outstock'
    },
    {
        type: 'visa',
        name: 'SIGNATURE BLACK',
        number: '4789 0123 4567 8901',
        exp: '09/29',
        cvv: '***',
        realCvv: '654',
        balance: '4500',
        price: 120,
        status: 'soldout'
    }
];

// ============= INIT =============
function init() {
    let saved = localStorage.getItem('shopCards');
    if (saved) {
        allCards = JSON.parse(saved);
    } else {
        allCards = JSON.parse(JSON.stringify(defaultCards));
        localStorage.setItem('shopCards', JSON.stringify(allCards));
    }
    
    let user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        updateUIForUser();
    }
    
    if (localStorage.getItem('secretAdmin') === 'true') {
        isAdminMode = true;
        showSecretAdminPanel();
        checkPendingPurchases();
    }
    
    renderCards('all');
    document.getElementById('totalCards').textContent = allCards.length;
}

// ============= AUTH FUNCTIONS =============

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
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        alert('❌ User already exists! Please login.');
        return;
    }
    
    let newUser = { name, email, phone, password, isAdmin: false, createdAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('✅ Account created successfully! Please login.');
    document.getElementById('signupForm').reset();
    closeModal('authModal');
    switchAuthTab('login');
}

function handleLogin(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('loginEmail').value;
    const passwordInput = document.getElementById('loginPassword').value;
    
    // 🔴 SECRET ADMIN LOGIN
    if (emailInput === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
        localStorage.setItem('secretAdmin', 'true');
        isAdminMode = true;
        alert('✅ Admin access granted!');
        closeModal('authModal');
        document.getElementById('loginForm').reset();
        showSecretAdminPanel();
        checkPendingPurchases();
        return;
    }
    
    // Normal user login
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(u => u.email === emailInput && u.password === passwordInput);
    
    if (!user) {
        alert('❌ Invalid credentials! Please signup first.');
        return;
    }
    
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    alert('✅ Login successful!');
    closeModal('authModal');
    document.getElementById('loginForm').reset();
    updateUIForUser();
}

function googleLogin() {
    alert('🔵 Please use Email/Password or Signup!');
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('secretAdmin');
    isAdminMode = false;
    currentUser = null;
    let panel = document.getElementById('secretAdminPanel');
    if (panel) panel.classList.remove('active');
    alert('✅ Logged out!');
    location.reload();
}

function updateUIForUser() {
    document.getElementById('userBadge').style.display = 'inline-block';
    document.getElementById('userNameDisplay').textContent = currentUser.name || currentUser.email;
    document.getElementById('authBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-block';
    document.getElementById('dashboardBtn').style.display = 'inline-block';
}

function goDashboard() {
    window.location.href = 'dashboard.html';
}

// ============= SECRET ADMIN PANEL =============

function showSecretAdminPanel() {
    let panel = document.getElementById('secretAdminPanel');
    if (!panel) {
        const container = document.querySelector('.container');
        const adminDiv = document.createElement('div');
        adminDiv.id = 'secretAdminPanel';
        adminDiv.innerHTML = `
            <h3>🔐 ADMIN TOOLS</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px;">
                <input type="text" id="adminCardType" placeholder="Type (visa/mastercard/rupay)">
                <input type="text" id="adminCardName" placeholder="Card Name">
                <input type="text" id="adminCardNumber" placeholder="Card Number">
                <input type="text" id="adminCardExp" placeholder="EXP (MM/YY)">
                <input type="text" id="adminCardCvv" placeholder="Real CVV">
                <input type="text" id="adminCardBalance" placeholder="Balance">
                <input type="number" id="adminCardPrice" placeholder="Price (₹)">
                <select id="adminCardStatus">
                    <option value="instock">IN STOCK</option>
                    <option value="outstock">OUT OF STOCK</option>
                    <option value="soldout">SOLD OUT</option>
                </select>
            </div>
            <div style="margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap;">
                <button onclick="adminAddCard()">➕ ADD CARD</button>
                <button onclick="adminRefreshCards()">🔄 REFRESH</button>
            </div>
            <div id="pendingApprovals" style="margin-top: 15px; border-top: 1px solid rgba(0,255,136,0.1); padding-top: 15px;">
                <h4 style="color: #ffaa00;">⏳ Pending Approvals</h4>
                <div id="pendingList"></div>
            </div>
            <p style="color: #8888aa; font-size: 11px; margin-top: 10px;">⚡ Admin mode active</p>
        `;
        container.appendChild(adminDiv);
        panel = adminDiv;
    }
    panel.classList.add('active');
    checkPendingPurchases();
}

// ============= CHECK PENDING PURCHASES (Admin) =============

function checkPendingPurchases() {
    if (!isAdminMode) return;
    
    const pendingList = document.getElementById('pendingList');
    if (!pendingList) return;
    
    const pending = JSON.parse(localStorage.getItem('pendingPurchases') || '[]');
    
    if (pending.length === 0) {
        pendingList.innerHTML = `<p style="color: #66aaff; font-size: 13px;">No pending approvals</p>`;
        return;
    }
    
    pendingList.innerHTML = pending.map((p, index) => `
        <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; margin-bottom: 8px; border-left: 3px solid #ffaa00;">
            <p style="color: #ffffff; font-size: 13px; margin: 0;">
                <strong>User:</strong> ${p.userEmail} | 
                <strong>Card:</strong> ${p.cardType} - ${p.cardNumber} | 
                <strong>Amount:</strong> ₹${p.amount}
            </p>
            <p style="color: #66aaff; font-size: 12px; margin: 5px 0;">📋 UTR: ${p.transactionId}</p>
            <div style="display: flex; gap: 10px; margin-top: 5px;">
                <button onclick="approvePurchase(${index})" style="padding: 4px 15px; background: #00ff88; color: #0a0e1a; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">✅ Approve</button>
                <button onclick="rejectPurchase(${index})" style="padding: 4px 15px; background: #ff6b6b; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">❌ Reject</button>
            </div>
        </div>
    `).join('');
}

// ============= APPROVE / REJECT PURCHASE (Admin) =============

function approvePurchase(index) {
    const pending = JSON.parse(localStorage.getItem('pendingPurchases') || '[]');
    const purchase = pending[index];
    if (!purchase) return;
    
    // Find the card and update status
    const cardIndex = allCards.findIndex(c => c.number === purchase.cardNumber);
    if (cardIndex !== -1) {
        allCards[cardIndex].status = 'soldout';
        localStorage.setItem('shopCards', JSON.stringify(allCards));
    }
    
    // Save to user's purchases with real CVV
    let userPurchases = JSON.parse(localStorage.getItem('purchases_' + purchase.userEmail) || '[]');
    userPurchases.push({
        type: purchase.cardType,
        number: purchase.cardNumber,
        exp: purchase.cardExp,
        cvv: purchase.realCvv,  // Real CVV revealed!
        balance: purchase.cardBalance,
        price: purchase.amount,
        transactionId: purchase.transactionId,
        purchasedAt: new Date().toISOString()
    });
    localStorage.setItem('purchases_' + purchase.userEmail, JSON.stringify(userPurchases));
    
    // Remove from pending
    pending.splice(index, 1);
    localStorage.setItem('pendingPurchases', JSON.stringify(pending));
    
    alert('✅ Purchase approved! Card details sent to user.');
    checkPendingPurchases();
    renderCards('all');
    document.getElementById('totalCards').textContent = allCards.length;
}

function rejectPurchase(index) {
    const pending = JSON.parse(localStorage.getItem('pendingPurchases') || '[]');
    pending.splice(index, 1);
    localStorage.setItem('pendingPurchases', JSON.stringify(pending));
    alert('❌ Purchase rejected.');
    checkPendingPurchases();
}

// ============= ADMIN CARD FUNCTIONS =============

function adminAddCard() {
    const type = document.getElementById('adminCardType').value;
    const name = document.getElementById('adminCardName').value;
    const number = document.getElementById('adminCardNumber').value;
    const exp = document.getElementById('adminCardExp').value;
    const cvv = document.getElementById('adminCardCvv').value;
    const balance = document.getElementById('adminCardBalance').value;
    const price = parseInt(document.getElementById('adminCardPrice').value) || 50;
    const status = document.getElementById('adminCardStatus').value;
    
    if (!type || !name || !number || !exp || !cvv || !balance) {
        alert('❌ Please fill all fields!');
        return;
    }
    
    allCards.push({ 
        type, name, number, exp, 
        cvv: '***',  // Hidden
        realCvv: cvv,  // Real CVV stored
        balance, price, status 
    });
    localStorage.setItem('shopCards', JSON.stringify(allCards));
    alert('✅ Card added successfully!');
    renderCards('all');
    document.getElementById('totalCards').textContent = allCards.length;
    
    ['adminCardType','adminCardName','adminCardNumber','adminCardExp','adminCardCvv','adminCardBalance','adminCardPrice']
        .forEach(id => document.getElementById(id).value = '');
}

function adminRefreshCards() {
    renderCards('all');
    document.getElementById('totalCards').textContent = allCards.length;
    alert('✅ Cards refreshed!');
}

// ============= CARDS =============

function renderCards(filter = 'all') {
    const grid = document.getElementById('cardsGrid');
    const filtered = filter === 'all' ? allCards : allCards.filter(c => c.type === filter);
    
    if (filtered.length === 0) {
        grid.innerHTML = `<p style="color: #66aaff; text-align:center; padding:40px;">No cards available</p>`;
        return;
    }
    
    grid.innerHTML = filtered.map((card, index) => {
        const realIndex = allCards.indexOf(card);
        return `
        <div class="card-item">
            <div class="card-type">${card.type.toUpperCase()}</div>
            <div class="card-number">${card.number}</div>
            <div class="card-details">
                <span>EXP: ${card.exp}</span>
                <span>CVV: ${card.cvv}</span>  <!-- Always shows *** unless purchased -->
            </div>
            <div class="card-balance">BAL: $${card.balance}</div>
            <div class="card-price">💰 ₹${card.price}</div>
            <div class="card-status status-${card.status}">${card.status.toUpperCase()}</div>
            <button class="purchase-btn" onclick="openPurchase(${realIndex})" ${card.status !== 'instock' ? 'disabled' : ''}>
                ${card.status === 'instock' ? '🛒 PURCHASE' : '🔒 SOLD OUT'}
            </button>
        </div>
    `}).join('');
}

function filterCards(type) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    let clickedBtn = event.target;
    clickedBtn.classList.add('active');
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
    
    selectedCardIndex = index;
    document.getElementById('purchaseAmount').textContent = card.price;
    document.getElementById('purchaseCardInfo').innerHTML = `
        <p><strong>Card:</strong> ${card.type.toUpperCase()} - ${card.number}</p>
        <p><strong>Balance:</strong> $${card.balance}</p>
        <p><strong>Price:</strong> ₹${card.price}</p>
        <p style="color: #ffaa00; font-size: 12px; margin-top: 10px;">⚠️ CVV will be revealed after admin approval</p>
    `;
    document.getElementById('purchaseModal').style.display = 'flex';
}

function verifyPayment() {
    const transactionId = document.getElementById('transactionId').value;
    const screenshot = document.getElementById('screenshotUpload').files[0];
    
    if (!transactionId) { alert('❌ Enter UTR/Transaction ID!'); return; }
    if (!screenshot) { alert('❌ Upload payment screenshot!'); return; }
    
    const card = allCards[selectedCardIndex];
    if (!card) { alert('❌ Card not found!'); return; }
    
    // Add to pending purchases (admin approval needed)
    const pending = JSON.parse(localStorage.getItem('pendingPurchases') || '[]');
    pending.push({
        userEmail: currentUser.email,
        cardType: card.type,
        cardNumber: card.number,
        cardExp: card.exp,
        realCvv: card.realCvv || '***',
        cardBalance: card.balance,
        amount: card.price,
        transactionId: transactionId,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('pendingPurchases', JSON.stringify(pending));
    
    alert('⏳ Payment submitted! Waiting for admin approval.');
    closeModal('purchaseModal');
    document.getElementById('transactionId').value = '';
    document.getElementById('screenshotUpload').value = '';
    
    // Notify admin if logged in
    if (isAdminMode) {
        checkPendingPurchases();
    }
}

// ============= DYNAMIC STATS =============

let terminalCount = 6489;
let trafficCount = 6384532;

function updateStats() {
    const change = Math.floor(Math.random() * 300) + 100;
    terminalCount += Math.random() > 0.5 ? change : -change;
    if (terminalCount < 100) terminalCount = 100;
    if (terminalCount > 400) terminalCount = 400;
    
    trafficCount += Math.floor(Math.random() * 4) + 3;
    
    document.getElementById('terminalUsers').textContent = terminalCount.toLocaleString();
    document.getElementById('networkTraffic').textContent = trafficCount.toLocaleString();
}

// ============= CLOSE MODALS =============

window.onclick = function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
};

// ============= KEYBOARD SHORTCUT =============
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        if (isAdminMode) {
            localStorage.removeItem('secretAdmin');
            isAdminMode = false;
            let panel = document.getElementById('secretAdminPanel');
            if (panel) panel.classList.remove('active');
            alert('🔒 Admin mode disabled');
        } else {
            if (currentUser) {
                localStorage.setItem('secretAdmin', 'true');
                isAdminMode = true;
                showSecretAdminPanel();
                alert('🔓 Admin mode enabled');
            } else {
                alert('⚠️ Please login first!');
            }
        }
    }
});

// ============= INIT =============
init();
setInterval(updateStats, 2000);

console.log('🚀 CYPHERPRO CC SHOP Loaded!');
console.log('📊 Cards available:', allCards.length);
console.log('🔐 Admin: chaudhary456light / lightspeedy');
console.log('💡 Shortcut: Ctrl+Shift+A to toggle admin');
