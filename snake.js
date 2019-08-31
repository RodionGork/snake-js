function Snake() {
    var canvas = document.getElementsByTagName("canvas")[0];
    var ctx = canvas.getContext("2d");

    var winW = canvas.width;
    var winH = canvas.height;
    var w = 25;
    var h = 25;
    var cellW = winW / w;
    var cellH = winH / h;
    var body = [];
    var dir = {x: -1, y: 0};
    var nextDir = null;
    var food = {x: 0, y: 0};
    var score = 0;
    var gameLost = false;
    var bgrColor = '#443388';
    var foodColor = ['#880000', '#772200', '#664411', '#556622',
        '#448833', '#33AA44', '#22CC55', '#11EE66', '#00FF88', '#22FFAA'];

    function init() {
        ctx.fillStyle = bgrColor;
        ctx.fillRect(0, 0, winW, winH);
        var cx = Math.floor(w / 2);
        var cy = Math.floor(h / 2);
        for (var i = -1; i <= 1; i++) {
            var cell = {x: cx + i, y: cy, t: 's'};
            body.push(cell);
            drawCell(cell);
        }
        setInterval(makeMove, 200);
        document.addEventListener("keydown", onkey);
        placeFood();
        score = 0;
        showScore();
    }
    
    function drawCell(cell, face) {
        var x = Math.floor((cell.x + 0.5) * cellW);
        var y = Math.floor((cell.y + 0.5) * cellH);
        var r = Math.floor(cellW / 2);
        ctx.fillStyle = cell.t == 's' ? 'yellow' : foodColor[cell.c - 1];
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        if (typeof(face) != 'undefined') {
            ctx.strokeStyle = '3px solid black';
            ctx.beginPath();
            ctx.arc(x, y, r - 3, Math.PI / 4, 3 * Math.PI / 4, false);
            ctx.stroke();
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(x - r/2, y - r/2, 2, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + r/2, y - r/2, 2, 0, 2 * Math.PI, false);
            ctx.fill();
        }
    }
    
    function eraseCell(cell) {
        ctx.fillStyle = bgrColor;
        ctx.fillRect(cell.x * cellW, cell.y * cellH, cellW, cellH);
    }
    
    function makeMove() {
        if (gameLost) {
            return;
        }
        if (nextDir != null) {
            if (dir.x + nextDir.x != 0 || dir.y + nextDir.y != 0) {
                dir = nextDir;
            }
            nextDir = null;
        }
        var newX = (body[0].x + dir.x + w) % w;
        var newY = (body[0].y + dir.y + h) % h;
        var newHead = {x: newX, y: newY, t: 's'};
        if (checkCollision(newHead)) {
            gameLost = true;
            alert("Game Over!\n\nscore: " + score);
            return;
        }
        drawCell(body[0]);
        body.unshift(newHead);
        drawCell(newHead, true);
        if (newHead.x == food.x && newHead.y == food.y) {
            score += food.c * (food.c + 1) / 2;
            showScore();
            placeFood();
            return;
        }
        var tail = body.pop();
        eraseCell(tail);
        if (Math.random() < 0.3) {
            food.c -= 1;
            if (food.c == 0) {
                eraseCell(food);
                placeFood();
            } else {
                drawCell(food);
            }
        }
    }
    
    function checkCollision(next) {
        for (var i in body) {
            if (body[i].x == next.x && body[i].y == next.y) {
                return true;
            }
        }
        return false;
    }
    
    function onkey(e) {
        switch(e.keyCode) {
            case 69:
                nextDir = {x: 0, y: -1}; break;
            case 83:
                nextDir = {x: -1, y: 0}; break;
            case 70:
                nextDir = {x: 1, y: 0}; break;
            case 68:
                nextDir = {x: 0, y: 1}; break;
        }
    }
    
    function placeFood() {
        while (true) {
            var x = Math.floor(Math.random() * w);
            var y = Math.floor(Math.random() * h);
            var bad = false;
            for (var i in body) {
                if (x == body[i].x && y == body[i].y) {
                    bad = true;
                }
            }
            if (!bad) {
                food = {x: x, y: y, t: 'f', c: foodColor.length + 1};
                drawCell(food);
                break;
            }
        }
    }
    
    function showScore() {
        document.getElementById("score").innerText = '' + score;
    }
    
    init();

}

new Snake();
