const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const instructions = document.getElementById("instructions");
const buttons = document.querySelectorAll("button");
const levelCounter = document.getElementById("levelCounter");

const playerImage = new Image();
playerImage.src = "girl.webp"; // Substitua pelo caminho correto da imagem

let player = { x: 10, y: 30, size: 60, speed: 10 };
let solutions = [];
let currentODS = null;
let levelsCompleted = 0;
let background = new Image();

const solutionsByODS = {
    2: [
        { x: 50, y: 50, size: 20, color: "green", name: "Agricultura Sustentável" },
        { x: 300, y: 100, size: 20, color: "red", name: "Banco de Alimentos" },
        { x: 200, y: 250, size: 20, color: "orange", name: "Programas de Merenda Escolar" },
        { x: 400, y: 350, size: 20, color: "blue", name: "Redução do Desperdício" },
        { x: 100, y: 400, size: 20, color: "purple", name: "Produção Orgânica" }
    ],
    3: [
        { x: 50, y: 50, size: 20, color: "blue", name: "Vacinação" },
        { x: 300, y: 100, size: 20, color: "purple", name: "Saneamento Básico" },
        { x: 200, y: 250, size: 20, color: "pink", name: "Atendimento Médico Acessível" },
        { x: 400, y: 350, size: 20, color: "green", name: "Promoção da Saúde Mental" },
        { x: 150, y: 450, size: 20, color: "yellow", name: "Atividade Física para Todos" }
    ],
    10: [
        { x: 50, y: 50, size: 20, color: "yellow", name: "Inclusão Digital" },
        { x: 300, y: 100, size: 20, color: "brown", name: "Leis Anti-discriminação" },
        { x: 200, y: 250, size: 20, color: "gray", name: "Apoio a Pequenos Negócios" },
        { x: 400, y: 350, size: 20, color: "red", name: "Acesso à Educação" },
        { x: 150, y: 450, size: 20, color: "blue", name: "Programas de Capacitação" }
    ]
};

const backgroundsByODS = {
    2: "fundo_ods2.png",
    3: "fundo_ods3.png",
    10: "fundo_ods10.png"
};


function startGame(ods) {
    currentODS = ods;
    solutions = JSON.parse(JSON.stringify(solutionsByODS[ods]));
    background.src = backgroundsByODS[ods];

    buttons.forEach(btn => btn.style.display = "none");
    canvas.style.display = "block";
    instructions.style.display = "block";

    player.x = 0;
    player.y = canvas.height - player.size;

    update();
}

function resetGame() {
    levelsCompleted++;
    levelCounter.textContent = `Níveis concluídos: ${levelsCompleted}`;
    canvas.style.display = "none";
    instructions.style.display = "none";
    buttons.forEach(btn => btn.style.display = "inline-block");
}

function drawBackground() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.size, player.size);
}

function drawSolutions() {
    solutions.forEach(solution => {
        ctx.fillStyle = solution.color;
        ctx.beginPath();
        ctx.arc(solution.x + solution.size / 2, solution.y + solution.size / 2, solution.size / 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function checkCollision() {
    for (let i = solutions.length - 1; i >= 0; i--) {
        let solution = solutions[i];
        if (
            player.x < solution.x + solution.size &&
            player.x + player.size > solution.x &&
            player.y < solution.y + solution.size &&
            player.y + player.size > solution.y
        ) {
            solutions.splice(i, 1);
            alert(`Parabéns! Você coletou: ${solution.name}`);
            animateCollection(solution);
        }
    }
    if (solutions.length === 0) {
        setTimeout(() => {
            alert(`Parabéns! Você concluiu o nível ODS ${currentODS}.`);
            resetGame();
        }, 500);
    }
}

function animateCollection(solution) {
    let size = solution.size;
    let interval = setInterval(() => {
        ctx.clearRect(solution.x - 5, solution.y - 5, size + 10, size + 10);
        size += 5;
        ctx.fillStyle = solution.color;
        ctx.beginPath();
        ctx.arc(solution.x + solution.size / 2, solution.y + solution.size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
        if (size > 40) clearInterval(interval);
    }, 50);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPlayer();
    drawSolutions();
    checkCollision();
}

window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" && player.x + player.size < canvas.width) player.x += player.speed;
    if (event.key === "ArrowLeft" && player.x > 0) player.x -= player.speed;
    if (event.key === "ArrowUp" && player.y > 0) player.y -= player.speed;
    if (event.key === "ArrowDown" && player.y + player.size < canvas.height) player.y += player.speed;
    update();
});
