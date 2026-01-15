console.log("Main JS loaded");

import { floorplans } from "../scripts/floorplans.js";

const debug = new URLSearchParams(document.location.search).get("debug") === "true" ? true : false;
const debugDay = new URLSearchParams(document.location.search).get("day");

const gallery = document.getElementById("gallery-viewport");
const newFloorplansButton = document.getElementById("new-floorplans");
const prevButton = document.getElementById("prev-page-button");
const nextButton = document.getElementById("next-page-button");
const colorTextElm = document.getElementById("color-filter-text");

const launchDate = new Date('2026-01-15T00:00:00').getTime();
const today = debugDay ? new Date(debugDay) : new Date();
today.setHours(0, 0, 0, 0);
const daysSinceLaunch = Math.floor((today.getTime() - launchDate) / 86400000);
let tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow = tomorrow.getTime();

const hoverSFX = new Audio("./audio/hover.mp3");
const draftStartSFX = new Audio("./audio/start-draft.mp3");
draftStartSFX.volume = 0.5;
const draftEndSFX = new Audio("./audio/end-draft.mp3");
const openSFXlist = [new Audio("./audio/open0.mp3"), new Audio("./audio/open1.mp3"), new Audio("./audio/open2.mp3"), new Audio("./audio/open3.mp3"), new Audio("./audio/open4.mp3"), new Audio("./audio/open5.mp3")];
openSFXlist.forEach((sfx) => {sfx.volume = 0.5;});
const pageSFXlist = [new Audio("./audio/page0.mp3"), new Audio("./audio/page1.mp3"), new Audio("./audio/page2.mp3"), new Audio("./audio/page3.mp3")];
pageSFXlist.forEach((sfx) => {sfx.volume = 0.5;});
const endingMusic = new Audio("./audio/call-it-a-day.mp3");
endingMusic.volume = 0.5;
const exitSFX = new Audio("./audio/exit-click.mp3");
exitSFX.volume = 0.5;

const itemWidth = window.innerWidth * 0.16;
let isScrolling = false;
let scrollDirection = 0;
let animationFrameId = null;
let scrollTimer = null;
let shownsItems = 0;
let isMouseDown = false;
let isDragging = false;
let startX;
let scrollLeft;
let velX = 0;
let momentumID;
let lastSelectedIndex = null;

let guessedCorrectly = false;
let steps = 0;
let letterPage = 0;
let playsound = true;
let endingOn = false;
let hints = 0;
let hintText = "";
let searchFilter = "";
let colorFilter = "none";


