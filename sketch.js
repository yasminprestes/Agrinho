let fazendeiro;
let gridSize = 40;
let cols, rows;
let sojas = [];
let tempoManual = 15;
let tempoMaquina = 15;
let tempoRestante;
let usandoMaquina = false;
let colhidas = 0;
let startTime;
let jogoFinalizado = false;

function setup() {
  createCanvas(800, 400);
  cols = floor(width / gridSize);
  rows = floor(height / gridSize);
  textAlign(CENTER, CENTER);
  textSize(40);
  fazendeiro = new Fazendeiro();

  gerarSojaGrid(20); // Sojas iniciais
  startTime = millis();
  tempoRestante = tempoManual + tempoMaquina;
}

function draw() {
  background(120, 200, 100);

  if (!jogoFinalizado) {
    let tempoAtual = floor((millis() - startTime) / 1000);
    tempoRestante = max(0, tempoManual + tempoMaquina - tempoAtual);

    // Ativa a máquina após 15 segundos
    if (tempoAtual >= tempoManual && !usandoMaquina) {
      usandoMaquina = true;
      fazendeiro.usandoMaquina = true;
      gerarSojaGrid(30); // mais soja para a máquina colher
    }

    // Mostrar sojas
    for (let s of sojas) {
      s.mostrar();
    }

    fazendeiro.mover();
    fazendeiro.mostrar();

    // Colher soja
    for (let s of sojas) {
      if (!s.colhida && fazendeiro.coletar(s)) {
        s.colhida = true;
        colhidas++;
      }
    }

    // Interface
    fill(0);
    textSize(24);
    textAlign(LEFT);
    if (!usandoMaquina) {
      text(`⏳ Tempo manual: ${tempoManual - tempoAtual}s`, 10, 30);
    } else {
      text(`🚜 Tempo com máquina: ${tempoRestante}s`, 10, 30);
    }
    text(`🌱 Sojas colhidas: ${colhidas}`, 10, 60);

    // Fim do jogo após os 30s totais
    if (tempoAtual >= tempoManual + tempoMaquina) {
      jogoFinalizado = true;
    }
  } else {
    // Mensagem final
    background(50, 150, 50);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("🌾🤝🏙️ Campo e cidade unidos pelo futuro! 🤝🌾", width / 2, height / 2 - 60);
    textSize(24);
    text(
      "A força do campo e a tecnologia da cidade\n" +
      "juntas para construir um mundo melhor.\n\n" +
      "Obrigado por jogar! 👨‍🌾🚜",
      width / 2,
      height / 2
    );
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) fazendeiro.setDir(-1, 0);
  if (keyCode === RIGHT_ARROW) fazendeiro.setDir(1, 0);
  if (keyCode === UP_ARROW) fazendeiro.setDir(0, -1);
  if (keyCode === DOWN_ARROW) fazendeiro.setDir(0, 1);
}

function keyReleased() {
  if (keyCode === LEFT_ARROW && fazendeiro.dx === -1) fazendeiro.setDir(0, 0);
  if (keyCode === RIGHT_ARROW && fazendeiro.dx === 1) fazendeiro.setDir(0, 0);
  if (keyCode === UP_ARROW && fazendeiro.dy === -1) fazendeiro.setDir(0, 0);
  if (keyCode === DOWN_ARROW && fazendeiro.dy === 1) fazendeiro.setDir(0, 0);
}

class Fazendeiro {
  constructor() {
    this.col = floor(cols / 2);
    this.row = rows - 2;
    this.dx = 0;
    this.dy = 0;
    this.usandoMaquina = false;
    this.moverCooldown = 0;
  }

  setDir(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  mover() {
    let velocidade = this.usandoMaquina ? 3 : 1;
    let tempoEntreMovimentos = 200 / velocidade;

    this.moverCooldown -= deltaTime;
    if (this.moverCooldown <= 0) {
      let novoCol = this.col + this.dx;
      let novoRow = this.row + this.dy;

      if (novoCol >= 0 && novoCol < cols) this.col = novoCol;
      if (novoRow >= 0 && novoRow < rows) this.row = novoRow;

      this.moverCooldown = tempoEntreMovimentos;
    }
  }

  mostrar() {
    let x = this.col * gridSize + gridSize / 2;
    let y = this.row * gridSize + gridSize / 2;
    textAlign(CENTER, CENTER);
    textSize(gridSize);
    text(this.usandoMaquina ? '🚜' : '👨‍🌾', x, y);
  }

  coletar(soja) {
    return this.col === soja.col && this.row === soja.row;
  }
}

class Soja {
  constructor(col, row) {
    this.col = col;
    this.row = row;
    this.colhida = false;
  }

  mostrar() {
    if (!this.colhida) {
      let x = this.col * gridSize + gridSize / 2;
      let y = this.row * gridSize + gridSize / 2;
      textSize(gridSize * 0.75);
      text('🌱', x, y);
    }
  }
}

function gerarSojaGrid(qtd) {
  sojas = [];

  let spots = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows - 1; r++) {
      spots.push({ col: c, row: r });
    }
  }

  spots = shuffle(spots);

  for (let i = 0; i < qtd && i < spots.length; i++) {
    sojas.push(new Soja(spots[i].col, spots[i].row));
  }
}
