let body = document.querySelector('body')
let players = {};
let currentPlayer;
let playBtn = document.querySelector('.btn_play')
let leaderTableBtn = document.querySelector('.leader-table-btn')
let nextBtn = document.querySelector('.btn_next');
let spawnEggInterval;
let backToMenuBtn;
let timerInterval;
let gameRunning;
let renderEgg;
let renderBomb;
let lifes = 3;
let difficultySpeed;
let difficultyRenderSpeed;
let intervalSpeed
let isPlay = false;
let musicSrcArray = ['../../assets/music/1.mp3', '../../assets/music/2.mp3', '../../assets/music/3.mp3', '../../assets/music/4.mp3', '../../assets/music/5.mp3']
let rollingEggSound = new Audio('../../assets/sounds/rolling-egg.mp3')
let rollingBombSound = new Audio('../../assets/sounds/rolling-bomb.mp3')
let brokenEgg = new Audio('../../assets/sounds/broken-egg.mp3')

document.addEventListener('click', playBackgroundMusic) 

function removeMusicEventListener() {
    document.removeEventListener('click', playBackgroundMusic)
}

function playBackgroundMusic() {
    let randomMusic = Math.floor(Math.random() * (5 - 1) + 1);
    let backgroundMusic = new Audio(musicSrcArray[randomMusic]);
    backgroundMusic.volume = 0.5;
    setTimeout(() => {
        backgroundMusic.play();
    }, 300)
    
    setTimeout(() => {
        backgroundMusic.play();
     }, 3500)
    removeMusicEventListener();
    
}

document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
        pauseGame();
    } else {
        if (lifes > 0 && isPlay) {
            resumeGame();
        }
        
    }
});

playBtn.addEventListener("click", () => {
    for (let i = 0; i < body.children.length; i++) {
        body.children[i].style.display = 'none';
    }
    openYourNameBlock();
})

leaderTableBtn.addEventListener("click", () => {
    openLeaderTable();
})

nextBtn.addEventListener("click", () => {
    saveName();
})


function restartGame(difficulty, currentPlayer) {
    lifes = 3;
    console.log(difficulty)
    startGame(difficulty, currentPlayer)
}


function startGame(difficulty, currentPlayer) {
    let scene = document.createElement('div');
    scene.classList.add('scene');

    let wolf = document.createElement('div');
    wolf.classList.add('wolf')
    wolf.classList.add('left-bottom')

    

    scene.append(wolf)
    body.prepend(scene)

    document.addEventListener('keydown', (event) => {
        let wolf = document.querySelector('.wolf')
        if (event.code === "KeyQ") {
            if (wolf.classList.length > 1) {
                wolf.classList.remove(wolf.classList[1]);
            }
            wolf.classList.add('left-top');
        } else if (event.code === "KeyA") {
            if (wolf.classList.length > 1) {
                wolf.classList.remove(wolf.classList[1]);
            }
            wolf.classList.add('left-bottom');
        } else if (event.code === "KeyE") {
            if (wolf.classList.length > 1) {
                wolf.classList.remove(wolf.classList[1]);
            }
            wolf.classList.add('right-top');
        } else if (event.code === "KeyD") {
            if (wolf.classList.length > 1) {
                wolf.classList.remove(wolf.classList[1]);
            }
            wolf.classList.add('right-bottom');
        }
    });

    let bestScore = document.createElement('p')
    bestScore.classList.add('best-score')
    bestScore.textContent = `BEST: ${players[currentPlayer] || 'no score'}`
    scene.append(bestScore)

    startTimer(difficulty);

    if (difficulty === 'easy') {
        difficultySpeed = 3000;
        difficultyRenderSpeed = 24;
    } else if (difficulty === 'medium') {
        difficultySpeed = 2000;
        difficultyRenderSpeed = 15;
    } else if (difficulty === 'hard') {
        difficultySpeed = 1300;
        difficultyRenderSpeed = 9;
    }

    
    spawnEgg(difficulty)
    spawnEggInterval = setInterval(() => {
        if (lifes > 0) {
            let random;
            if (!(difficulty === 'hard')) {
                random = 1
            } else {
                random =  Math.floor(Math.random() * (3 - 1) + 1)
            }
            
            if (random === 1) {
                spawnEgg(difficulty)
            } else if (random === 2) {
                spawnBomb()
            }
            
            
        } else {
            openGameOver(difficulty, currentPlayer);
        }
    }, difficultySpeed)
    

}

