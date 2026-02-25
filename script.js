// Uygulama Ayarları ve Veri Yükleme
let dailyTarget = parseInt(localStorage.getItem('dailyTarget')) || 2000;

function getWaterData() {
    return JSON.parse(localStorage.getItem('waterLogs')) || [];
}

// Sayfa Geçiş Yönetimi
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    // Her sayfa geçişinde verileri ve arayüzü tazele
    updateUI();
    if (pageId === 'stats-page') renderStats();
}

// Su Ekleme Fonksiyonu
function addWater(amount) {
    const waterData = getWaterData();
    const today = new Date().toISOString().split('T')[0];
    
    waterData.push({ date: today, amount: amount });
    localStorage.setItem('waterLogs', JSON.stringify(waterData));
    
    // Veri eklenir eklenmez arayüzü zorla güncelle
    updateUI();
}

function addCustomWater() {
    const input = document.getElementById('custom-ml');
    const val = parseInt(input.value);
    if (val > 0) {
        addWater(val);
        input.value = '';
    }
}

// Ana Ekranı Güncelleme (Bardak ve Rakamlar)
function updateUI() {
    const waterData = getWaterData();
    const today = new Date().toISOString().split('T')[0];
    
    const totalToday = waterData
        .filter(log => log.date === today)
        .reduce((sum, log) => sum + log.amount, 0);

    // DOM Elementlerini her seferinde yeniden seç (Garanti yöntem)
    const currentMlEl = document.getElementById('current-ml');
    const targetDisplayEl = document.getElementById('target-display');
    const waterLevelEl = document.getElementById('water-level');

    if (currentMlEl) currentMlEl.innerText = totalToday;
    if (targetDisplayEl) targetDisplayEl.innerText = dailyTarget;

    if (waterLevelEl) {
        const percent = Math.min((totalToday / dailyTarget) * 100, 100);
        waterLevelEl.style.height = percent + "%";
        // Bardak rengini su seviyesine göre belirle
        waterLevelEl.style.background = "linear-gradient(to top, #00f2fe, #4facfe)";
    }
    
    updateCupLabels();
}

// Yan taraftaki ML Çizgileri
function updateCupLabels() {
    const labelContainer = document.getElementById('cup-labels');
    if (!labelContainer) return;
    
    labelContainer.innerHTML = '';
    const step = dailyTarget / 5;
    for (let i = 5; i >= 1; i--) {
        const div = document.createElement('div');
        div.style.height = "20%"; // Eşit dağılım
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.innerText = (step * i) + "ml -";
        labelContainer.appendChild(div);
    }
}

// İstatistik Sayfası
function renderStats() {
    const display = document.getElementById('stats-display');
    if (!display) return;

    const waterData = getWaterData();
    const total = waterData.reduce((sum, log) => sum + log.amount, 0);
    
    display.innerHTML = `
        <div class="stats-card-inner" style="background: var(--glass); padding: 20px; border-radius: 20px;">
            <p>Toplam İçilen: <strong>${total} ml</strong></p>
            <p>Kayıt Sayısı: <strong>${waterData.length}</strong></p>
        </div>
    `;
}

// Hedef Güncelleme
function updateTarget() {
    const input = document.getElementById('target-input');
    if (input && input.value > 0) {
        dailyTarget = parseInt(input.value);
        localStorage.setItem('dailyTarget', dailyTarget);
        updateUI();
        alert("Hedef güncellendi!");
    }
}

// Verileri Sıfırla
document.getElementById('reset-btn').onclick = () => {
    if (confirm("Tüm veriler silinsin mi?")) {
        localStorage.removeItem('waterLogs');
        updateUI();
        renderStats();
    }
};

// Tema Değiştirici
document.getElementById('theme-toggle').onclick = () => {
    document.body.classList.toggle('dark-mode');
};

// Başlangıç
window.onload = () => {
    updateUI();
};
