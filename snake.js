function Snake() {
    var holder = document.getElementById("fieldHolder");
    var vertLayout = window.innerWidth < window.innerHeight;
    var fieldSize = vertLayout ? window.innerWidth : window.innerHeight;
    holder.style.width = window.innerWidth + 'px';
    holder.style.height = window.innerHeight + 'px';
    var canvas = document.getElementById("field");
    var ctx = canvas.getContext("2d");
    canvas.width = fieldSize;
    canvas.height = fieldSize;
    canvas.style.width = fieldSize + 'px';
    canvas.style.height = fieldSize + 'px';
    var status = document.getElementById("status");
    status.style.width = canvas.style.width;
    status.style.fontSize = Math.floor(fieldSize / 17) + 'px';
    document.getElementById("gameover").style.lineHeight = fieldSize + 'px';
    var buttons = document.getElementById("buttons");
    if (vertLayout) {
        buttons.style.top = canvas.style.height;
        buttons.style.left = '0px';
        buttons.style.width = canvas.style.width;
        buttons.style.height = (window.innerHeight - fieldSize) + 'px';
    } else {
        buttons.style.top = '0px';
        buttons.style.left = canvas.style.width;
        buttons.style.width = (window.innerWidth - fieldSize) + 'px';
        buttons.style.height = canvas.style.height;
    }
    var winW = canvas.width;
    var winH = canvas.height;
    console.log(winW + ' ' + winH + ' ' + fieldSize);
    var w = 25;
    var h = 25;
    var cellW = winW / w;
    var cellH = winH / h;
    var body = [];
    var dir = {x: -1, y: 0};
    var dirs = [{x:1,y:0},{x:0,y:-1},{x:-1,y:0},{x:0,y:1}];
    var keys = {'70': 0,'69': 1, '83': 2, '68': 3};
    var nextDir = null;
    var food = {x: 0, y: 0};
    var score = 0;
    var gameLost = false;
    var foodColor = ['#880000', '#991100', '#AA3300', '#CC5500',
        '#EE7700', '#CC9911', '#88BB22', '#55D833', '#33E844', '#11FF55'];

    function init() {
        var cx = Math.floor(w / 2);
        var cy = Math.floor(h / 2);
        for (var i = -1; i <= 1; i++) {
            var cell = {x: cx + i, y: cy, t: 's'};
            body.push(cell);
            drawCell(cell);
        }
        setInterval(makeMove, 200);
        document.addEventListener("keydown", onkey);
        buttons.addEventListener("mousedown", btnClick);
        placeFood();
        score = 0;
        showScore();
    }
    
    function drawCell(cell, face) {
        var x = Math.floor((cell.x + 0.5) * cellW);
        var y = Math.floor((cell.y + 0.5) * cellH);
        var r = Math.floor(cellW / 2 - 0.5);
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
            ctx.arc(x - r/2, y - r/2, r/7+1, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + r/2, y - r/2, r/7+1, 0, 2 * Math.PI, false);
            ctx.fill();
        }
    }
    
    function eraseCell(cell) {
        var x0 = Math.round(cell.x * cellW);
        var y0 = Math.round(cell.y * cellH);
        var x1 = Math.round((cell.x + 1) * cellW);
        var y1 = Math.round((cell.y + 1) * cellH);
        ctx.clearRect(x0, y0, x1 - x0, y1 - y0);
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
            eraseCell(food);
            if (food.c == 0) {
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
        var k = '' + e.keyCode;
        if (k in keys) {
            nextDir = dirs[keys[k]];
        }
    }
    
    function btnClick(e) {
        var x = (e.clientX - buttons.offsetHeight) / buttons.width;
        var y = (e.clientY - buttons.offsetTop) / buttons.height;
        var points = [{x:.75, y:.5}, {x:.5, y:.25}, {x:.25, y:.5}, {x:.5, y:.75}];
        var best = -1;
        var bestVal = 2;
        for (var i in points) {
            var p = points[i];
            var d = Math.hypot(p.x - x, p.y - y);
            if (d < bestVal) {
                best = i;
                bestVal = d;
            }
        }
        nextDir = dirs[best];
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
                food = {x: x, y: y, t: 'f', c: foodColor.length};
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
