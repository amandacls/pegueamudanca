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
    collectedItemMessage = `
      ✅ <strong>ODS 2: Fome Zero e Agricultura Sustentável</strong><br><br>
      Você ajudou a construir um mundo sem fome! 🥦<br>
      As soluções que você coletou representam ações fundamentais como o incentivo à agricultura sustentável,
      a criação de bancos de alimentos e programas de merenda escolar.<br>
      Cada passo ajuda a garantir que ninguém durma com fome e que todos tenham acesso a alimentos nutritivos e acessíveis.
    `;
  } else if (level === 2) {
    collectedItemMessage = `
      ✅ <strong>ODS 3: Saúde e Bem-Estar</strong><br><br>
      Um mundo saudável começa com acesso! 🏥<br>
      Vacinação, saneamento básico e saúde mental foram algumas das soluções que você encontrou.<br>
      Ao apoiar essas iniciativas, você garantiu que mais pessoas tenham qualidade de vida e acesso a cuidados de saúde essenciais.
    `;
  } else if (level === 3) {
    collectedItemMessage = `
      ✅ <strong>ODS 10: Redução das Desigualdades</strong><br><br>
      Você lutou por um mundo mais justo! 🤝<br>
      Inclusão digital, capacitação e leis contra a discriminação são pilares para reduzir as desigualdades sociais e econômicas.<br>
      Cada solução representa uma oportunidade a mais para que ninguém fique para trás.
    `;
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

function gerarCertificado(nomeJogador) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  // Fundo
  ctx.fillStyle = '#7a9cff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Título
  ctx.fillStyle = '#222';
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICADO DE CONCLUSÃO', canvas.width / 2, 80);

  // Nome
  ctx.font = '26px Arial';
  ctx.fillText(nomeJogador, canvas.width / 2, 160);

  // Texto principal
  ctx.font = '20px Arial';
  ctx.fillText('Por completar todos os desafios com coragem, estratégia e consciência,', canvas.width / 2, 220);
  ctx.fillText('demonstrando profundo entendimento sobre os', canvas.width / 2, 250);
  ctx.fillText('Objetivos de Desenvolvimento Sustentável', canvas.width / 2, 280);
  ctx.fillText('e o impacto de pequenas ações para um mundo melhor.', canvas.width / 2, 310);

  // Nome do jogo
  ctx.font = '22px Arial';
  ctx.fillText('Jogo: Pegue a Mudança!', canvas.width / 2, 380);

  // Assinatura
  ctx.font = '18px Arial';
  ctx.fillText('Amanda Santana - Jogos Digitais - 2024.2', canvas.width / 2, 460);

  // Botão de download
  const link = document.createElement('a');
  link.download = 'certificado-pegue-a-mudanca.png';
  link.href = canvas.toDataURL();
  link.click();
}

function baixarCertificado() {
  const nome = document.getElementById('nome-jogador').value.trim();
  if (!nome) {
    alert("Por favor, digite seu nome para gerar o certificado!");
    return;
  }
  gerarCertificado(nome);
}