function resumeGame() {
    startTimer();
    spawnEgg(difficulty);
}

function pauseGame() {
    clearTimeout(gameRunning);
    clearInterval(timerInterval);
    clearInterval(renderEgg);
}


function spawnEgg(difficulty) {
    
    isPlay = true;
    let scene = document.querySelector('.scene');
    let wolf = document.querySelector('.wolf')
    let egg;
    let x;
    let y;
    let randomChicken;
    let rotate;
    
    if (document.querySelector('.egg')) {
        egg = document.querySelector('.egg');
        if (egg.style.left) {
            x = parseInt(egg.style.left);
        } else {
            x = parseInt(egg.style.right);
        }
        y = parseInt(egg.style.top);
        rotate = parseInt(egg.style.transform.slice(7, 10));
    } else {
        egg = document.createElement('div')
        egg.classList.add('.egg')
        egg.style.position = 'absolute';
        egg.style.width = '37px';
        egg.style.height = '47px';
        egg.classList.add('egg');
        egg.style.backgroundImage = 'url(\'../../assets/images/egg.png\')';
        randomChicken = Math.floor(Math.random() * (5 - 1) + 1);
        rotate = 0;
        
        if (randomChicken === 1) {
            x = 74;
            y = 176;
            egg.style.left = `${x}px`;
            egg.style.top = `${y}px`;
            egg.dataset.expectedWolfPosition = 'left-top'
        } else if (randomChicken === 2) {
            x = 900;
            y = 179;
          //  egg.style.float = 'right';
            egg.style.left = `${x}px`;
            egg.style.top = `${y}px`;;
            egg.dataset.expectedWolfPosition = 'right-top'
        } else if (randomChicken === 3) {
            x = 71;
            y = 330;
            egg.style.left = `${x}px`;
            egg.style.top = `${y}px`;
            egg.dataset.expectedWolfPosition = 'left-bottom'
        } else if (randomChicken === 4) {
            x = 900;
            y = 325;
           // egg.style.float = 'right';
            egg.style.left = `${x}px`;
            egg.style.top = `${y}px`;
            egg.dataset.expectedWolfPosition = 'right-bottom'
        }

    
        
        
        scene.append(egg);
    }

    rollingEggSound.play()
    
    
    renderEgg = setInterval(() => {
        
        y += 0.7;
        rotate += 5;
        if (egg.dataset.expectedWolfPosition === 'right-top' || egg.dataset.expectedWolfPosition === 'right-bottom') {
            x -= 1;
            egg.style.left = `${x}px`;
        } else {
            x += 1;
            egg.style.left = `${x}px`;
        }
        egg.style.top = `${y}px`;
        egg.style.transform = `rotate(${rotate}deg`;
    
        if (x >= 187 && wolf.classList.contains(egg.dataset.expectedWolfPosition) && (egg.dataset.expectedWolfPosition === 'left-top' || egg.dataset.expectedWolfPosition === 'left-bottom')) {
            rollingEggSound.pause()
            rollingEggSound.currentTime = 0;
            egg.remove();
            clearInterval(renderEgg);
        } else if (x <= 787 && wolf.classList.contains(egg.dataset.expectedWolfPosition) && (egg.dataset.expectedWolfPosition === 'right-top' || egg.dataset.expectedWolfPosition === 'right-bottom')) {
            rollingEggSound.pause()
            rollingEggSound.currentTime = 0;
            egg.remove();
            clearInterval(renderEgg);
            
        } else if ((x >= 187 && !wolf.classList.contains(egg.dataset.expectedWolfPosition) && (x <= 787 && !wolf.classList.contains(egg.dataset.expectedWolfPosition))) ) {
            rollingEggSound.pause()
            rollingEggSound.currentTime = 0;
            egg.remove();
            spawnBrokenEgg(egg.dataset.expectedWolfPosition, difficulty);
            brokenEgg.play()
            clearInterval(renderEgg);
        }
        
    }, difficultyRenderSpeed)
}



