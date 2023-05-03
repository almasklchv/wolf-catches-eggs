let scene = document.querySelector('.scene')
let wolf = document.querySelector('.wolf');


document.addEventListener('keydown', (event) => {
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


function spawnEgg() {
    
    let egg = document.createElement('div')
    let randomChicken = Math.floor(Math.random() * (5 - 1) + 1);
    let x;
    let y;
    let expectedWolfPosition;
    let rotate = 0;
    
    if (randomChicken === 1) {
        x = 80;
        y = -161;
        egg.style.left = `${x}px`;
        egg.style.top = `${y}px`;
        expectedWolfPosition = 'left-top';
    } else if (randomChicken === 2) {
        x = 80;
        y = -152;
        egg.style.float = 'right';
        egg.style.right = `${x}px`;
        egg.style.top = `${y}px`;;
        expectedWolfPosition = 'right-top';
    } else if (randomChicken === 3) {
        x = 80;
        y = -4;
        egg.style.left = `${x}px`;
        egg.style.top = `${y}px`;
        expectedWolfPosition = 'left-bottom';
    } else if (randomChicken === 4) {
        x = 60;
        y = -14;
        egg.style.float = 'right';
        egg.style.right = `${x}px`;
        egg.style.top = `${y}px`;
        expectedWolfPosition = 'right-bottom';
    }

    
    egg.style.position = 'relative';
    egg.style.width = '37px';
    egg.style.height = '47px';
    egg.classList.add('egg');
    egg.style.backgroundImage = 'url(\'../../assets/images/egg.png\')';
    scene.append(egg);
    setTimeout(() => {
        spawnEgg();
    }, 3000)
    
    let renderEgg = setInterval(() => {
        x += 1;
        y += 0.7;
        rotate += 5;
        if (randomChicken === 2 || randomChicken === 4) {
            egg.style.right = `${x}px`;
        } else {
            egg.style.left = `${x}px`;
        }
        console.log(x + '  ' + (wolf.getBoundingClientRect().x - 50))
        egg.style.top = `${y}px`;
        egg.style.transform = `rotate(${rotate}deg`;
    
        if (x + 35 >= 215 && wolf.classList.contains(expectedWolfPosition)) {
            egg.remove();
            clearInterval(renderEgg);
        } else if (x + 35 >= 215) {
            egg.remove();
            spawnBrokenEgg(randomChicken);
            clearInterval(renderEgg);
        }
    }, 24);
}

function spawnBrokenEgg(chicken) {
    let brokenEgg = document.createElement('div');
    brokenEgg.style.position = 'absolute';
    if (chicken === 2 || chicken === 4) {
        brokenEgg.style.right = `179px`
        brokenEgg.style.top = `504px`;
    } else {
        brokenEgg.style.left = `179px`
        brokenEgg.style.top = `500px`;
    }
    
    brokenEgg.style.width = '167px'
    brokenEgg.style.height = '78px'
    brokenEgg.classList.add('egg')
    brokenEgg.style.backgroundImage = 'url(\'../../assets/images/broken-egg.png\')'
    scene.append(brokenEgg)
    
    setTimeout(() => {
        brokenEgg.remove();
        if (chicken === 2 || chicken === 4) {
            spawnRightChick(chicken);
        } else {
            spawnLeftChick(chicken)
        }
        
    }, 400)
}

function spawnLeftChick(chicken) {
    let sprite = {
        texture: 'url(\'../../assets/images/chick-1.png\')',
        width: '72px',
        height: '67px',
        left: '179px',
        top: '500px',
        chicken: chicken
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

function spawnRightChick(chicken) {
    let sprite = {
        texture: 'url(\'../../assets/images/chick-1.png\')',
        width: '72px',
        height: '67px',
        left: '715px',
        top: '500px',
        transform: 'scale(-1, 1)',
        chicken: chicken
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
    let chick = document.createElement('div')
    
    chick.style.position = 'absolute';
    chick.style.backgroundImage = sprite.texture;
    chick.style.width = sprite.width;
    chick.style.height = sprite.height;
    chick.style.left = sprite.left;
    chick.style.top = sprite.top;
    if (sprite.chicken === 2 || sprite.chicken === 4) {
        chick.style.transform = sprite.transform;
    }

    scene.append(chick)

    setTimeout(() => {
        chick.remove()
    }, 350)
}

function startTimer() {
    let timer = document.createElement('p');
    let seconds = 0;
    timer.classList.add('timer');
    scene.append(timer)
    setInterval(() => {
        seconds++;
        timer.textContent = seconds;
    }, 1000)
}




spawnEgg()
startTimer();