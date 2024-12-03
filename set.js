let workTime = 25*60; // 作業時間（秒）
let breakTime = 5*60; // 休憩時間（秒）
let isWorking = true; // 現在の状態（作業中か休憩中か）
let remainingTime = workTime; // 残り時間
let timerInterval = null;
let playlistWindow = null;
const timerElement = document.getElementById('timer');
const messageElement = document.getElementById('message');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resetButton = document.getElementById('resetButton');
const savebutton = document.getElementById('savebutton');
const savedate = document.getElementById('savedate');
const toggleBtn = document.getElementById('toggle-btn');
const toggleContent = document.getElementById('toggle-content');

toggleBtn.addEventListener("click",()=>{
    toggleContent.classList.toggle("hidden");

    if(toggleContent.classList.contains("hidden")){
        toggleBtn.textContent="勉強記録"; 
    }else
    {
        toggleBtn.textContent=" 閉じる";
    }
});

//ボタンをおしたらじかん変更
function setTimer(M,MM) {
    clearInterval(timerInterval);
    workMinutes  = M;
    breakMinutes = MM;
    timerInterval = null;
    workTime = workMinutes * 60;
    breakTime = breakMinutes * 60;
    remainingTime = workTime;
    isWorking = true;
    updateTimerDisplay();
    document.body.style.backgroundColor = "#f0f8ff";

}
 
// タイマーを更新する関数
function updateTimerDisplay() {
    const minutes = String(Math.floor(remainingTime / 60)).padStart(2, '0');
    const seconds = String(remainingTime % 60).padStart(2, '0');
    timerElement.textContent = `${minutes}:${seconds}`;
}

//自分の時間に設定できる
function set(){
    workMinutes = parseInt(prompt("Enter mintutes:","25"))||25;
    breakMinutes = parseInt(prompt("Enter minitutes:","5"))||5;
    timerInterval = null;
    workTime = workMinutes * 60;
    breakTime = breakMinutes * 60;
    remainingTime = workTime;
    isWorking = true;
    updateTimerDisplay();
    document.body.style.backgroundColor = "#f0f8ff";
} 

// タイマー開始
function startTimer() {
if (timerInterval) return; // 二重起動防止
    timerInterval = setInterval(() => {
    if (remainingTime > 0) {
        remainingTime--;
        updateTimerDisplay();
    } else {
            clearInterval(timerInterval);
            timerInterval = null;
            togglePhase(); // 作業・休憩の切り替え
            }
        },1000);
}

// タイマー停止
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

// タイマーリセット
function resetTimer() {
    stopTimer();
    isWorking = true;
    remainingTime = workTime;
    updateTimerDisplay();
    document.body.style.backgroundColor = "#f0f8ff";
    messageElement.textContent = "作業を始めましょう！";
}

// 作業と休憩を切り替える
function togglePhase() {
    isWorking = !isWorking;
    remainingTime = isWorking ? workTime : breakTime;

    document.body.style.backgroundColor = isWorking ? "#f0f8ff" : "#ffefd5";
    messageElement.textContent = isWorking
        ? "作業を始めましょう！"
        : "休憩してください！";

    if(!isWorking){
        openPlaylist();
        savestudy();
    }

    updateTimerDisplay();
    startTimer();
    // 次のフェーズを自動的に開始
}

function savestudy() {
    const sessionTime = workMinutes;
    const savedSessions = JSON.parse(localStorage.getItem("sessions")) || [];
    savedSessions.push(sessionTime);
    localStorage.setItem("sessions", JSON.stringify(savedSessions));
    renderSavedSessions();
    calculateTotalTime();
}

function renderSavedSessions() {
    const savedSessions = JSON.parse(localStorage.getItem("sessions")) || [];
    const savedate = document.getElementById("savedate");

    savedate.innerHTML = "";

    savedSessions.forEach((sessionTime, index) => {
        const li = document.createElement("li");
        li.textContent = `  勉強時間: ${sessionTime}分`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "削除";
        deleteButton.addEventListener("click", () => {
            const updatedSessions = JSON.parse(localStorage.getItem("sessions")) || [];
            updatedSessions.splice(index, 1);
            localStorage.setItem("sessions", JSON.stringify(updatedSessions));
            renderSavedSessions();
            calculateTotalTime();
        });
        li.appendChild(deleteButton);
        savedate.appendChild(li);
    });
}

window.addEventListener("load", () => {
    renderSavedSessions();
});

function calculateTotalTime() {
    const savedSessions = JSON.parse(localStorage.getItem("sessions")) || [];
    const totalTime = savedSessions.reduce((sum, sessionTime) => sum + sessionTime, 0); // 合計時間を計算
    document.getElementById("total-time").textContent = `total: ${totalTime}分`; // 合計時間を表示
}


window.onload =function(){
    const savedNote = localStorage.getItem('Url');
    if(savedNote){
        document.getElementById('Url').value = savedNote;
    }
}
//urlを保存
function saveUrl(){
    const noteContent = document.getElementById('Url').value;
    localStorage.setItem('Url',noteContent);
}
//playlistを開く
function openPlaylist() {
    const playlistUrl = document.getElementById('Url').value;
    if(!playlistUrl){
        return;
    }

    playlistWindow = window.open(playlistUrl,"_blank")

    setTimeout(() => {
        playlistWindow.close(); // ウィンドウを閉じる
    }, breakTime * 1000);
}


// ボタンのイベントリスナー
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);
savebutton.addEventListener('click',saveUrl);
// 初期化
updateTimerDisplay();