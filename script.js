let waterData = JSON.parse(localStorage.getItem('waterLogs')) || [];
let dailyTarget = parseInt(localStorage.getItem('dailyTarget')) || 2000;

// Sayfa Geçişleri
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    if(pageId === 'stats-page') renderStats();
}

// Dinamik ML Çizgilerini Oluşturma
function updateCupLabels() {
    const labelContainer = document.getElementById('cup-labels');
    labelContainer.innerHTML = '';
    const step = dailyTarget / 5;
    for (let i = 1; i <= 5; i++) {
        const div = document.createElement('div');
        div.innerText = (step * i) + "ml -";
        labelContainer.appendChild(div);
    }
}

function addWater(amount) {
    const today = new Date().toISOString().split('T')[0];
    waterData.push({ date: today, amount: amount });
    saveData();
    updateUI();
}

function addCustomWater() {
    const input = document.getElementById('custom-ml');
    const val = parseInt(input.value);
    if (val) {
        addWater(val);
        input.value = '';
    }
}

function updateUI() {
    const today = new Date().toISOString().split('T')[0];
    const totalToday = waterData
        .filter(log => log.date === today)
        .reduce((sum, log) => sum + log.amount, 0);

    document.getElementById('current-ml').innerText = totalToday;
    document.getElementById('target-display').innerText = dailyTarget;

    const percent = Math.min((totalToday / dailyTarget) * 100, 100);
    document.getElementById('water-level').style.height = percent + "%";
    
    updateCupLabels();
    checkBadges(totalToday);
}

function updateTarget() {
    const newTarget = document.getElementById('target-input').value;
    dailyTarget = parseInt(newTarget);
    localStorage.setItem('dailyTarget', dailyTarget);
    updateUI();
    alert("Hedef güncellendi!");
}

function checkBadges(totalToday) {
    const badgeList = document.getElementById('badge-list');
    if (totalToday >= dailyTarget) {
        badgeList.innerHTML = `<div class="badge-item">🥇 Günlük Hedef Ustası</div>`;
    }
}

function renderStats() {
    const display = document.getElementById('stats-display');
    const total = waterData.reduce((sum, log) => sum + log.amount, 0);
    display.innerHTML = `
        <p>Toplam İçilen: <strong>${total} ml</strong></p>
        <p>Kayıt Sayısı: <strong>${waterData.length}</strong></p>
    `;
}

document.getElementById('theme-toggle').onclick = () => document.body.classList.toggle('dark-mode');
document.getElementById('reset-btn').onclick = () => {
    if(confirm("Tüm verileri silmek istediğine emin misin?")) {
        waterData = [];
        localStorage.removeItem('waterLogs');
        updateUI();
    }
};

// İlk açılış
updateUI();
