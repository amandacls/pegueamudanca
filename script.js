const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Sons
const collectSound = new Audio('sounds/collect.mp3');
const nextLevelSound = new Audio('sounds/next-level.wav');
const winSound = new Audio('sounds/win.wav');

const bg = new Image();
bg.src = 'img/background.png';

const player = new Image();
player.src = 'img/girl.png';

let currentLevel = 1;
let items = [];
let collectedItemMessage = '';
let levelCompleted = false;

let playerX = 50;
let playerY = 50;
const playerSpeed = 4;
const keys = {};

let collectedCount = 0;
const loadedImages = {};
let blinkTimer = 0;
const blinkInterval = 1000;
let gameLoopId;

const solutionImages = {
  "Agricultura Sustentável": "agricultura.png",
  "Banco de Alimentos": "banco.png",
  "Programas de Merenda Escolar": "merenda.png",
  "Redução do Desperdício": "desperdicio.png",
  "Produção Orgânica": "organico.png",
  "Vacinação": "vacinacao.png",
  "Saneamento Básico": "saneamento.png",
  "Atendimento Médico Acessível": "medico.png",
  "Promoção da Saúde Mental": "mental.png",
  "Atividade Física para Todos": "atividade.png",
  "Inclusão Digital": "inclusao.png",
  "Leis Anti-discriminação": "cyberbullying.png",
  "Apoio a Pequenos Negócios": "negocios.png",
  "Acesso à Educação": "educacao.png",
  "Programas de Capacitação": "capacitacao.png"
};

const solutionsByODS = {
  1: [
    { x: 270, y: 250, size: 40, name: "Agricultura Sustentável" },
    { x: 300, y: 100, size: 40, name: "Banco de Alimentos" },
    { x: 200, y: 250, size: 40, name: "Programas de Merenda Escolar" },
    { x: 400, y: 350, size: 40, name: "Redução do Desperdício" },
    { x: 150, y: 400, size: 40, name: "Produção Orgânica" }
  ],
  2: [
    { x: 500, y: 50, size: 40, name: "Vacinação" },
    { x: 300, y: 100, size: 40, name: "Saneamento Básico" },
    { x: 200, y: 250, size: 40, name: "Atendimento Médico Acessível" },
    { x: 400, y: 350, size: 40, name: "Promoção da Saúde Mental" },
    { x: 150, y: 190, size: 40, name: "Atividade Física para Todos" }
  ],
  3: [
    { x: 520, y: 350, size: 40, name: "Inclusão Digital" },
    { x: 300, y: 100, size: 40, name: "Leis Anti-discriminação" },
    { x: 200, y: 250, size: 40, name: "Apoio a Pequenos Negócios" },
    { x: 400, y: 350, size: 40, name: "Acesso à Educação" },
    { x: 150, y: 220, size: 40, name: "Programas de Capacitação" }
  ]
};

function loadImage(src) {
  if (!loadedImages[src]) {
    const img = new Image();
    img.src = src;
    loadedImages[src] = img;
  }
  return loadedImages[src];
}

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function update() {
  if (levelCompleted) return;

  if (keys['ArrowUp']) playerY -= playerSpeed;
  if (keys['ArrowDown']) playerY += playerSpeed;
  if (keys['ArrowLeft']) playerX -= playerSpeed;
  if (keys['ArrowRight']) playerX += playerSpeed;

  playerX = Math.max(0, Math.min(canvas.width - 50, playerX));
  playerY = Math.max(0, Math.min(canvas.height - 50, playerY));

  for (let item of items) {
    if (!item.collected &&
        item.visible &&
        Math.abs(playerX - item.x) < item.size &&
        Math.abs(playerY - item.y) < item.size) {
      item.collected = true;
      collectedCount++;
      collectSound.currentTime = 0;
      collectSound.play();
    }
  }

  if (currentLevel >= 2) {
    const now = Date.now();
    if (!blinkTimer || now - blinkTimer > blinkInterval) {
      blinkTimer = now;
      items.forEach(item => {
        if (!item.collected) {
          item.visible = !item.visible;

          if (currentLevel === 3 && item.visible) {
            item.x = Math.random() * (canvas.width - item.size);
            item.y = Math.random() * (canvas.height - item.size);
          }
        }
      });
    }
  }

  if (items.every(item => item.collected)) {
    levelCompleted = true;
    nextLevelSound.currentTime = 0;
    nextLevelSound.play();
    showMessage(collectedItemMessage);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(player, playerX, playerY, 50, 50);

  for (let item of items) {
    if (!item.collected && item.visible !== false) {
      const img = loadImage(`img/${solutionImages[item.name]}`);
      ctx.drawImage(img, item.x, item.y, item.size, item.size);
    }
  }

  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`Soluções coletadas: ${collectedCount}/${items.length}`, 10, 20);
}

function gameLoop() {
  update();
  draw();
  gameLoopId = requestAnimationFrame(gameLoop);
}

function showMessage(msg) {
  const box = document.getElementById('message-box');
  const isLastLevel = currentLevel === 3;

  box.innerHTML = `
    <p>${msg}</p>
    <div>
      ${!isLastLevel 
        ? `<button onclick="nextLevel()">Próximo Nível</button>` 
        : `<button onclick="finalizeGame()">Finalizar</button>`}
    </div>
  `;
  box.style.display = 'flex';
}

function hideMessage() {
  document.getElementById('message-box').style.display = 'none';
}

function startLevel(level) {
  playerX = 50;
  playerY = 50;
  levelCompleted = false;
  hideMessage();
  collectedCount = 0;

  const solutionList = solutionsByODS[level].map(sol => ({
    ...sol,
    collected: false,
    visible: true
  }));

  items = solutionList;

  if (level === 1) {
    collectedItemMessage = "✅ ODS 2: Alimentação saudável e sustentável para erradicar a fome!";
  } else if (level === 2) {
    collectedItemMessage = "✅ ODS 3: Saúde de qualidade é um direito de todos!";
  } else if (level === 3) {
    collectedItemMessage = "✅ ODS 10: Reduzir desigualdades é construir um mundo mais justo!";
  }
}

function startGame() {
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('end-screen').style.display = 'none';
  canvas.style.display = 'block';
  currentLevel = 1;
  startLevel(currentLevel);
  gameLoop();
}

function nextLevel() {
  currentLevel++;
  startLevel(currentLevel);
}

function finalizeGame() {
  cancelAnimationFrame(gameLoopId);
  winSound.currentTime = 0;
  winSound.play();
  document.getElementById('message-box').style.display = 'none';
  canvas.style.display = 'none';
  document.getElementById('end-screen').style.display = 'flex';
}

function restartGame() {
  document.getElementById('end-screen').style.display = 'none';
  startGame();
}

// Botões de movimento (mobile)
function move(direction) {
  if (direction === "right") playerX += playerSpeed;
  if (direction === "left") playerX -= playerSpeed;
  if (direction === "up") playerY -= playerSpeed;
  if (direction === "down") playerY += playerSpeed;
  update();
}
