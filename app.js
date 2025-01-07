if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(() => {
        console.log("Service Worker registered successfully.");
    }).catch((error) => {
        console.error("Service Worker registration failed:", error);
    });
}
// タイマー関連のコード（既存の内容を使用）
let alarmSound = document.getElementById('alarm-sound');
let isPlankTime = true;
let plankDuration = 60;
let intervalDuration = 30;
let timeLeft = plankDuration;
let completedPlanks = 0;
let timerInterval;
const timerDisplay = document.getElementById('timer-display');
const plankInput = document.getElementById('plank-time');
const intervalInput = document.getElementById('interval-time');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const resetButton = document.getElementById('reset-button');
const completedCountDisplay = document.getElementById('completed-count');
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (timeLeft <= 10) {
        timerDisplay.classList.add('red-text');
    } else {
        timerDisplay.classList.remove('red-text');
    }
}
function startTimer() {
    if (timerInterval) return;
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
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    startButton.disabled = false;
}
function resetTimer() {
    stopTimer();
    completedPlanks = 0;
    completedCountDisplay.textContent = completedPlanks;
    plankDuration = parseInt(plankInput.value) * 60;
    intervalDuration = parseInt(intervalInput.value);
    timeLeft = plankDuration;
    isPlankTime = true;
    updateTimerDisplay();
}
function switchState() {
    isPlankTime = !isPlankTime;
    timeLeft = isPlankTime ? plankDuration : intervalDuration;
    updateTimerDisplay();
    startTimer();
}
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);