// Hashing function from https://github.com/cprosche/mulberry32
function mulberry32(a) {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// Getting today's floorplan by hashing today's date
const hashGenerator = mulberry32(daysSinceLaunch + 12345);
let correctFloorplan = floorplans[Math.floor(hashGenerator() * floorplans.length)];
if (debug) {
    correctFloorplan = floorplans[Math.floor(Math.random() * floorplans.length)];
    console.log(correctFloorplan.name);
}


// Loading local user data
let localData = JSON.parse(localStorage.getItem('localData'));

// If local data doesn't exist, set default and display into letter
if (!localData || debug) {
    localData = {
        "playsound": true,
        "streak": 0,
        "wins": 0,
        "totalGuesses": 0,
        "guesses": [],
        "lastDayPlayed": 0,
        "lastDayWon": 0
    }
    saveData();
    if (!debug) toggleUIContainer(true, "letter");
}

// Initializing based on local data
if (localData.lastDayPlayed != daysSinceLaunch) {
    // Emptying yesterday's guesses
    localData.lastDayPlayed = daysSinceLaunch;
    localData.guesses = [];

    // Resetting streak if broken
    if (daysSinceLaunch - localData.lastDayWon > 1) {
        localData.streak = 0;
    }

    saveData();
}

// Adding your guesses from today
localData.guesses.forEach((guess) => {
    // Checking if guessed correctly
    if (correctFloorplan.name === guess) {
        guessedCorrectly = true;
        newFloorplansButton.classList.add("hidden");
        setTimeout(function() {
            initEnding();
        }, 1500);
    }

    drawFloorplan(guess);
});

// Setting mute status based on local data
if (!localData.playsound) {
    playsound = false;
    document.getElementById("mute-icon").src = `./assets/muted-icon.png`;
}


// Timer interval until new day
setInterval(function() {
    const now = new Date().getTime();
    const distance = tomorrow - now;

    // Refreshing page when day is finished
    if (distance < 0) {
        window.location.reload();
    }

    if (endingOn) {
        // Time calculations for hours, minutes and seconds
        const hours = ('0' + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).slice(-2);
        const minutes = ('0' + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).slice(-2);
        const seconds = ('0' + Math.floor((distance % (1000 * 60)) / 1000)).slice(-2);

        // Setting time in timer
        document.getElementById("timer").innerText = hours + ':' + minutes + ':' + seconds
    }
}, 1000);


// Adding hover sound effect to all clickables
document.querySelectorAll(".clickable").forEach((button) => {
    button.addEventListener("mouseenter", () => {
        if (playsound) {
            hoverSFX.play();
        }
    });
});


// New Floorplans Button Click
document.getElementById("new-floorplans").addEventListener("click", () => {
    // Preventing clicking while active
    if (newFloorplansButton.classList.contains("disabled")) return;
    newFloorplansButton.classList.remove("clickable");
    newFloorplansButton.classList.add("disabled");

    // Showing draft selection
    document.getElementById("draftsheet-container").classList.add("active");

    // Resetting gallery filters
    document.getElementById("search-input").value = "";
    searchFilter = "";
    colorFilter = "none";
    colorTextElm.innerText = "NONE";
    colorTextElm.classList = "none";


    // Focusing on search input
    document.getElementById("search-input").focus();

    // Playing sfx
    if (playsound) {
        draftStartSFX.play();
    }
    
    // Showing slection text
    setTimeout(function() {
        document.getElementById("draft-select-text").classList.add("active");
    }, 600);

    // Populating gallery
    let galleryHTML = "";
    let i = 0;
    floorplans.forEach(fp => {
        galleryHTML += `
            <button class="floorplan-button clickable gallery-floorplan" data-index="${i}"><img class="gallery-item" src="./assets/floorplans/${fp.name}.png"></button>
        `
        i++;
    });
    document.getElementById("gallery-track").innerHTML = galleryHTML;

    // Adding click and hover listeners to floorplans
    document.querySelectorAll(".gallery-floorplan").forEach(fp => {
        fp.addEventListener("click", (e) => {
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            choseFloorplan(floorplans[parseInt(fp.getAttribute("data-index"))].name);
        });

        fp.addEventListener("mouseenter", () => {
            if (playsound && !isMouseDown) {
                hoverSFX.play();
            }
        });
    });

    // Scrolling to last picked floorplan on open
    if (lastSelectedIndex !== null) {
        gallery.scrollTo({
            left: (lastSelectedIndex * itemWidth) - (gallery.offsetWidth / 2) + (itemWidth / 2),
            behavior: "auto"
        });
    } else {
        // If no previous guess, start at the beginning
        gallery.scrollLeft = 0;
    }

    // Animating measure line and gallery
    setTimeout(function() {
        document.getElementById("measure-line").classList.add("active");
        gallery.classList.add("active");
        document.getElementById("filter-container").style.left =  "50%";
    }, 1200);

    // Showing search and filter bar
    setTimeout(function() {
        document.getElementById("filter-container").classList.add("active");
    }, 1500);
});


gallery.addEventListener('dragstart', (e) => {
    e.preventDefault();
});


// Starting gallery dragging on mouse held
gallery.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    isDragging = false;
    startX = e.pageX - gallery.offsetLeft;
    scrollLeft = gallery.scrollLeft;
    cancelAnimationFrame(momentumID);
});


// Stopping drag on mouse let go
gallery.addEventListener('mouseup', () => {
    isMouseDown = false;
    gallery.classList.remove('active-drag');
    
    // Starting momentum scroll
    if (isDragging) {
        beginMomentum();
    }
    
    setTimeout(() => { 
        isDragging = false; 
    }, 10); 
});


// Stopping drag on mouse leaving track area
gallery.addEventListener('mouseleave', () => {
    isMouseDown = false;
    isDragging = false;
    gallery.classList.remove('active-drag');
});


