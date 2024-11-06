let score = 0;
let clickValue = 1; // Значение одного клика
let autoClickerCost = 50;
let doubleClickCost = 100;
let autoClickers = 0;

const coin = document.getElementById('coin');
const scoreDisplay = document.getElementById('score');
const autoClickerBtn = document.getElementById('auto-clicker-btn');
const doubleClickBtn = document.getElementById('double-click-btn');
const autoClickersCountDisplay = document.getElementById('auto-clickers-count');
const progressBar = document.getElementById('progress-bar');

const clickSound = document.getElementById('click-sound');
const purchaseSound = document.getElementById('purchase-sound');

// Функция обновления прогресс-бара
function updateProgressBar() {
    const progress = (score % 100) / 100 * 100;
    progressBar.style.width = progress + '%';
}

// Функция сохранения игры
function saveGame() {
    const gameData = {
        score: score,
        clickValue: clickValue,
        autoClickerCost: autoClickerCost,
        doubleClickCost: doubleClickCost,
        autoClickers: autoClickers
    };
    localStorage.setItem('gameData', JSON.stringify(gameData));
}

// Функция загрузки игры
function loadGame() {
    const savedGame = JSON.parse(localStorage.getItem('gameData'));
    if (savedGame) {
        score = savedGame.score;
        clickValue = savedGame.clickValue;
        autoClickerCost = savedGame.autoClickerCost;
        doubleClickCost = savedGame.doubleClickCost;
        autoClickers = savedGame.autoClickers;

        scoreDisplay.textContent = score;
        autoClickerBtn.textContent = `Купить автокликер (Цена: ${autoClickerCost})`;
        doubleClickBtn.textContent = `Удвоить клики (Цена: ${doubleClickCost})`;
        autoClickersCountDisplay.textContent = autoClickers;
        updateProgressBar();
    }
}

// Обработчик клика по монетке
coin.addEventListener('click', () => {
    score += clickValue;
    scoreDisplay.textContent = score;
    clickSound.play();
    updateProgressBar();
    saveGame();
    checkAchievements();
});

// Покупка автокликера
autoClickerBtn.addEventListener('click', () => {
    if (score >= autoClickerCost) {
        score -= autoClickerCost;
        autoClickers += 1;
        autoClickerCost = Math.floor(autoClickerCost * 1.5);
        autoClickerBtn.textContent = `Купить автокликер (Цена: ${autoClickerCost})`;
        autoClickersCountDisplay.textContent = autoClickers;
        scoreDisplay.textContent = score;
        purchaseSound.play();
        saveGame();
    } else {
        alert('Недостаточно очков!');
    }
});

// Функция автокликера
setInterval(() => {
    if (autoClickers > 0) {
        score += autoClickers;
        scoreDisplay.textContent = score;
        updateProgressBar();
        saveGame();
        checkAchievements();
    }
}, 1000);

// Покупка удвоения кликов
doubleClickBtn.addEventListener('click', () => {
    if (score >= doubleClickCost) {
        score -= doubleClickCost;
        clickValue *= 2;
        doubleClickCost = Math.floor(doubleClickCost * 2);
        doubleClickBtn.textContent = `Удвоить клики (Цена: ${doubleClickCost})`;
        scoreDisplay.textContent = score;
        purchaseSound.play();
        saveGame();
    } else {
        alert('Недостаточно очков!');
    }
});

// Достижения
const achievements = [
    { name: 'Первый клик', condition: () => score >= 1 },
    { name: '100 очков', condition: () => score >= 100 },
    { name: 'Мастер кликов', condition: () => clickValue >= 10 },
    { name: 'Автокликер', condition: () => autoClickers >= 1 },
    // Добавьте другие достижения
];

let unlockedAchievements = [];

function checkAchievements() {
    achievements.forEach(achievement => {
        if (achievement.condition() && !unlockedAchievements.includes(achievement.name)) {
            unlockedAchievements.push(achievement.name);
            alert(`Вы разблокировали достижение: ${achievement.name}!`);
            // Сохраните достижения
            localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
        }
    });
}

function loadAchievements() {
    const savedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements'));
    if (savedAchievements) {
        unlockedAchievements = savedAchievements;
    }
}

// Загрузка игры при старте
window.onload = () => {
    loadGame();
    loadAchievements();
};