function spawnBrokenEgg(expectedWolfPosition, difficulty) {
    let scene = document.querySelector('.scene');
    let brokenEgg = document.createElement('div');
    brokenEgg.style.position = 'absolute';
    if (expectedWolfPosition === 'right-top' || expectedWolfPosition === 'right-bottom') {
        brokenEgg.style.right = `179px`
        brokenEgg.style.top = `504px`;
    } else {
        brokenEgg.style.left = `179px`
        brokenEgg.style.top = `500px`;
    }
    
    brokenEgg.style.width = '167px'
    brokenEgg.style.height = '78px'
    brokenEgg.style.backgroundImage = 'url(\'../../assets/images/broken-egg.png\')'
    scene.append(brokenEgg)
    
    setTimeout(() => {
        brokenEgg.remove();
        lifes--;
        
        removeLife(lifes, difficulty)
        if (expectedWolfPosition === 'right-top' || expectedWolfPosition === 'right-bottom') {
            spawnRightChick(expectedWolfPosition);
        } else {
            spawnLeftChick(expectedWolfPosition)
        }
        
    }, 400)
}

function spawnLeftChick(expectedWolfPosition) {
    let sprite = {
        texture: 'url(\'../../assets/images/chick-1.png\')',
        width: '72px',
        height: '67px',
        left: '179px',
        top: '500px',
        expectedWolfPosition: expectedWolfPosition
    }

    animateChickRunning(sprite)
    sprite.texture = 'url(\'../../assets/images/chick-2.png\')';
    sprite.width = '63px';
    sprite.height = '66px';
    sprite.left = '104px';
    setTimeout(() => {
        animateChickRunning(sprite)
        sprite.texture = 'url(\'../../assets/images/chick-3.png\')';
        sprite.left = '42px';
    }, 350)
    setTimeout(() => {
        animateChickRunning(sprite)
        sprite.texture = 'url(\'../../assets/images/chick-4.png\')';
        sprite.left = '-27px';
    }, 650)
    setTimeout(() => {
        animateChickRunning(sprite)
    }, 950)
}

function spawnRightChick(expectedWolfPosition) {
    let sprite = {
        texture: 'url(\'../../assets/images/chick-1.png\')',
        width: '72px',
        height: '67px',
        left: '715px',
        top: '500px',
        transform: 'scale(-1, 1)',
        expectedWolfPosition: expectedWolfPosition
    }

    animateChickRunning(sprite)
    sprite.texture = 'url(\'../../assets/images/chick-2.png\')';
    sprite.width = '63px';
    sprite.height = '66px';
    sprite.left = '793px';
    setTimeout(() => {
        animateChickRunning(sprite)
        sprite.texture = 'url(\'../../assets/images/chick-3.png\')';
        sprite.left = '860px';
    }, 350)
    setTimeout(() => {
        animateChickRunning(sprite)
        sprite.texture = 'url(\'../../assets/images/chick-4.png\')';
        sprite.left = '930px';
    }, 650)
    setTimeout(() => {
        animateChickRunning(sprite)
    }, 950)
}

function animateChickRunning(sprite) {
    let scene = document.querySelector('.scene');
    let chick = document.createElement('div')
    
    chick.style.position = 'absolute';
    chick.style.backgroundImage = sprite.texture;
    chick.style.width = sprite.width;
    chick.style.height = sprite.height;
    chick.style.left = sprite.left;
    chick.style.top = sprite.top;
    if (sprite.expectedWolfPosition === 'right-top' || sprite.expectedWolfPosition === 'right-bottom') {
        chick.style.transform = sprite.transform;
    }

    scene.append(chick)

    setTimeout(() => {
        chick.remove()
    }, 350)
}



