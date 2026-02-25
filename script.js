// Verileri Başlat
let waterData = JSON.parse(localStorage.getItem('waterLogs')) || [];
let dailyTarget = parseInt(localStorage.getItem('dailyTarget')) || 2000;

// Sayfa Geçiş Yönetimi
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    // Sayfa bazlı özel güncellemeler
    if (pageId === 'stats-page') renderStats();
    if (pageId === 'home-page') updateUI();
}

// Dinamik ML Çizgilerini Oluşturma
function updateCupLabels() {
    const labelContainer = document.getElementById('cup-labels');
    if (!labelContainer) return;
    
    labelContainer.innerHTML = '';
    const step = dailyTarget / 5;
    for (let i = 5; i >= 1; i--) { // Üstten aşağıya doğru sıralama
        const div = document.createElement('div');
        div.style.flex = "1";
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.innerText = (step * i) + "ml -";
        labelContainer.appendChild(div);
    }
}

// Su Ekleme Fonksiyonu
function addWater(amount) {
    const today = new Date().toISOString().split('T')[0];
    waterData.push({ date: today, amount: amount });
    saveData();
    updateUI();
}

function addCustomWater() {
    const input = document.getElementById('custom-ml');
    const val = parseInt(input.value);
    if (val > 0) {
        addWater(val);
        input.value = '';
    } else {
        alert("Lütfen geçerli bir miktar girin.");
    }
}

// Kayıt ve Arayüz Güncelleme
function saveData() {
    localStorage.setItem('waterLogs', JSON.stringify(waterData));
}

function updateUI() {
    const today = new Date().toISOString().split('T')[0];
    const totalToday = waterData
        .filter(log => log.date === today)
        .reduce((sum, log) => sum + log.amount, 0);

    // Elementlerin varlığını kontrol et (Hata almamak için)
    const currentMlEl = document.getElementById('current-ml');
    const targetDisplayEl = document.getElementById('target-display');
    const waterLevelEl = document.getElementById('water-level');

    if (currentMlEl) currentMlEl.innerText = totalToday;
    if (targetDisplayEl) targetDisplayEl.innerText = dailyTarget;

    if (waterLevelEl) {
        const percent = Math.min((totalToday / dailyTarget) * 100, 100);
        waterLevelEl.style.height = percent + "%";
    }
    
    updateCupLabels();
    checkBadges(totalToday);
}

// Hedef Güncelleme
function updateTarget() {
    const input = document.getElementById('target-input');
    const newTarget = parseInt(input.value);
    if (newTarget > 0) {
        dailyTarget = newTarget;
        localStorage.setItem('dailyTarget', dailyTarget);
        updateUI();
        alert("Hedefiniz " + dailyTarget + " ml olarak güncellendi.");
    }
}

// Rozet Kontrolü
function checkBadges(totalToday) {
    const badgeList = document.getElementById('badge-list');
    if (!badgeList) return;
    
    if (totalToday >= dailyTarget) {
        badgeList.innerHTML = `
            <div class="badge-item" style="background:rgba(255,215,0,0.2); padding:15px; border-radius:15px; border:1px solid gold; text-align:center;">
                🥇 <strong>Günlük Hedef Ustası</strong><br>
                Bugünkü hedefine ulaştın!
            </div>`;
    } else {
        badgeList.innerHTML = "Henüz rozet kazanılmadı. İçmeye devam et! 💧";
    }
}

// İstatistikleri Render Etme
function renderStats() {
    const display = document.getElementById('stats-display');
    if (!display) return;

    const total = waterData.reduce((sum, log) => sum + log.amount, 0);
    const today = new Date().toISOString().split('T')[0];
    const todayTotal = waterData
        .filter(log => log.date === today)
        .reduce((sum, log) => sum + log.amount, 0);

    display.innerHTML = `
        <div style="background: var(--glass); padding: 15px; border-radius: 15px; margin-bottom: 10px;">
            <p>Bugün Toplam: <strong>${todayTotal} ml</strong></p>
            <p>Genel Toplam: <strong>${total} ml</strong></p>
            <p>Toplam Kayıt: <strong>${waterData.length}</strong></p>
        </div>
    `;
}

// Tema ve Sıfırlama Dinleyicileri
document.getElementById('theme-toggle').onclick = () => document.body.classList.toggle('dark-mode');

document.getElementById('reset-btn').onclick = () => {
    if (confirm("Tüm geçmiş verileriniz silinecek. Emin misiniz?")) {
        waterData = [];
        saveData();
        updateUI();
        if(document.getElementById('stats-page').classList.contains('active')) renderStats();
        alert("Veriler sıfırlandı.");
    }
};

// PWA Servis İşçisi Kaydı
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log("SW hatası:", err));
}

// Uygulamayı Başlat
window.onload = () => {
    updateUI();
};
