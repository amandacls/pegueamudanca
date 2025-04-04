const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const instructions = document.getElementById("instructions");
const buttons = document.querySelectorAll("button");
const levelCounter = document.getElementById("levelCounter");

const playerImage = new Image();
playerImage.src = "girl.png"; // Caminho da imagem do jogador

let player = { x: 10, y: 30, size: 60, speed: 10 };
let solutions = [];
let currentODS = null;
let levelsCompleted = 0;
let background = new Image();

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
    2: [
        { x: 50, y: 50, size: 40, name: "Agricultura Sustentável" },
        { x: 300, y: 100, size: 40, name: "Banco de Alimentos" },
        { x: 200, y: 250, size: 40, name: "Programas de Merenda Escolar" },
        { x: 400, y: 350, size: 40, name: "Redução do Desperdício" },
        { x: 100, y: 400, size: 40, name: "Produção Orgânica" }
    ],
    3: [
        { x: 50, y: 50, size: 40, name: "Vacinação" },
        { x: 300, y: 100, size: 40, name: "Saneamento Básico" },
        { x: 200, y: 250, size: 40, name: "Atendimento Médico Acessível" },
        { x: 400, y: 350, size: 40, name: "Promoção da Saúde Mental" },
        { x: 150, y: 450, size: 40, name: "Atividade Física para Todos" }
    ],
    10: [
        { x: 50, y: 50, size: 40, name: "Inclusão Digital" },
        { x: 300, y: 100, size: 40, name: "Leis Anti-discriminação" },
        { x: 200, y: 250, size: 40, name: "Apoio a Pequenos Negócios" },
        { x: 400, y: 350, size: 40, name: "Acesso à Educação" },
        { x: 150, y: 450, size: 40, name: "Programas de Capacitação" }
    ]
};

const backgroundsByODS = {
    2: "background.png",
    3: "background.png",
    10: "background.png"
};

function loadSolutionImages(solutions, callback) {
    let loaded = 0;
    solutions.forEach(sol => {
        const img = new Image();
        img.src = solutionImages[sol.name];
        img.onload = () => {
            sol.image = img;
            loaded++;
            if (loaded === solutions.length) callback();
        };
    });
}

function startGame(ods) {
    currentODS = ods;
    solutions = JSON.parse(JSON.stringify(solutionsByODS[ods]));
    background.src = backgroundsByODS[ods];

    buttons.forEach(btn => btn.style.display = "none");
    canvas.style.display = "block";
    instructions.style.display = "block";

    player.x = 0;
    player.y = canvas.height - player.size;

    background.onload = () => {
        update(); 
    };

    loadSolutionImages(solutions, () => {
        update(); 
    });
}


function resetGame() {
    levelsCompleted++;
    levelCounter.textContent = `Níveis concluídos: ${levelsCompleted}`;
    canvas.style.display = "none";
    instructions.style.display = "none";
    buttons.forEach(btn => btn.style.display = "inline-block");
}

function drawBackground() {
    ctx.globalAlpha = 1.0;
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.size, player.size);
}

function drawSolutions() {
    solutions.forEach(solution => {
        if (solution.image) {
            ctx.drawImage(solution.image, solution.x, solution.y, solution.size, solution.size);
        }
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
        update(); // Garante que o fundo e os outros itens sejam redesenhados corretamente
        ctx.drawImage(solution.image, solution.x, solution.y, size, size);
        size += 5;
        if (size > 60) clearInterval(interval);
    }, 50);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawSolutions();
    drawPlayer();
    checkCollision();
}

window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" && player.x + player.size < canvas.width) player.x += player.speed;
    if (event.key === "ArrowLeft" && player.x > 0) player.x -= player.speed;
    if (event.key === "ArrowUp" && player.y > 0) player.y -= player.speed;
    if (event.key === "ArrowDown" && player.y + player.size < canvas.height) player.y += player.speed;
    update();
});
