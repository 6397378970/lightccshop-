// Card Data
let cards = [
    {
        type: 'visa',
        name: 'HDCF PREMIUM',
        number: '4060 6388 2281 4074',
        exp: '08/29',
        cvv: '***',
        balance: '¥2,500',
        status: 'instock'
    },
    {
        type: 'visa',
        name: 'AVIS SUBSCRIBE',
        number: '4512 7890 3456 7890',
        exp: '12/28',
        cvv: '***',
        balance: '¥1,800',
        status: 'instock'
    },
    {
        type: 'mastercard',
        name: 'GOLD ELITE',
        number: '5423 4567 8901 2345',
        exp: '06/30',
        cvv: '***',
        balance: '¥3,200',
        status: 'instock'
    },
    {
        type: 'rupay',
        name: 'SELECT PLUS',
        number: '6521 3456 7890 1234',
        exp: '03/27',
        cvv: '***',
        balance: '¥1,100',
        status: 'outstock'
    },
    {
        type: 'visa',
        name: 'SIGNATURE BLACK',
        number: '4789 0123 4567 8901',
        exp: '09/29',
        cvv: '***',
        balance: '¥4,500',
        status: 'soldout'
    }
];

let currentFilter = 'all';

// Render Cards
function renderCards(filter = 'all') {
    const grid = document.getElementById('cardsGrid');
    const filtered = filter === 'all' ? cards : cards.filter(c => c.type === filter);
    
    if (filtered.length === 0) {
        grid.innerHTML = `<p style="color: #66aaff; text-align: center; grid-column: 1/-1; padding: 40px;">No cards available</p>`;
        return;
    }
    
    grid.innerHTML = filtered.map(card => `
        <div class="card-item">
            <div class="card-type">${card.type.toUpperCase()}</div>
            <div class="card-number">${card.number}</div>
            <div class="card-details">
                <span>EXP: ${card.exp}</span>
                <span>CVV: ${card.cvv}</span>
            </div>
            <div class="card-balance">BAL: ${card.balance}</div>
            <div class="card-status status-${card.status}">${card.status.toUpperCase()}</div>
        </div>
    `).join('');
}

// Filter Cards
function filterCards(type) {
    currentFilter = type;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderCards(type);
}

// Toggle Login
function toggleLogin() {
    document.getElementById('loginModal').style.display = 'flex';
}

// Close Modal
function closeModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === 'chaudhary456light' && password === 'lightspeedy') {
        alert('✅ Welcome Admin! Redirecting to Admin Panel...');
        closeModal();
        window.location.href = 'admin.html';
    } else {
        alert('❌ Invalid Credentials!');
    }
}

// Telegram Join
function joinTelegram() {
    window.open('https://t.me/vouches_light', '_blank');
}

// Contact Support
function contactSupport() {
    window.open('https://t.me/light_speedy', '_blank');
}

// Dynamic Stats Update
let terminalCount = 6489;
let trafficCount = 6384532;

function updateStats() {
    const change = Math.floor(Math.random() * 300) + 100;
    terminalCount += Math.random() > 0.5 ? change : -change;
    if (terminalCount < 100) terminalCount = 100;
    if (terminalCount > 400) terminalCount = 400;
    
    trafficCount += Math.floor(Math.random() * 2) + 3;
    
    document.getElementById('terminalUsers').textContent = terminalCount;
    document.getElementById('networkTraffic').textContent = trafficCount.toLocaleString();
}

// Initialize
renderCards();
setInterval(updateStats, 2000);

// Close modal on outside click
window.onclick = function(e) {
    if (e.target === document.getElementById('loginModal')) {
        closeModal();
    }
};