// Checking mouse movement and disabling clicks/scrolling
gallery.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    
    // Minimum distance before dragging is counted
    const walk = (e.pageX - gallery.offsetLeft - startX); 
    if (!isDragging && Math.abs(walk) > 5) {
        isDragging = true;
        gallery.classList.add('active-drag'); // Disabling clicking
    }

    // Scroll if dragging started
    if (isDragging) {
        const prevScroll = gallery.scrollLeft;
        gallery.scrollLeft = scrollLeft - walk;
        velX = gallery.scrollLeft - prevScroll;
    }
});


// Gallery scrolling momentum loop
function beginMomentum() {
    cancelAnimationFrame(momentumID);
    function loop() {
        if (Math.abs(velX) > 2) {
            gallery.scrollLeft += velX;
            velX *= 0.95; 
            momentumID = requestAnimationFrame(loop);
        } else {
            // Stop velocity when it gets low
            velX = 0;
        }
    }
    loop();
}


// Gallery scrolling mouse wheel
gallery.addEventListener("wheel", (event) => {
    event.preventDefault();
    gallery.scrollBy({
        left: event.deltaY,
        behavior: "auto" 
    });
});


// Gallery scrolling arrow key held 
function startScrolling() {
    isScrolling = true;
    function loop() {
        if (isScrolling) {
            gallery.scrollLeft += scrollDirection * 25;
            animationFrameId = requestAnimationFrame(loop);
        }
    }
    loop();
}

// Arrow key pressed
document.addEventListener("keydown", (event) => {
    if (event.repeat || !gallery.classList.contains("active")) return;
    
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();

        scrollDirection = (event.key === "ArrowRight") ? 1 : -1;

        // Scroll 1 item if key just pressed
        gallery.scrollBy({
            left: scrollDirection * itemWidth,
            behavior: "smooth"
        });

        // Start scrolling if key is held down
        scrollTimer = setTimeout(() => {
            startScrolling();
        }, 250);
    }

    // Choosing floorplan when enter is pressed if there's only 1 item displayed
    if (event.key === "Enter" && shownsItems === 1) {
        document.querySelectorAll(".gallery-floorplan").forEach(fp => {
            if (!fp.classList.contains("hidden")) {
                choseFloorplan(floorplans[parseInt(fp.getAttribute("data-index"))].name);
            }
        });
    }
});


// Arrow key lifted, stop scrolling
document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        clearTimeout(scrollTimer);
        isScrolling = false;
        cancelAnimationFrame(animationFrameId);
    }
});


// Letter keyboard arrows page change
document.addEventListener("keydown", (event) => {
    if (document.getElementById("letter-container").classList.contains("hidden")) return;

    if (event.key === "ArrowRight") {
        changeLetterPage(letterPage + 1);
    } else if (event.key === "ArrowLeft") {
        changeLetterPage(letterPage - 1);
    }  
});


// Gallery search filter
document.getElementById("search-input").addEventListener("input", function() {
    const name = this.value ? this.value.toLowerCase().replaceAll(' ','') : "";
    searchFilter = name;
    filterGallery(name, colorFilter);
});


// Gallery color filter
document.querySelectorAll(".color-filter-button").forEach((button) => {
    button.addEventListener("click", () => {
        let color = button.getAttribute("data-color");
        if (color == colorFilter) {
            color = "none";
        }

        colorFilter = color;
        colorTextElm.classList = color.toLocaleLowerCase().replaceAll(' ','-');
        colorTextElm.innerText = color.toUpperCase();

        filterGallery(searchFilter, color);
    });
});


// Filtering gallery items
function filterGallery(name, color) {
    shownsItems = 0;
    document.querySelectorAll(".gallery-floorplan").forEach(fp => {
        const floorplan = floorplans[parseInt(fp.getAttribute("data-index"))];
        if (floorplan.name.indexOf(name) !== -1 && (color == "none" || floorplan.types.includes(color))) {
            shownsItems++;
            fp.classList.remove("hidden");
        }
        else {
            fp.classList.add("hidden");
        }
    });
}


// Letter page advance on click
document.getElementById("intro-letter").addEventListener("click", () => {
    changeLetterPage((letterPage + 1) % 4);
});


// UI close button
document.querySelectorAll(".close-button").forEach((button) => {
    button.addEventListener("click", (event) => {
        toggleUIContainer(false, "letter");
        toggleUIContainer(false, "kofi");
    });
});


