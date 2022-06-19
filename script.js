let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let playerImage = document.createElement("img");
playerImage.src = "https://media.moddb.com/images/games/1/68/67090/spaceship.1.png";

let scoreElement = document.querySelector("span");

let setting = {
    bulletSteps: 15,
    scoreToWin: 50
};

let level = {
    speed: 0.5
};

let player = {
    image: playerImage,
    width: 60,
    height: 60
};

player.x = canvas.width / 2 - player.width / 2;
player.y = canvas.height - player.height;

let dictionary = ["lorem", "ipsum", "is", "simply", "dummy", "text", "of", "the", "printing", "and", "typesetting"];
let currentWords = [];
let wordToShoot;
let bullet;
let score = 0;

function update() {
    addWords();
    moveWords();
    updateBullet();
}

function addWords() {
    while (currentWords.length < 3 && dictionary.length > 0) {
        let wordIndex = getRandomInt(dictionary.length);
        let word = {
            text: dictionary.splice(wordIndex, 1)[0],
            x: 75 + getRandomInt(canvas.width - 150),
            y: 20 + getRandomInt(50)
        };

        currentWords.push(word);
    }
}

function moveWords() {
    for (word of currentWords) {
        word.y += level.speed;
    }

    if (currentWords.some(w => w.y >= player.y)) {
        location.reload();
    }
}

function addBullet() {
    bullet = {
        speedX: (wordToShoot.x + wordToShoot.index * 15 - player.x) / setting.bulletSteps,
        speedY: (wordToShoot.y - player.y) / setting.bulletSteps,
        x: player.x,
        y: player.y,
        step: 0
    };
}

function updateBullet() {
    if (bullet) {
        if (bullet.step == setting.bulletSteps) {
            bullet = undefined;

            if (wordToShoot.index == wordToShoot.text.length - 1) {
                let wordIndex = currentWords.indexOf(wordToShoot);
                currentWords.splice(wordIndex, 1);

                score += wordToShoot.text.length;
                if (score > setting.scoreToWin) {
                    location.reload();
                }

                wordToShoot = undefined;
            }

            return;
        }

        bullet.x += bullet.speedX;
        bullet.y += bullet.speedY;
        bullet.step++;
    }
}

function draw() {
    clear();
    drawPlayer();
    drawWords();
    drawBullet();
    drawScore();
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    if (!wordToShoot) {
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    }
    else {
        let dx = player.x - wordToShoot.x;
        let dy = player.y - wordToShoot.y;

        let angle = Math.atan(dy / dx);

        coefficient = dx < 0 ? 1 : -1;

        angle = coefficient * Math.PI / 2 + angle;

        ctx.translate(player.x, player.y);
        ctx.rotate(angle);
        ctx.drawImage(player.image, -player.width / 2, -player.height / 2, player.width, player.height);
        ctx.rotate(-angle);
        ctx.translate(-player.x, -player.y);
    }
}

function drawWords() {
    ctx.font = "bold 20px Courier";

    for (word of currentWords) {
        if (word == wordToShoot) {
            let substring = word.text.substring(wordToShoot.index + 1);
            ctx.fillText(substring.padStart(wordToShoot.text.length, " ").toUpperCase(), word.x, word.y);
        }
        else {
            ctx.fillText(word.text.toUpperCase(), word.x, word.y);
        }
    }
}

function drawBullet() {
    if (bullet) {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function drawScore() {
    scoreElement.innerText = score;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

setInterval(function () {
    update();
    draw();
}, 20);

document.addEventListener("keydown", function (e) {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
        if (wordToShoot) {
            if (wordToShoot.text[wordToShoot.index + 1] == e.key) {
                wordToShoot.index++;

                addBullet();
            };
        }
        else {
            let word = currentWords.find(w => w.text[0] == e.key);

            if (word) {
                wordToShoot = word;
                wordToShoot.index = 0;

                addBullet();
            }
        }
    }
});