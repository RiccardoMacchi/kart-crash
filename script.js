// Recupero elementi in pagina
// Recupero griglia ostacoli
const grid = document.querySelector('.grid');
// Recupero bottoni
const btnLeft = document.querySelector('.left-button');
const btnRigth = document.querySelector('.right-button');
// Recupero counter punti
const scoreCounter = document.querySelector('.score-counter');
// Recupero schermata fine gioco
const endGame = document.querySelector('.end-game-screen');
// Recupero punteggio finale
const finalScore = document.querySelector('.final-score');
// Recupero pulsante gioca ancora
const playAgain = document.querySelector('.play-again')
// Recupero bonus coin
const bonusCoin = document.getElementById('bonus_coin')
// Recupero bottone turbo
const turboBtn = document.querySelector('.turbo')

// Griglia di gioco
const gridMatrix = [
    ['', '', '', '', '', 'grass', ''],
    ['', 'cones', '', '', '', '', 'fence'],
    ['', '', 'rock', '', '', '', ''],
    ['fence', '', '', '', '', '', ''],
    ['', '', 'grass', '', '', 'water', ''],
    ['', '', '', '', 'cones', '', ''],
    ['', 'water', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', 'rock', ''],
];

console.table(gridMatrix);

// Impostazioni inizali del kart
let ptnToBonus = 0;
let activeBonus = false;
let turbo = 0;
let score = 0;
let speed = 1000;
const kartPosition = {
    y: 7,
    x: 3,
}

function renderGrid() {
    // Pulizia della griglia per il movimento
    grid.innerHTML = '';
    // Recupero di ogni cella nella riga
    gridMatrix.forEach(function (singleCells) {
        singleCells.forEach(function (contentCells) {
            // Creazione div 
            const cell = document.createElement('div');
            // Classe div
            cell.className = 'cell'
            // Controllo per aggiunta elementi visivi
            if (contentCells) cell.classList.add(contentCells);

            grid.appendChild(cell)
        })
    })
}

// Funzioni di render
function renderElements() {
    placeKart();

    renderGrid();
}


// Funzioni kart

// Posizione kart
function placeKart() {
    // Recupero del valore della cella in cui andrà il kart
    const contenteBeforeKart = gridMatrix[kartPosition.y][kartPosition.x]

    // Controllo se c'è qualcosa collisione se c'è moneta punti bonus
    if (contenteBeforeKart === 'coin') {
        getBonus()
    } else if (contenteBeforeKart) {
        gameOver()
    }
    // Posiziono il kart se non è gameover
    gridMatrix[kartPosition.y][kartPosition.x] = 'kart';
}

// Muovi il kart
function moveKart(direction) {

    // rimozione precedente del kart

    gridMatrix[kartPosition.y][kartPosition.x] = '';

    // Condizioni di movimento
    switch (direction) {
        case 'left':
            if (kartPosition.x > 0) kartPosition.x--;
            break;
        case 'right':
            if (kartPosition.x < 6) kartPosition.x++;
            break;
        default:
            gridMatrix[kartPosition.y][kartPosition.x] = 'kart';
    }

    // Render elemenenti kart e grid

    renderElements();
}

// Funzione per movimento ostacoli
function scrollOsbtacles() {
    // Rimozione temporane kart
    gridMatrix[kartPosition.y][kartPosition.x] = '';

    // Se ci sono monete
    let coinInGame = coinInGrid()

    // Recupero ultima riga
    let lastRow = gridMatrix.pop();


    if (ptnToBonus === 5) {
        lastRow = moreBonus(lastRow)
        activeBonus = true;
        setTimeout(function () {
            activeBonus = false;
        }, 5000)
    }

    if (ptnToBonus >= 10) {
        lastRow = disactiveMoreBonus(lastRow)
        setTimeout(function () {
            ptnToBonus = 0;
            activeBonus = false;
            bonusCoin.innerHTML = '';
        }, 8000)
    }


    // Aggiunta della moneta alla ristampa con controllo se è la sola nel grid
    if (!coinInGame) lastRow = insertCoin(lastRow);

    // Mescolazione random della lista ostacoli
    shuffleElements(lastRow);

    // Riportarla in cima
    gridMatrix.unshift(lastRow)

    // Renderizziamo tutto kart e griglia
    renderElements()
}

// Funzione mescolata random
function shuffleElements(row) {
    for (let i = row.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [row[i], row[j]] = [row[j], row[i]];
    }

    return row;
}

// Funzioni per punti e volcita
// Incremento punti
function incrementScore() {
    scoreCounter.innerHTML = ++score;
}

// Incremento velocità
function incrementSpeed() {
    if (speed > 100) {
        // Blocco del flusso
        clearInterval(gameLoop)
        // Aumento velocita dimnuendo il tempo dell'interval
        speed -= 100;
        // riparte il flusso 
        gameLoop = setInterval(runGameFlow, speed)
    }
}

// Decremento velocità
function decrementSpeed() {
    if (speed < 1000) {
        // Blocco del flusso
        clearInterval(gameLoop)
        // Aumento velocita dimnuendo il tempo dell'interval
        speed += 100;
        // riparte il flusso 
        gameLoop = setInterval(runGameFlow, speed)
    }
}

// Scroll automatico ostacoli, punti e velocità kart
let gameLoop = setInterval(runGameFlow, speed)

// Funzione incremento velocità grazie al turbo
function turboBoost() {
    // Incremento visivo
    if (turbo < 4) {
        turboBtn.innerHTML = `<img src="images/gauge-${++turbo}.png" alt="turbo">`
        incrementSpeed()
    }
}

// Funzione decremento velocità grazie al turbo
function turboBoostDown() {
    // Incremento visivo
    if (turbo > 1) {
        turboBtn.innerHTML = `<img src="images/gauge-${--turbo}.png" alt="turbo">`
        decrementSpeed()
    }
}



// Funzione di operazioni da ripetere ciclicamente
function runGameFlow() {
    // Aumento velocità solo dopo ogni 10 punti
    if (score % 20 === 0) incrementSpeed();

    // Aumento punti
    incrementScore()

    // Scrollo degli ostacoli
    scrollOsbtacles()
}


// Evento di gioco
turboBtn.addEventListener('click', turboBoost())


btnLeft.addEventListener('click', function () {
    moveKart('left')
})

btnRigth.addEventListener('click', function () {
    moveKart('right')
})

// Reazione alle frecce della tastiera
document.addEventListener('keyup', function (e) {
    switch (e.key) {

        case 'ArrowLeft':
            moveKart('left')
            break;
        case 'ArrowRight':
            moveKart('right')
            break;
        case 'ArrowUp':
            turboBoost()
            break;
        case 'ArrowDown':
            turboBoostDown()
            break;
        default: return;

    }
})

// Gioca ancora
playAgain.addEventListener('click', function () {
    location.reload();
})

// Funzione fine partita

function gameOver() {
    clearInterval(gameLoop);

    // Stampa in pagina del punteggio finale
    finalScore.innerHTML = score;
    // Rimozione classe hidden
    endGame.classList.remove('hidden');
    // focus sul bottone di gioca ancora cliccando enter si rigioca
    playAgain.focus();

}


// Funzioni bonus
function getBonus() {
    // Aggiunta level bonus
    if (!activeBonus) {
        ++ptnToBonus;
    }
    if (ptnToBonus < 5) {
        bonusCoin.innerHTML += `<i class="fa-solid fa-coins"></i>`;
    } else {
        bonusCoin.innerHTML = 'BONUS ATTIVO'
    }
    score += 25;
    scoreCounter.innerHTML = score;
    // Aggiunta classe per efftto grafico
    scoreCounter.classList.add('bonus');
    // Rimozione classe per evenutali future monete
    setTimeout(function () {
        scoreCounter.classList.remove('bonus')
    }, 1000)
}

// Funzione bonus bonus

function moreBonus(row) {
    console.log("row")
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === '') {
            row[i] = 'coin'
        }
    }

    return row;
}

function disactiveMoreBonus(row) {
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === 'coin') {
            row[i] = '';
        }
    }
    return row;
}


// Funzione per insiere monete

function insertCoin(row) {
    // Troviamo l'indice del primo elemento vuoto nell'array
    const emptyElIndex = row.indexOf('');
    // Aggiunta coin
    row[emptyElIndex] = 'coin'
    // Ristampa della riga
    return row;
}

// Funzione per scoprire se c'è una moneta nella griglia
function coinInGrid() {
    let coinFound = false;
    // Recupero delle righe
    gridMatrix.forEach(function (singleRow) {
        if (singleRow.includes('coin')) coinFound = true;
    })
    return coinFound;
}