// Escape key to close letter
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        toggleUIContainer(false, "letter");
        toggleUIContainer(false, "kofi");
        if (document.getElementById("draftsheet-container").classList.contains("active")) {
            hideDraftSelect();
        }
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


// Letter button
document.getElementById("letter-button").addEventListener("click", (event) => {
    toggleUIContainer(false, "kofi");
    if (document.getElementById("letter-container").classList.contains("hidden")) {
        toggleUIContainer(true, "letter");
    } else {
        toggleUIContainer(false, "letter");
    }
});


// Kofi button
document.getElementById("kofi-button").addEventListener("click", (event) => {
    toggleUIContainer(false, "letter");
    if (document.getElementById("kofi-container").classList.contains("hidden")) {
        toggleUIContainer(true, "kofi");
    } else {
        toggleUIContainer(false, "kofi");
    }
});


// Mute button
document.getElementById("mute-button").addEventListener("click", (event) => {
    playsound = !playsound;
    document.getElementById("mute-icon").src = `./assets/${playsound ? "un" : ""}muted-icon.png`;

    // Saving mute preference to local data
    localData.playsound = playsound;
    saveData();
});


// When a floorplan is chosen
function choseFloorplan(name) {
    // Preventing choosing when not active or if already guessed correctly
    if (document.getElementById("draftsheet-container").classList.contains("active") === false || guessedCorrectly) return;

    // Saving guess data
    localData.totalGuesses++;
    localData.guesses.push(name);
    saveData();

    // Saving last selected index
    lastSelectedIndex = floorplans.findIndex(fp => fp.name === name);

    // Playing sfx
    if (playsound) {
        draftEndSFX.play();
    }

    // Hiding draft selection
    hideDraftSelect();

    // Checking if guessed correctly
    if (correctFloorplan.name === name) {
        guessedCorrectly = true;
        newFloorplansButton.classList.add("hidden");
        setTimeout(function() {
            initEnding();
        }, 1500);

        // Saving win data
        localData.streak++;
        localData.wins++;
        localData.lastDayWon = daysSinceLaunch;
        saveData();
    }

    drawFloorplan(name);
};


