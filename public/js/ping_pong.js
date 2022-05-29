var canvas = document.getElementById("ping_pong_game");
var context = canvas.getContext("2d");
var breedte = 300;
var hoogte = 400;

canvas.width = breedte;
canvas.height = hoogte;

var bg = document.getElementById("ping_pong_game");
bg.width = breedte;
bg.height = hoogte;

var bContext = bg.getContext("2d");

bContext.fillStyle = "#222";
bContext.fillRect(0, 0, breedte, hoogte);

bContext.setLineDash([6, 12]);
bContext.moveTo(breedte / 2, 0);
bContext.lineTo(breedte / 2, hoogte);
bContext.strokeStyle = "#fff";
bContext.lineWidth = 4;
bContext.stroke();

function Rect(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.dx = 0;
    this.dy = 1;
}

Rect.prototype.move = function (v) {
    this.x += this.dx * v;
    this.y += this.dy * v;
}
Rect.prototype.bounce = function () {
    var dx = 0;
    if (this.y < 10 || this.y > hoogte - this.h - 10) this.dy *= -1;
    if (this.x < 10 || this.x > breedte - this.w - 10) {
        dx = this.dx;
        this.dx *= -1;
    }
    return dx;
}
Rect.prototype.border = function () {
    this.x = Math.min(Math.max(10, this.x),
        breedte - this.w - 10);
    this.y = Math.min(Math.max(10, this.y),
        hoogte - this.h - 10);
}
Rect.prototype.AABB = function (rect) {
    return this.x < rect.x + rect.w &&
        this.x + this.w > rect.x &&
        this.y < rect.y + rect.h &&
        this.y + this.h > rect.y;
}
Rect.prototype.draw = function () {
    context.fillStyle = "white";
    context.radius = '5px'
    context.fillRect(this.x, this.y,
        this.w, this.h);
}

var paddle = new Rect(10, 170, 10, 60);
var ai = new Rect(breedte - 10 - 20, 170, 10, 60);

var bal = new Rect(140, 190, 10, 10);
bal.dx = 2;


var ai_score = 0;
var paddle_score = 0;

var framerate = 1000 / 40;
var id;

function listener() {
    if (id == null) {
        id = setInterval(loop, framerate);
    } else {
        paddle.dy *= -1;
    }
}

if (navigator.userAgent.match(/(Android|webOs|iPhone|iPad|BlackBerry|Windows Phone)/i))
    document.ontouchstart = listener;
else document.onclick = listener;

function loop() {
    paddle.move(4);
    paddle.border();

    if (bal.AABB(paddle)) bal.dx = 1;
    if (bal.AABB(ai)) bal.dx = -1;
    bal.move(3);
    var ball_bounce_dx = bal.bounce();
    bal.border();

    if (ball_bounce_dx == 1) paddle_score++;
    if (ball_bounce_dx == -1) ai_score++;

    if (ai.y > bal.y + bal.h) ai.dy = -1;
    if (ai.y + ai.height < bal.y) ai.dy = 1;
    ai.move(4);
    ai.bounce();
    ai.border();

    if (paddle_score >= 10) {
        let winningMessage = document.getElementById('winning_message');
        winningMessage.classList.remove('d-none');
    } else if (ai_score >= 10) {
        let losingMessage = document.getElementById('losing_message');
        losingMessage.classList.remove('d-none');
    }

    draw();
}

function draw() {
    context.clearRect(0, 0, breedte, hoogte);
    paddle.draw();
    ai.draw();
    bal.draw();

    context.font = "bold 32px Monospace";
    context.fillStyle = "white";
    context.textBaseline = "top";
    context.textAlign = "right";
    context.fillText(paddle_score, 140, 5);
    context.textAlign = "left";
    context.fillText(ai_score, 160, 5);
}

draw();
context.globalAlpha = 0.6;
context.font = "10px Monospace";
context.textAlign = "center";
context.textBaseline = "top";
context.fillStyle = "#283618";
context.fillRect(20, hoogte * 3 / 4 - 10, 260, 60);
context.globalAlpha = 1;
context.fillStyle = "#fff";
context.fillText("Klik om te spelen", breedte / 2, hoogte * 3 / 4);
context.fillText("De 1e speler met 10 punten wint", breedte / 2, hoogte * 3 / 4 + 22);
