// VANTA background
VANTA.WAVES({
  el: "#vanta-bg",
  color: 0x003322,
  shininess: 50,
  waveHeight: 25,
  waveSpeed: 0.5,
  zoom: 1
});

particlesJS.load('particles-js', 'particles.json');

let score = parseInt(localStorage.getItem("score")) || 0;
let autoClick = parseInt(localStorage.getItem("autoClick")) || 0;
const scoreEl = document.getElementById("score");
const upgrades = document.querySelectorAll(".upgrade");
const clickButton = document.getElementById("click-button");

let clickStreak = 0;
let lastClickTime = 0;
let downShown = false;

function updateScore() {
  scoreEl.textContent = score;
  localStorage.setItem("score", score);
  localStorage.setItem("autoClick", autoClick);
}

function updateButtons() {
  upgrades.forEach(button => {
    const cost = parseInt(button.dataset.cost);
    if (score >= cost) {
      button.classList.add("affordable");
      button.classList.remove("not-affordable");
    } else {
      button.classList.add("not-affordable");
      button.classList.remove("affordable");
    }
  });
}

function spawnCoins(count) {
  for (let i = 0; i < count; i++) {
    const coin = document.createElement("img");
    coin.src = "assets/coin.png";
    coin.className = "floating-coin";
    coin.style.left = Math.random() * 100 + "vw";
    document.body.appendChild(coin);

    coin.animate([
      { top: "-50px", opacity: 1 },
      { top: "100vh", opacity: 0 }
    ], {
      duration: 2000 + Math.random() * 1000,
      easing: "ease-in"
    });

    setTimeout(() => coin.remove(), 3000);
  }
}

function showDownImage() {
  const img = document.createElement("img");
  img.src = "assets/down.png";
  img.className = "down-float";

  // Случайное смещение по ширине (не строго по центру)
  img.style.left = `${30 + Math.random() * 40}vw`;

  document.body.appendChild(img);

  setTimeout(() => {
    img.remove();
  }, 4000); // убрать после анимации
}


clickButton.addEventListener("click", () => {
  const now = Date.now();

  if (now - lastClickTime < 1000) {
    clickStreak++;
  } else {
    clickStreak = 1;
  }

  lastClickTime = now;

  if (clickStreak >= 10) {
    showDownImage();
    clickStreak = 0;
  }

  score++;
  spawnCoins(10);
  updateScore();
  updateButtons();
});

upgrades.forEach(button => {
  button.addEventListener("click", () => {
    const value = parseInt(button.dataset.value);
    const cost = parseInt(button.dataset.cost);

    if (score >= cost) {
      score -= cost;
      autoClick += value;
      updateScore();
      updateButtons();
    }
  });
});

setInterval(() => {
  score += autoClick;
  updateScore();
  updateButtons();
}, 1000);

updateButtons();
updateScore();