// Adding floorplan info to screen
function drawFloorplan(name) {
    // Incrementing steps
    steps++;
    document.getElementById("steps-counter").innerText = steps;

    // Initializing answer checking
    const floorplan = floorplans.find(fp => fp.name === name);
    let numGreen = 0;
    let answers = {"cost": "wrong", "type": "wrong", "missing": "wrong", "extra": "wrong", "rarity": "wrong", "entrances": "wrong"};

    // Cost check
    if (Math.abs(correctFloorplan.cost - floorplan.cost) <= 1){
        if (correctFloorplan.cost === floorplan.cost) {
            answers.cost = "correct";
            numGreen++;
        } else {
            answers.cost = "close";
        }
    }

    // Type comparison
    const numTypesShared = correctFloorplan.types.filter(value => floorplan.types.includes(value)).length;
    const numTypesExtra = floorplan.types.length - numTypesShared;
    const numTypesCorrect = correctFloorplan.types.length;
    if (numTypesShared != 0) {
        answers.type = "close";
        answers.missing = "close";
        answers.extra = "close";

        if (numTypesShared == numTypesCorrect) {
            answers.missing = "correct";
            numGreen++;
            if (numTypesExtra == 0) {
                answers.type = "correct";
                answers.extra = "correct";
            }
        } else {
            if (numTypesExtra == 0) {
                answers.extra = "correct";
                numGreen++;
            }
        }
    }

    // Rarity check (with special case for n/a or rumored)
    if (Math.abs(correctFloorplan.rarity - floorplan.rarity) <= 1){
        if (correctFloorplan.rarity === floorplan.rarity) {
            answers.rarity = "correct";
            numGreen++;
        } else {
            if (correctFloorplan.rarity !== 0 && floorplan.rarity !== 0 && correctFloorplan.rarity !== 5 && floorplan.rarity !== 5) {
                answers.rarity = "close";
            }
        }
    }

    // Entrances check
    if (Math.abs(correctFloorplan.entrances - floorplan.entrances) <= 1){
        if (correctFloorplan.entrances === floorplan.entrances) {
            answers.entrances = "correct";
            numGreen++;
        } else {
            answers.entrances = "close";
        }
    }

    // Increasing hint count if guess is almost correct
    if (hints != name.length && (hints > 8 || numGreen >= 3)) {
        hints++;
        let visibleCharCount = hints;
        let words = correctFloorplan.displayName.split(' ');

        // Replacing to underscore after char count is 0
        words = words.map(word => {
            return word.split('').map(char => {
                // Check if the character is a letter or number
                if (/[a-zA-Z0-9]/.test(char)) {
                    if (visibleCharCount > 0) {
                        visibleCharCount--;
                        return char;
                    } else {
                        return " _ ";
                    }
                }
                return char;
            }).join('');
        });

        hintText = `<span class="hint-text">HINT<span class="colon">:</span> `;
        words.forEach((word) => {
            hintText += `<span class="hint-word">${word}</span>`;
        });
        hintText += `</span>`;
    }

    // Creating gems HTML
    let gemsHTML = "";
    if (floorplan.cost === 0) {
        gemsHTML = `<span class="info-text none">None</span>`;
    } else {
        for(let i = 0; i < floorplan.cost; i++) {
            gemsHTML += `<img class="gem" src="./assets/gem.png">`
        }
    }

    // Creating types HTML with colors and icons
    let typesHTML = "";
    const hasIcon = ["Drafting", "Entry", "Mechanical", "Puzzle", "Spread", "Tomorrow"];
    let i = 0;
    floorplan.types.forEach(type => {
        i++;
        typesHTML += `<span class="info-text ${type.toLowerCase().replaceAll(' ', '-').replaceAll('"', '')}">${hasIcon.includes(type) ? `<img class="type-icon" src="./assets/${type.toLowerCase()}-type-icon.png">` : ""}${type}${i === floorplan.types.length ? "" : ", "}</span>`;
    });

    const rarityNames = ["n/a", "Commonplace", "Standard", "Unusual", "Rare", "Rumored"];
    //Creating new entry element
    const newEntryElement = document.createElement("div");
    newEntryElement.classList.add("floorplan-entry");
    newEntryElement.innerHTML = `
        <div class="flex-row">
            <img class="floorplan" src="./assets/floorplans/${name}.png">
            <div class="info-container">
                <div><span class="${answers.cost}">COST</span><span class="colon">:</span>${gemsHTML}</div>
                <div>
                    <span class="${answers.type}">TYPE </span>
                    <span class="wrong" style="font-size: clamp(10px, 18px, 1.7vw)">(<span class="${answers.missing}">MISSING</span> - <span class="${answers.extra}">EXTRA</span>)</span><span class="colon">:</span>   
                </div>
                <div>${typesHTML}</div>
                <div>
                    <span class="${answers.rarity}">RARITY</span><span class="colon">:</span>
                    ${floorplan.rarity >= 1 && floorplan.rarity != 5 ? `<img class="rarity-dot" src="./assets/commonplace-dot.png">` : ""}
                    ${floorplan.rarity >= 2 && floorplan.rarity != 5 ? `<img class="rarity-dot" src="./assets/standard-dot.png">` : ""}
                    ${floorplan.rarity >= 3 && floorplan.rarity != 5 ? `<img class="rarity-dot" src="./assets/unusual-dot.png">` : ""}
                    ${floorplan.rarity >= 4 && floorplan.rarity != 5 ? `<img class="rarity-dot" src="./assets/rare-dot.png">` : ""}
                    <span class="info-text ${rarityNames[floorplan.rarity].toLowerCase()}">${rarityNames[floorplan.rarity]}</span>
                </div>
                <div><span class="${answers.entrances}">ENTRANCES</span><span class="colon">:</span><img class="type-icon" src="./assets/${floorplan.entrances}-icon.png"></div>
            </div>
        </div>
        ${guessedCorrectly ? "" : hintText + `<img class="down-arrow" src="./assets/down arrow.png">`}
    `;

    // Adding new entry to the DOM with animation
    document.getElementById("floorplans-container").appendChild(newEntryElement);

    const entryHeight = newEntryElement.offsetHeight;
    newEntryElement.style.height = "0";
    setTimeout(() => {
        newEntryElement.style.height = entryHeight + "px";
        newEntryElement.classList.add("active");
        const duration = 1500;
        const startTime = performance.now();

        // Smoothly scrolling screen bottom to follow new entry
        function followButton(currentTime) {
            const elapsed = currentTime - startTime;
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'auto'
            });

            if (elapsed < duration) {
                requestAnimationFrame(followButton);
            } else {
                newEntryElement.style.height = "auto";
            }
        }
        requestAnimationFrame(followButton);
    }, 500);
}