function spawnBomb() {

    isPlay = true;
    let scene = document.querySelector('.scene');
    let wolf = document.querySelector('.wolf')
    let bomb;
    let x;
    let y;
    let randomChicken;
    let rotate;

        bomb = document.createElement('div')
        bomb.classList.add('.bomb')
        bomb.style.position = 'absolute';
        bomb.style.width = '37px';
        bomb.style.height = '47px';
        bomb.classList.add('egg');
        bomb.style.backgroundImage = 'url(\'../../assets/images/bomb.png\')';
        bomb.style.backgroundSize = 'cover'
        randomChicken = Math.floor(Math.random() * (5 - 1) + 1);
        rotate = 0;
        
        if (randomChicken === 1) {
            x = 74;
            y = 171;
            bomb.style.left = `${x}px`;
            bomb.style.top = `${y}px`;
            bomb.dataset.expectedWolfPosition = 'left-top'
        } else if (randomChicken === 2) {
            x = 900;
            y = 174;
          //  egg.style.float = 'right';
            bomb.style.left = `${x}px`;
            bomb.style.top = `${y}px`;;
            bomb.dataset.expectedWolfPosition = 'right-top'
        } else if (randomChicken === 3) {
            x = 71;
            y = 325;
            bomb.style.left = `${x}px`;
            bomb.style.top = `${y}px`;
            bomb.dataset.expectedWolfPosition = 'left-bottom'
        } else if (randomChicken === 4) {
            x = 900;
            y = 320;
           // egg.style.float = 'right';
            bomb.style.left = `${x}px`;
            bomb.style.top = `${y}px`;
            bomb.dataset.expectedWolfPosition = 'right-bottom'
        }

    
        
        
        scene.append(bomb);
    

    rollingBombSound.play()
    
    renderBomb = setInterval(() => {
        
        y += 0.7;
        rotate += 5;
        if (bomb.dataset.expectedWolfPosition === 'right-top' || bomb.dataset.expectedWolfPosition === 'right-bottom') {
            x -= 1;
            bomb.style.left = `${x}px`;
        } else {
            x += 1;
            bomb.style.left = `${x}px`;
        }
        bomb.style.top = `${y}px`;
        bomb.style.transform = `rotate(${rotate}deg`;
        
    
        if (x >= 187 && wolf.classList.contains(bomb.dataset.expectedWolfPosition) && (bomb.dataset.expectedWolfPosition === 'left-top' || bomb.dataset.expectedWolfPosition === 'left-bottom')) {
            rollingBombSound.pause()
            rollingBombSound.currentTime = 0;
            bomb.remove();
            lifes--;
            removeLife(lifes)
            clearInterval(renderBomb);
        } else if (x <= 787 && wolf.classList.contains(bomb.dataset.expectedWolfPosition) && (bomb.dataset.expectedWolfPosition === 'right-top' || bomb.dataset.expectedWolfPosition === 'right-bottom')) {
            rollingBombSound.pause()
            rollingBombSound.currentTime = 0;
            bomb.remove();
            lifes--;
            removeLife(lifes)
            clearInterval(renderBomb);
            
        } else if ((x >= 187 && !wolf.classList.contains(bomb.dataset.expectedWolfPosition) && (x <= 787 && !wolf.classList.contains(bomb.dataset.expectedWolfPosition))) ) {
            rollingBombSound.pause()
            rollingBombSound.currentTime = 0;
            bomb.remove();
            clearInterval(renderBomb);
        }
        
    }, difficultyRenderSpeed - 4)
}



function startTimer(difficulty) {
    let scene = document.querySelector('.scene');
    let timer;
    let seconds;

    if (document.querySelector('.timer')) {
        timer = document.querySelector('.timer');
        seconds = parseInt(timer.textContent) || 0;
    } else {
        timer = document.createElement('p');
        seconds = 0;
        timer.classList.add('timer');
        scene.append(timer)
    }
    
    timerInterval = setInterval(() => {
        seconds++;
        timer.textContent = seconds;

        
    }, 1000)
}

function removeLife(lifes) {
    let scene = document.querySelector('.scene');
    let life = document.createElement('div');
    life.style.width = '90px';
    life.style.height = '79px';
    life.style.position = 'absolute';
    if (lifes === 2) {
        life.style.right = '220px';
    } else if (lifes === 1) {
        life.style.right = '305px';
    } else if (lifes === 0) {
        life.style.right = '390px';
    }
    life.style.top = '135px';
    life.style.backgroundImage = 'url(\'../../assets/images/life.png\')';
    scene.prepend(life)
    if (lifes === 0) {
        setTimeout(() => {
            openGameOver(difficulty, currentPlayer)
        }, 200)
        
    }
}

