// Service Workerの登録
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log('Service Worker registered successfully'))
        .catch(err => console.error('Service Worker registration failed:', err));
}

// 既存のコード（タイマー機能）はそのまま
let alarmSound = document.getElementById('alarm-sound');

// タイマー関連
let isPlankTime = true;
let plankDuration = 60; // 初期設定：1分
let intervalDuration = 30; // 初期設定：30秒
let timeLeft = plankDuration;
let completedPlanks = 0;
let timerInterval;

// DOM取得
const timerDisplay = document.getElementById('timer-display');
const plankInput = document.getElementById('plank-time');
const intervalInput = document.getElementById('interval-time');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const resetButton = document.getElementById('reset-button');
const completedCountDisplay = document.getElementById('completed-count');

// タイマー更新
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // 残り10秒で赤文字
    if (timeLeft <= 10) {
        timerDisplay.classList.add('red-text');
    } else {
        timerDisplay.classList.remove('red-text');
    }
}

// スタート
function startTimer() {
    if (timerInterval) return; // 重複防止
    startButton.disabled = true;

    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            alarmSound.play();
            if (isPlankTime) {
                completedPlanks++;
                completedCountDisplay.textContent = completedPlanks;
            }
            switchState();
        } else {
            timeLeft--;
            updateTimerDisplay();
        }
    }, 1000);
}

// ストップ
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    startButton.disabled = false;
}

// リセット
function resetTimer() {
    stopTimer();
    completedPlanks = 0;
    completedCountDisplay.textContent = completedPlanks;

    // ユーザー設定値を取得
    plankDuration = parseInt(plankInput.value) * 60;
    intervalDuration = parseInt(intervalInput.value);
    timeLeft = plankDuration;
    isPlankTime = true;
    updateTimerDisplay();
}

// 状態切り替え（プランク→インターバル or インターバル→プランク）
function switchState() {
    isPlankTime = !isPlankTime;
    timeLeft = isPlankTime ? plankDuration : intervalDuration;
    updateTimerDisplay();
    startTimer();
}

// イベントリスナー
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);

// 初期化
resetTimer();
