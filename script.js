let waterData = JSON.parse(localStorage.getItem('waterLogs')) || [];
let dailyTarget = localStorage.getItem('dailyTarget') || 2000;

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

function addWater(amount) {
    const today = new Date().toISOString().split('T')[0];
    waterData.push({ date: today, amount: amount });
    saveData();
    updateUI();
}

function addCustomWater() {
    const val = parseInt(document.getElementById('custom-ml').value);
    if (val) addWater(val);
}

function saveData() {
    localStorage.setItem('waterLogs', JSON.stringify(waterData));
    checkBadges();
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
}

function updateTarget() {
    dailyTarget = document.getElementById('target-input').value;
    localStorage.setItem('dailyTarget', dailyTarget);
    updateUI();
}

function checkBadges() {
    const today = new Date().toISOString().split('T')[0];
    const totalToday = waterData
        .filter(log => log.date === today)
        .reduce((sum, log) => sum + log.amount, 0);

    if (totalToday >= dailyTarget) {
        document.getElementById('badge-list').innerHTML = "🏆 Günlük Hedefe Ulaşıldı!";
    }
}

document.getElementById('reset-btn').onclick = () => {
    if(confirm("Tüm veriler silinecek?")) {
        waterData = [];
        saveData();
        updateUI();
    }
};

updateUI();
