/*
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                                                            !!WARNING!!
                        If you came to look in the code for hints for the puzzle, this is NOT a part of the intended solving experience!
            None of the files/assets used by the webstie were meant for that use and could spoil certain parts as their implementation wasn't obfuscated!
                                    If you came here for another reason, please don't judge my terrible code too harshly
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

console.log("js loaded");

let localData = JSON.parse(localStorage.getItem('localData'));
// 0-8 individual boxes     9 big box      10 safe
//localData.b = [true, true, true, true, true, true, true, true, true, true, false]; saveData();

let isFinal = checkFinalBox();
const boxesColorMatrix = [["red", "orange", "yellow"], ["green", "blue", "purple"], ["pink", "white", "black"]];
let boxesMatrix;
const baseMatrixes = [
    [
        ["pink", "grey", "pink"],
        ["yellow", "white", "yellow"],
        ["grey", "red", "grey"]
    ], [
        ["orange", "blue", "orange"],
        ["yellow", "black", "yellow"],
        ["blue", "yellow", "blue"]
    ], [
        ["orange", "green", "grey"],
        ["orange", "yellow", "blue"],
        ["orange", "green", "yellow"]
    ], [
        ["grey", "pink", "grey"],
        ["green", "green", "green"],
        ["grey", "green", "pink"]
    ], [
        ["grey", "red", "grey"],
        ["black", "white", "grey"],
        ["black", "blue", "grey"]
    ], [
        ["grey", "black", "grey"],
        ["orange", "grey", "orange"],
        ["purple", "green", "purple"]
    ], [
        ["grey", "orange", "grey"],
        ["pink", "blue", "pink"],
        ["grey", "orange", "grey"]
    ], [
        ["blue", "grey", "blue"],
        ["grey", "white", "grey"],
        ["blue", "grey", "blue"]
    ], [
        ["orange", "white", "purple"],
        ["grey", "black", "red"],
        ["red", "grey", "orange"]
    ]
];
const matrixes = structuredClone(baseMatrixes);

// States of corner buttons
const corners = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
];
    

const colors = ["red", "orange", "yellow", "green", "blue", "purple", "pink", "white", "black", "grey"];
const colorFuncs = [red, orange, yellow, green, blue, purple, pink, white, black, () => {}];
const realms = ["fenn", "corarica", "arch", "nuance", "mount-holly", "eraja", "verra", "mora-jai", "orinda"];
const cornersCoords = [[0,0], [0,2], [2,0], [2,2]];
const boxSize = 250;
const boxGap = 20;
let isSliding = false;

const tileClickSFX = new Audio("../audio/tile-click.mp3");
tileClickSFX.volume = 0.5;
const cornerClickWrongSFX = new Audio("../audio/corner-click-wrong.mp3");
cornerClickWrongSFX.volume = 0.5;
const cornerClickCorrectSFX = new Audio("../audio/corner-click-correct.mp3");
cornerClickCorrectSFX.volume = 0.5;
const boxSolveSFX = new Audio("../audio/box-solve.mp3");
const numbersSFXlist = [new Audio("../audio/number-click1.mp3"), new Audio("../audio/number-click2.mp3"), new Audio("../audio/number-click3.mp3")];
const safeOpenSFX = new Audio("../audio/safe-open.mp3");
const openSFXlist = [new Audio("../audio/open0.mp3"), new Audio("../audio/open1.mp3"), new Audio("../audio/open2.mp3"), new Audio("../audio/open3.mp3"), new Audio("../audio/open4.mp3"), new Audio("../audio/open5.mp3")];
openSFXlist.forEach((sfx) => {sfx.volume = 0.5;});
const pageSFXlist = [new Audio("../audio/page0.mp3"), new Audio("../audio/page1.mp3"), new Audio("../audio/page2.mp3"), new Audio("../audio/page3.mp3")];
pageSFXlist.forEach((sfx) => {sfx.volume = 0.5;});

const safeCode = "1132";
const boxesContainer = document.getElementById("boxes-container");
const prevButton = document.getElementById("prev-page-button");
const nextButton = document.getElementById("next-page-button");
let letterPage = 0;
let safeInput = "";


// Playing music once page is interacted with
let music;
let musicTimeout;
let track = localData.b[10] ? "the-baron-of-mount-holly" : localData.b[9] ? "in-the-dim" : "dark-waters";
document.addEventListener("click", () => {playMusic(track)}, {once: true});
function playMusic() {
    if (!localData.playsound) return;

    clearTimeout(musicTimeout);

    // Fading out music
    if (music) {
        const oldMusic = music;
        const fadeOutInterval = setInterval(() => {
            oldMusic.volume = Math.max(0, oldMusic.volume - 0.01);
            if (oldMusic.volume === 0) clearInterval(fadeOutInterval);
        }, 50);
    }

    // Playing new music after music finished fading out
    musicTimeout = setTimeout(function() {
        music = new Audio("../audio/" + track + ".mp3");
        music.volume = 0.2;
        music.loop = true;
        music.play();
    }, 1000);
}


if (!localData.b[9]) {
    genBoxes();
} else {
    document.getElementById("safe-container").classList.remove("hidden");
    if (localData.b[10]) {
        document.getElementById("closed-safe-container").classList.add("hidden");
        document.getElementById("open-safe-container").classList.remove("hidden");
    }
}


// Safe button clicked
document.querySelectorAll(".safe-button").forEach((button) => {
    button.addEventListener("click", () => {
        safeButtonPressed(button.getAttribute("data-text"));
    });
});


function safeButtonPressed(text) {
    // Playing sfx
    if (localData.playsound) {
        numbersSFXlist[Math.floor(Math.random() * numbersSFXlist.length)].play();
    }

    // Chaning safe input based on button press
    switch (text) {
        case "clear":
            safeInput = "";
            break;
        
        case "enter":
            if (safeInput === safeCode) {
                if (localData.playsound) safeOpenSFX.play();
                localData.b[10] = true;
                saveData();
                track = "the-baron-of-mount-holly";
                playMusic();
                document.getElementById("closed-safe-container").classList.add("hidden");
                document.getElementById("open-safe-container").classList.remove("hidden");
            }
            break;
        
        default:
            safeInput += text;
            break;
    }
}



// Riddle note open
document.getElementById("riddle-button").addEventListener("click", (event) => {
    toggleUIContainer(false, "letter");
    toggleUIContainer(true, "riddle");
    document.getElementById("riddle-button").classList.add("hidden");
});


// Final letter open
document.getElementById("final-letter-button").addEventListener("click", (event) => {
    toggleUIContainer(true, "final-letter");
    toggleUIContainer(false, "riddle");
    document.getElementById("final-letter-button").classList.add("hidden");
});


// Letter keyboard arrows page change
document.addEventListener("keydown", (event) => {
    if (document.getElementById("final-letter-container").classList.contains("hidden")) return;

    if (event.key === "ArrowRight") {
        changeLetterPage(letterPage + 1);
    } else if (event.key === "ArrowLeft") {
        changeLetterPage(letterPage - 1);
    }  
});


// Letter page advance on click
document.getElementById("final-letter").addEventListener("click", () => {
    changeLetterPage((letterPage + 1) % 4);
});


// UI close button
document.querySelectorAll(".close-button").forEach((button) => {
    button.addEventListener("click", (event) => {
        toggleUIContainer(false, "final-letter");
        toggleUIContainer(false, "riddle");
    });
});


// Escape key to close ui
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        toggleUIContainer(false, "final-letter");
        toggleUIContainer(false, "riddle");
    }
});

// Previous page button click
prevButton.addEventListener("click", (event) => {
    changeLetterPage(letterPage - 1);
});


// Next page button click
nextButton.addEventListener("click", (event) => {
    changeLetterPage(letterPage + 1);
});


// Toggling final letter or riddle note state
function toggleUIContainer(open, container) {
    // Exiting if ui state is already matched
    const containerElm = document.getElementById(`${container}-container`)
    if (!containerElm || containerElm.classList.contains("hidden") !== open) return;

    // Playing sfx
    if (localData.playsound) {
        openSFXlist[Math.floor(Math.random() * openSFXlist.length)].play();
    }

    if (open === true) {
        // Resetting letter to page 0 on open
        if (container === "final-letter") {
            changeLetterPage(0);
        }

        containerElm.classList.remove("hidden");

        if (!isGlassVisible) {
            currentX = -(36.75 * window.innerHeight / 100) - 50;
            currentY = window.innerHeight + 50; 

            targetX = window.innerWidth * 0.05;
            targetY = window.innerHeight * 0.5;

            isGlassVisible = true;
            magContainer.classList.remove("hidden");
            requestAnimationFrame(animateMagnifier);
        }
    } else {
        document.getElementById(container + "-button").classList.remove("hidden");
        containerElm.classList.add("hidden");
        magContainer.classList.add("hidden");
        isGlassVisible = false;
    }
};


// Changing page in final letter
function changeLetterPage(page) {
    // Checking if page change is valid
    const finalPage = 3;
    if (page < 0 || page > finalPage) return;

    // Playing sfx
    if (localData.playsound) {
        pageSFXlist[Math.floor(Math.random() * pageSFXlist.length)].play();
    }

    // Changing page
    letterPage = page;
    document.getElementById("final-letter").src = `../assets/final-letter${page}.png`;

    if (page === 0) {
        prevButton.classList.add("disabled");
        prevButton.classList.remove("clickable");
    } else {
        prevButton.classList.remove("disabled");
        prevButton.classList.add("clickable");
    }

    if (page === finalPage) {
        nextButton.classList.add("disabled");
        nextButton.classList.remove("clickable");
    } else {
        nextButton.classList.remove("disabled");
        nextButton.classList.add("clickable");
    }
}


// Creating mora jai boxes
function genBoxes() {
    for(let i = 0; i < matrixes.length; i++) {
        if (localData.b[i]) {
            const color = colors[i];
            matrixes[i] = [[color, color, color], [color, color, color], [color, color, color]];
            boxesContainer.innerHTML += `
                <div id="${i}" class="mora-jai-container"">
                    ${genCompletedBox(i)}
                </div>
            `;
        } else {
            boxesContainer.innerHTML += `
                <div id="${i}" class="mora-jai-container"">
                    <img class="box" src="../assets/mora-jai/box.png">
                    <div class="tiles">
                        <button class="clickable tile-button top-left" data-index="${i}00"><img id="${i}00" class="tile" src="../assets/mora-jai/top-side-tile.png"></button>
                        <button class="clickable tile-button top-middle" data-index="${i}01"><img id="${i}01" class="tile" src="../assets/mora-jai/top-middle-tile.png"></button>
                        <button class="clickable tile-button top-right" data-index="${i}02"><img id="${i}02" class="tile mirror" src="../assets/mora-jai/top-side-tile.png"></button>
                        <button class="clickable tile-button middle-left" data-index="${i}10"><img id="${i}10" class="tile" src="../assets/mora-jai/middle-side-tile.png"></button>
                        <button class="clickable tile-button middle-middle" data-index="${i}11"><img id="${i}11" class="tile" src="../assets/mora-jai/middle-middle-tile.png"></button>
                        <button class="clickable tile-button middle-right" data-index="${i}12"><img id="${i}12" class="tile mirror" src="../assets/mora-jai/middle-side-tile.png"></button>
                        <button class="clickable tile-button bottom-left" data-index="${i}20"><img id="${i}20" class="tile" src="../assets/mora-jai/bottom-side-tile.png"></button>
                        <button class="clickable tile-button bottom-middle" data-index="${i}21"><img id="${i}21" class="tile" src="../assets/mora-jai/bottom-middle-tile.png"></button>
                        <button class="clickable tile-button bottom-right" data-index="${i}22"><img id="${i}22" class="tile mirror" src="../assets/mora-jai/bottom-side-tile.png"></button>
                    </div>
                    <div class="corners">
                        <button class="clickable corner-button top-left-corner" data-index="${i}0"><img id="${i}0" class="corner"></button>
                        <button class="clickable corner-button top-right-corner" data-index="${i}1"><img id="${i}1" class="corner mirror"></button>
                        <button class="clickable corner-button bottom-left-corner" data-index="${i}2"><img id="${i}2" class="corner"></button>
                        <button class="clickable corner-button bottom-right-corner" data-index="${i}3"><img id="${i}3" class="corner mirror"></button>
                    </div>
                </div>
            `;
        }
        updateColors(i);
    };

    boxesMatrix = [
        [document.getElementById('0'), document.getElementById('1'), document.getElementById('2')],
        [document.getElementById('3'), document.getElementById('4'), document.getElementById('5')],
        [document.getElementById('6'), document.getElementById('7'), document.getElementById('8')]
    ];
    if (isFinal) addBoxListeners();
    updateBoxPositions();
}


function updateBoxPositions() {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            boxesMatrix[row][col].style = `left: ${col * (boxSize + boxGap)}px; top: ${row * (boxSize + boxGap)}px;`;
        }
    }
}


// Clicking corner
document.querySelectorAll(".corner-button").forEach((corner) => {
    if (corner.tagName !== "BUTTON") return;
    corner.addEventListener("click", () => {
        cornerPressed(corner.getAttribute("data-index"));
    });
});


// Corner button checks
function cornerPressed(index) {
    const box = parseInt(index[0]);
    const cornerIndex = parseInt(index[1]);
    const corner = cornersCoords[cornerIndex];
    const color = colors[box];

    // Turning on corner or resetting
    if (matrixes[box][corner[0]][corner[1]] === color) {
        corners[box][cornerIndex] = true;
        if (localData.playsound) {
            cornerClickCorrectSFX.currentTime = 0;
            cornerClickCorrectSFX.play();
        } 
        updateCorners(box);
    } else {
        matrixes[box] = structuredClone(baseMatrixes[box]);
        corners[box] = [false, false, false, false];
        if (localData.playsound) {
            cornerClickWrongSFX.currentTime = 0;
            cornerClickWrongSFX.play();
        }
        updateColors(box);
    }

    // Checking if all corners are on
    let allOn = true;
    for(let i = 0; i < 4; i++) {
        if (!corners[box][i]) allOn = false;
    }
    if (allOn) {
        // Saving box solved in local data
        localData.b[box] = true;
        saveData();

        // Playing sfx
        if (localData.playsound) boxSolveSFX.play();

        // Replacing box with solid color box without click listeners
        document.getElementById(box.toString()).innerHTML = genCompletedBox(box);
        matrixes[box] = [[color, color, color], [color, color, color], [color, color, color]];
        updateColors(box);

        // Activating final puzzle if this was the last box to solve
        if (checkFinalBox()) {
            isFinal = true;
            setTimeout(addBoxListeners, 10);
        }
    }
}


// Clicking tile
document.querySelectorAll(".tile-button").forEach((tile) => {
    if (tile.tagName !== "BUTTON") return;
    tile.addEventListener("click", () => {
        tilePressed(tile.getAttribute("data-index"));
    });
});


// Running color function when tile is presses
function tilePressed(index) {
    const box = parseInt(index[0]);
    const row = parseInt(index[1]);
    const col = parseInt(index[2]);
    const color = box === 9 ? boxesColorMatrix[row][col] : matrixes[box][row][col];

    if (localData.playsound) {
        if (box === 9) {
            //slide sfx
        }
        tileClickSFX.currentTime = 0;
        tileClickSFX.play();
    } 

    colorFuncs[colors.indexOf(color)](box === 9 ? boxesColorMatrix : matrixes[box], row, col, color);
    if (box === 9) {
        updateBoxPositions();
    } else {
        updateColors(box);
    }
}


// Updating box colors from matrix
function updateColors(box) {
    let i = 0;
    const matrix = matrixes[box];
    matrix.forEach((row) => {
        let j = 0;
        row.forEach((col) => {
            const tile = document.getElementById(box.toString()+i.toString()+j.toString());
            tile.className = tile.className.replace(/\bcolor-\S+/g, '').trim();
            tile.classList.add("color-" + col);
            j++;
        });
        i++;
    });
    
    // Turning off corners that were on and who's color has moved
    for(let i = 0; i < 4; i++) {
        const corner = cornersCoords[i];
        if (matrixes[box][corner[0]][corner[1]] !== colors[box]) {
            corners[box][i] = false;
        }
    }

    if (localData.b[box]) {
        updateCorners(box, true);
    } else {
        updateCorners(box);
    }
}


// Updating corners state
function updateCorners(box, state, realm) {
    for(let i = 0; i < 4; i++) {
        document.getElementById(box.toString() + i.toString()).src = `../assets/mora-jai/${realm ? realm : realms[box]}-${i < 2 ? "top" : "bottom"}-${state || corners[box][i] ? "on" : "off"}.png`;
    }
}


// Returns a completed box from matrix
function genCompletedBox(box) {
    return `
        <img class="box" src="../assets/mora-jai/box.png">
        <div class="tiles">
            <div class="tile-button top-left"><img id="${box}00" class="tile" src="../assets/mora-jai/top-side-tile.png"></div>
            <div class="tile-button top-middle"><img id="${box}01" class="tile" src="../assets/mora-jai/top-middle-tile.png"></div>
            <div class="tile-button top-right"><img id="${box}02" class="tile mirror" src="../assets/mora-jai/top-side-tile.png"></div>
            <div class="tile-button middle-left"><img id="${box}10" class="tile" src="../assets/mora-jai/middle-side-tile.png"></div>
            <div class="tile-button middle-middle"><img id="${box}11" class="tile" src="../assets/mora-jai/middle-middle-tile.png"></div>
            <div class="tile-button middle-right"><img id="${box}12" class="tile mirror" src="../assets/mora-jai/middle-side-tile.png"></div>
            <div class="tile-button bottom-left"><img id="${box}20" class="tile" src="../assets/mora-jai/bottom-side-tile.png"></div>
            <div class="tile-button bottom-middle"><img id="${box}21" class="tile" src="../assets/mora-jai/bottom-middle-tile.png"></div>
            <div class="tile-button bottom-right"><img id="${box}22" class="tile mirror" src="../assets/mora-jai/bottom-side-tile.png"></div>
        </div>
        <div class="corners">
            <div class="corner-button top-left-corner"><img id="${box}0" class="corner";"></div>
            <div class="corner-button top-right-corner"><img id="${box}1" class="corner mirror"></div>
            <div class="corner-button bottom-left-corner"><img id="${box}2" class="corner"></div>
            <div class="corner-button bottom-right-corner"><img id="${box}3" class="corner mirror"></div>
        </div>
    `;
}


// Adding click listeners to boxes themselves for final puzzle
function addBoxListeners() {
    // Changing music
    track = "in-the-dim";
    playMusic();

    // Showing variation note
    boxesContainer.insertAdjacentHTML('beforeend', `<img class="variation-note" src=../assets/variation-note.png>`);
    if (localData.playsound) {
        openSFXlist[Math.floor(Math.random() * openSFXlist.length)].play();
    }

    document.querySelectorAll(".mora-jai-container").forEach((box) => {
        box.classList.add("clickable");
        box.addEventListener("click", () => {
            if (isSliding) return;

            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (boxesMatrix[row][col].id === box.id) {
                        tilePressed('9' + row.toString() + col.toString());

                        // Checking if final box was solved
                        if (boxesColorMatrix[0][0] === "black" && boxesColorMatrix[0][2] === "black" && boxesColorMatrix[2][0] === "black" && boxesColorMatrix[2][2] === "black") {
                            // Saving solve to local data
                            localData.b[9] = true;
                            saveData();

                            // Playing sfx
                            if (localData.playsound) setTimeout(() => {boxSolveSFX.play()}, 1000);

                            //Removing boxes and displaying safe
                            setTimeout(() => {
                                boxesContainer.innerHTML = "";
                                document.getElementById("safe-container").classList.remove("hidden");
                            }, 1500);
                        }
                        return;
                    }
                }
            }
        });
    });
}


function checkFinalBox() {
    return localData.b[0] && localData.b[1] && localData.b[2] && localData.b[3] && localData.b[4] && localData.b[5] && localData.b[6] && localData.b[7] && localData.b[8];
}

function checkFinalSolved() {
    return boxesColorMatrix[0][0] === boxesColorMatrix[0][2] && boxesColorMatrix[0][0] === boxesColorMatrix[2][0] && boxesColorMatrix[0][0] === boxesColorMatrix[2][2];
}


// Changing color of a tile
function changeColor(matrix, row, col, color) {
    // Blackprintle variation
    if (isFinal && color === "grey") color = "black";

    // Changing color in matrix
    matrix[row][col] = color;

    // Changing all tiles on box if on final puzzle
    if (isFinal) {
        const box = boxesMatrix[row][col].id;
        updateCorners(box, true, realms[colors.indexOf(color)]);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const tile = document.getElementById(box.toString()+i.toString()+j.toString());
                tile.className = tile.className.replace(/\bcolor-\S+/g, '').trim();
                tile.classList.add("color-" + color);
            }
        }
    }
}


// Swapping 2 tiles
function swap(matrix, fromRow, fromCol, toRow, toCol) {
    // Swapping colors in matrix
    const temp = matrix[toRow][toCol];
    matrix[toRow][toCol] = matrix[fromRow][fromCol];
    matrix[fromRow][fromCol] = temp;

    // Sliding boxes on final puzzle
    if (isFinal) {
        // Preventing click while boxes are sliding
        isSliding = true;
        setTimeout(() => {isSliding = false}, 1000);

        const temp = boxesMatrix[toRow][toCol];
        boxesMatrix[toRow][toCol] = boxesMatrix[fromRow][fromCol];
        boxesMatrix[fromRow][fromCol] = temp;
    }
}


// Color logic functions

function red(matrix) {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const color = matrix[row][col];
            if (color === "black") changeColor(matrix, row, col, "red");
            if (color === "white") changeColor(matrix, row, col, "black");
        }
    }
}

function orange(matrix, row, col) {
    const neighbors = [];
    if (row !== 0) neighbors.push(matrix[row-1][col]);
    if (row !== 2) neighbors.push(matrix[row+1][col]);
    if (col !== 0) neighbors.push(matrix[row][col-1]);
    if (col !== 2) neighbors.push(matrix[row][col+1]);

    const counts = {};
    let maxCount = 0;
    for (const color of neighbors) {
        counts[color] = (counts[color] || 0) + 1;
        if (counts[color] > maxCount) {
            maxCount = counts[color];
        }
    }

    const winners = Object.keys(counts).filter(color => counts[color] === maxCount);
    if (winners.length === 1) {
        changeColor(matrix, row, col, winners[0]);
    }
}

function yellow(matrix, row, col) {
    if (row) {
        swap(matrix, row, col, row-1, col);
    }
}

function green(matrix, row, col){
    swap(matrix, row, col, 2-row, 2-col);
}

function blue(matrix, row, col, color){
    if (matrix[1][1] !== "blue") colorFuncs[colors.indexOf(matrix[1][1])](matrix, row, col, color);
}

function purple(matrix, row, col) {
    if (row !== 2) {
        swap(matrix, row, col, row+1, col);
    }
}

function pink(matrix, row, col) {
    const neighbors = [];
    if (row !== 0 && col !== 0) neighbors.push([row-1, col-1]);
    if (row !== 0) neighbors.push([row-1, col]);
    if (row !== 0 && col !== 2) neighbors.push([row-1, col+1]);
    if (col !== 2) neighbors.push([row, col+1]);
    if (row !== 2 && col !== 2) neighbors.push([row+1, col+1]);
    if (row !== 2) neighbors.push([row+1, col]);
    if (row !== 2 && col !== 0) neighbors.push([row+1, col-1]);
    if (col !== 0) neighbors.push([row, col-1]);

    for(let i = 1; i < neighbors.length; i++) {
        swap(matrix, neighbors[0][0], neighbors[0][1], neighbors[i][0], neighbors[i][1]);
    };
}

function white(matrix, row, col, color) {
    changeColor(matrix, row, col, "grey");
    if (row !== 0){
        if(matrix[row-1][col] === "grey"){
            changeColor(matrix, row-1, col, color);
        } else if(matrix[row-1][col] === color) changeColor(matrix, row-1, col, "grey");;
    }
    if (row !== 2){
        if(matrix[row+1][col] === "grey") {
            changeColor(matrix, row+1, col, color);
        } else if(matrix[row+1][col] === color) changeColor(matrix, row+1, col, "grey");;
    } 
    if (col !== 0){
        if(matrix[row][col-1] === "grey"){
            changeColor(matrix, row, col-1, color);
        } else if(matrix[row][col-1] === color) changeColor(matrix, row, col-1, "grey");;
    } 
    if (col !== 2){
        if(matrix[row][col+1] === "grey"){
            changeColor(matrix, row, col+1, color);
        } else if(matrix[row][col+1] === color) changeColor(matrix, row, col+1, "grey");;
    }
}

function black(matrix, row) {
    swap(matrix, row, 0, row, 1);
    swap(matrix, row, 0, row, 2);
}


// Saving local data
function saveData() {
    localStorage.setItem('localData', JSON.stringify(localData));
}


const magContainer = document.getElementById("magnifier-container");
const lensEffect = document.getElementById("lens-effect");
const hitboxes = document.querySelectorAll(".hitbox");

let isMagGlassDragging = false;
let isGlassVisible = false;
let magOffset = { x: 0, y: 0 };

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;


// Grabbing glass hitbox
hitboxes.forEach(hb => {
    hb.addEventListener("mousedown", (e) => {
        isMagGlassDragging = true;
        document.body.classList.add('is-dragging-glass');
        
        // Getting glass position
        const rect = magContainer.getBoundingClientRect();
        magOffset.x = e.clientX - rect.left;
        magOffset.y = e.clientY - rect.top;
    });
});


// Moving glass when dragging
window.addEventListener("mousemove", (e) => {
    if (!isMagGlassDragging) return;

    // Setting target glass position
    targetX = e.clientX - magOffset.x;
    targetY = e.clientY - magOffset.y;
});


// Releasing glass
window.addEventListener("mouseup", () => {
    if (isMagGlassDragging) {
        isMagGlassDragging = false;
        document.body.classList.remove('is-dragging-glass');
    }
});

// Updating zoom when window resized
window.addEventListener("resize", () => {
    if (isGlassVisible) updateStaticZoom();
});


// Slowly moving glass to target position smoothly
const weight = 0.08;
function animateMagnifier() {
    if (!isGlassVisible) return;

    // Moving glass based on weight
    currentX += (targetX - currentX) * weight;
    currentY += (targetY - currentY) * weight;

    magContainer.style.left = `${currentX}px`;
    magContainer.style.top = `${currentY}px`;

    // Updating lens image after moving and looping
    updateStaticZoom();
    requestAnimationFrame(animateMagnifier);
}

// Starting glass movement update loop
requestAnimationFrame(animateMagnifier);


// Chaning lens image to zoomed in picture of document below it
const zoomLevel = 2.5;
function updateStaticZoom() {
    // Calculating dimensions based on window size for consistent ui size
    const vh = window.innerHeight / 100;
    const containerWidth = 36.75 * vh;
    const containerHeight = 80 * vh;

    // Calculating lens center
    const lensRadius = 32 * vh / 2;
    const magRect = magContainer.getBoundingClientRect();
    const lensScreenX = magRect.left + (containerWidth * 0.05) + lensRadius;
    const lensScreenY = magRect.top + (containerHeight * 0.05) + lensRadius;

    document.querySelectorAll(".zoomable").forEach(img => {
        // Skipping hidden images
        if (img.offsetParent === null) return;

        // Calculating point on image to zoom on
        const imgRect = img.getBoundingClientRect();
        const xOnImage = lensScreenX - imgRect.left;
        const yOnImage = lensScreenY - imgRect.top;
        const bgX = (lensEffect.offsetWidth / 2) -(xOnImage * zoomLevel);
        const bgY = (lensEffect.offsetHeight / 2) -(yOnImage * zoomLevel);

        // Checking if glass is overlapping image and masking it if so
        if (!((lensScreenX + lensRadius) < imgRect.left || (lensScreenX - lensRadius) > imgRect.right || (lensScreenY + lensRadius) < imgRect.top || (lensScreenY - lensRadius) > imgRect.bottom)) {
            const mask = `radial-gradient(circle ${lensRadius - 2}px at ${xOnImage}px ${yOnImage}px, transparent 99%, black 100%)`;
            img.style.webkitMaskImage = mask;
            img.style.maskImage = mask;
        } else {
            img.style.webkitMaskImage = "none";
            img.style.maskImage = "none";
        }

        // Not diplaying anything if view is outside of image
        if ((bgX + imgRect.width * zoomLevel) <= 0 || bgX >= lensEffect.offsetWidth || (bgY + imgRect.height * zoomLevel) <= 0 || bgY >= lensEffect.offsetHeight) {
            lensEffect.style.backgroundImage = "none";
        } else {
            // Applying the image to the lens and changing its position to match lens center
            lensEffect.style.backgroundImage = `url('${img.src}')`;
            lensEffect.style.backgroundSize = `${imgRect.width * zoomLevel}px ${imgRect.height * zoomLevel}px`;
            lensEffect.style.backgroundPosition = `${bgX}px ${bgY}px`;
        }
    });
}