function hideDraftSelect() {
    document.getElementById("draftsheet-container").classList.remove("active");

    // Resetting new floorplan button and animations when offscreen
    setTimeout(function() {
        document.getElementById("draft-select-text").classList.remove("active");
        document.getElementById("measure-line").classList.remove("active");
        gallery.classList.remove("active");
        document.getElementById("filter-container").style.left = "150%";
        document.getElementById("filter-container").classList.remove("active");
        newFloorplansButton.classList.add("clickable");
        newFloorplansButton.classList.remove("disabled");
    }, 1000);
}

// Toggling intro letter or kofi note state
function toggleUIContainer(open, container) {
    // Exiting if ui state is already matched
    const containerElm = document.getElementById(`${container}-container`)
    if (containerElm.classList.contains("hidden") !== open) return;

    // Playing sfx
    if (playsound) {
        openSFXlist[Math.floor(Math.random() * openSFXlist.length)].play();
    }

    if (open === true) {
        // Resetting letter to page 0 on open
        if (container === "letter") {
            changeLetterPage(0);
        }

        containerElm.classList.remove("hidden");
    } else {
        containerElm.classList.add("hidden");
    }
};


// Changing page in intro letter
function changeLetterPage(page) {
    // Checking if page change is valid
    const finalPage = 3;
    if (page < 0 || page > finalPage) return;

    // Playing sfx
    if (playsound) {
        pageSFXlist[Math.floor(Math.random() * pageSFXlist.length)].play();
    }

    // Changing page
    letterPage = page;
    document.getElementById("intro-letter").src = `./assets/letter${page}.png`;

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

if (debug || debugDay) {
    document.addEventListener("keydown", (event) => {
        if (event.key === "1") {
            initEnding();
        }
    });
}

// Ending sequence when floorplan is correctly guessed
function initEnding() {
    // Setting stats from local data and floorplan image to today's floorplan
    endingOn = true;
    document.getElementById("day-text").innerText = "Day " + daysSinceLaunch;
    document.getElementById("today-floorplan").src = `./assets/floorplans/${correctFloorplan.name}.png`;
    document.getElementById("guesses-num").innerText = steps;
    document.getElementById("average-num").innerText = Math.round(((localData.totalGuesses / localData.wins) + Number.EPSILON) * 10) / 10;
    document.getElementById("streak-num").innerText = localData.streak;

    // Playing ending music
    if (playsound) {
        endingMusic.play();
    }

    // Starting all the ending screen fade in animations
    const endingScreen = document.getElementById("ending-container");
    endingScreen.classList.remove("hidden");
    setTimeout(function() {
       endingScreen.style.opacity = 1;
    }, 100);
    setTimeout(function() {
        document.getElementById("today-floorplan-container").style.opacity = 1;
        document.getElementById("day-text").style.opacity = 1;
    }, 1300);
    setTimeout(function() {
        document.getElementById("ihtmc").style.opacity = 1;
    }, 2500);
    setTimeout(function() {
        document.getElementById("timer-container").style.opacity = 1;
    }, 3700);

    // Fading away when exit button is pressed
    document.getElementById("ending-exit-button").addEventListener("click", () => {
        endingScreen.style.opacity = 0;
        setTimeout(function() {
            endingScreen.classList.add("hidden");
            endingOn = false
        }, 1000);

        // Fading out music
        if (playsound) {
            exitSFX.play();

            const fadeOutInterval = setInterval(() => {
                endingMusic.volume = Math.max(0, endingMusic.volume - 0.05);
                if (endingMusic.volume === 0) clearInterval(fadeOutInterval);
            }, 50);

            setTimeout(function() {
                endingMusic.pause();
                endingMusic.currentTime = 0;
            }, 1000);
        }
    });
}

function saveData() {
    localStorage.setItem('localData', JSON.stringify(localData));

}