function openLeaderTable() {

    for (let i = 0; i < body.children.length; i++) {
        body.children[i].style.display = 'none'
    }
    let leaderTable = document.querySelector('.leader-table')
    leaderTable.style.display = 'flex'
    let bestPlayerScore = 0;

    let leaderTableList = document.querySelector('.leader-table-list')
    
    for (playerName in players) {
        let leaderTableItem = document.createElement('li');
        leaderTableItem.classList.add('leader-table-item')
        leaderTableItem.textContent = `${playerName}: ${players[playerName]}`
        if (players[playerName] >= bestPlayerScore) {
            leaderTableList.prepend(leaderTableItem)
            bestPlayerScore = players[playerName];
        } else {
            leaderTableList.append(leaderTableItem)
        }


    }

    
    

    backToMenuBtn = document.querySelector('.back-to-menu')
    backToMenuBtn.addEventListener("click", () => {
        let leaderTableItem = document.querySelectorAll('.leader-table-item');
        for (let i = 0; i < leaderTableItem.length; i++) {
            leaderTableItem[i].remove()
        }
        closeLeaderTable();
        
    }) 
    

}

function closeLeaderTable() {
    for (let i = 0; i < body.children.length; i++) {
        if (body.children[i].tagName === 'SCRIPT') {
            continue
        }
        body.children[i].style.display = 'block';
        
    }
    let leaderTable = document.querySelector('.leader-table');
    let yourNameBlock = document.querySelector('.your-name');
    let chooseDifficulty = document.querySelector('.choose-difficulty');
    let gameOver = document.querySelector('.game-over')
    leaderTable.style.display = 'none';
    yourNameBlock.style.display = 'none'
    chooseDifficulty.style.display = 'none'
    gameOver.style.display = 'none'
}

function getLeaderTable() {
    if (localStorage.getItem('leaderTableArray')) {
        players = JSON.parse(localStorage.getItem('leaderTableArray'));
    } 
}

function updateLeaderTable() {
    let timer = document.querySelector('.timer');
    if (players[`${currentPlayer}`] < parseInt(timer.textContent)) {
        players[`${currentPlayer}`] = parseInt(timer.textContent);
    } 
    
    localStorage.setItem('leaderTableArray', JSON.stringify(players))
}

function openYourNameBlock() {
    for (let i = 0; i < body.children.length; i++) {
        body.children[i].style.display = 'none'
    }
    let yourNameBlock = document.querySelector('.your-name')
    yourNameBlock.style.display = 'flex'
}

function saveName() {
    let name = document.getElementById('name');
    
    if (!players[`${name.value}`]) {
        players[`${name.value}`] = 0;
    }

    currentPlayer = name.value;
    chooseDifficulty(currentPlayer);

}

function chooseDifficulty(currentPlayer) {
    for (let i = 0; i < body.children.length; i++) {
        body.children[i].style.display = 'none'
    }
    let chooseDifficulty = document.querySelector('.choose-difficulty');
    chooseDifficulty.style.display = 'block'

    let easy = document.querySelector('.easy');
    let medium = document.querySelector('.medium');
    let hard = document.querySelector('.hard');

    easy.addEventListener("click", () => {
        startGame('easy', currentPlayer);
    })

    medium.addEventListener("click", () => {
        startGame('medium', currentPlayer);
    })

    hard.addEventListener("click", () => {
        startGame('hard', currentPlayer);
    })
}

function openGameOver(difficulty, currentPlayer) {
    clearInterval(timerInterval)
    updateLeaderTable()
    clearInterval(spawnEggInterval)

    for (let i = 0; i < body.children.length; i++) {
        body.children[i].style.display = 'none';
    }

    let oldScene = document.querySelector('.scene')
    oldScene.remove();

    let gameOver = document.querySelector('.game-over')
    gameOver.style.display = 'block'

    

    let startAgainBtn = document.querySelector('.start-again-btn')
    startAgainBtn.addEventListener("click", () => {
        gameOver.style.display = 'none'
        restartGame(difficulty, currentPlayer);
    })

    let homeBtn = document.querySelector('.home-btn');
    homeBtn.addEventListener("click", () => {
        location.reload()
    })
}


document.addEventListener('DOMContentLoaded', getLeaderTable)