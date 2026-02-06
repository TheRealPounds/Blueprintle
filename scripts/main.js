/*
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                                                                            !!WARNING!!
                        If you came to look in the code for hints for the puzzle, this is NOT a part of the intended solving experience!
            None of the files/assets used by the webstie were meant for that use and could spoil certain parts as their implementation wasn't obfuscated!
                                    If you came here for another reason, please don't judge my terrible code too harshly
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/
console.log("Main JS loaded");

import { floorplans } from "../scripts/floorplans.js";

const urlParams = new URLSearchParams(document.location.search);
if ((urlParams.get("color") && urlParams.get("color").toLowerCase() === "black") || (urlParams.get("Color") && urlParams.get("Color").toLowerCase() === "black") || (urlParams.get("COLOR") && urlParams.get("COLOR").toLowerCase() === "black")) window.location.href = "./blackprintle";
const debug = urlParams.get("debug") === "true" ? true : false;
const endlessMode = debug || urlParams.get("endlessMode") === "true" ? true : false || urlParams.get("endless") === "true" ? true : false;
const debugDay = urlParams.get("day");
const debugFloorplan = urlParams.get("floorplan");

const gallery = document.getElementById("gallery-viewport");
const newFloorplansButton = document.getElementById("new-floorplans");
const prevButton = document.getElementById("prev-page-button");
const nextButton = document.getElementById("next-page-button");
const colorTextElm = document.getElementById("color-filter-text");

const launchDate = new Date('2026-02-02T00:00:00').getTime();
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
const puzzleMusic = new Audio("./audio/stories-of-all-manor.mp3");
puzzleMusic.loop = true;
puzzleMusic.volume = 0.2;
const settingsOpenSFX = new Audio("./audio/breaker-box-open.mp3");
const settingsCloseSFX = new Audio("./audio/breaker-box-close.mp3");
const settingsSwitchSFX = new Audio("./audio/breaker-toggle.mp3");

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

let onMobile = false;
onMobile = (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) return true;})(navigator.userAgent||navigator.vendor||window.opera);
let guessedCorrectly = false;
let steps = 0;
let letterPage = 0;
let sound = true;
let endingOn = false;
let hints = 0;
let hintText = "";
let searchFilter = "";
let colorFilter = "none";
let puzzleMode = 0;
const sequence = ["sacredroom", "cloisteroforinda", "office", "locksmith", "observatory", "rumpusroom", "entrancehall", "questbedroom", "utilitycloset", "archives", "lostfound", "schoolhouse", "bunkroom", "lavatory", "aquarium", "corriyard", "kitchen"];


// Hashing function from https://github.com/cprosche/mulberry32
function mulberry32(a) {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

const dateOverrides = {
    "2026-03-03": "office",
    "2026-03-20": "room46",
    "2026-04-10": "throneoftheblueprince",
    "2026-04-15": "drawingroom",
    "2026-05-08": "classroom",
    "2026-11-07": "entrancehall",
    "2026-11-08": "draftingstudio",
    "2026-12-08": "study",
    "2026-12-25": "boudoir",
    "2027-01-30": "shelter",
    "2028-08-08": "room8"
};
const hashGenerator = mulberry32(daysSinceLaunch + 12345);
let correctFloorplan;
if (debugFloorplan && debug) {
    correctFloorplan = floorplans.find(fp => fp.name === debugFloorplan);
} else {
    if (endlessMode) {
        // Picking random floorplan in endless mode
        correctFloorplan = floorplans[Math.floor(Math.random() * floorplans.length)];
        if (debug) console.log(correctFloorplan.name);
    } else {
        // Either picking a floorplan from hashed date or the date override if there is one
        const todayString = new Intl.DateTimeFormat('en-CA').format(today);
        if (dateOverrides[todayString]) {
            correctFloorplan = floorplans.find(fp => fp.name === dateOverrides[todayString]);
        } else {
            correctFloorplan = floorplans[Math.floor(hashGenerator() * floorplans.length)];
        }
    }
}


// Loading local user data
let localData = JSON.parse(localStorage.getItem('localData'));
let settings = JSON.parse(localStorage.getItem('settings'));

// If local data doesn't exist, set default and display into letter
if (!localData || debug) {
    localData = {
        "streak": 0,
        "wins": 0,
        "totalGuesses": 0,
        "guesses": [],
        "lastDayPlayed": 0,
        "lastDayWon": 0,
    }
    saveData();
    if (!debug) setTimeout(() => {toggleUIContainer(true, "letter")}, 500);
}

if (!settings) {
    settings = {
        "sound": true,
        "hints": true,
        "colorblindIcons": true,
        "b" : [false, false, false, false, false, false, false, false, false, false, false]
    }
    saveData();
}

// Local storage old format data fix 
if (localData.playsound) {
    settings.sound = localData.playsound;
    delete localData.playsound;
    saveData();
}
if (localData.b) {
    settings.b = localData.b;
    delete localData.b;
    saveData();
}

function updateSettingsSwitches() {
    if (endlessMode) document.getElementById("endless-button").classList.add("active");
    settings.sound ? document.getElementById("sound-setting").classList.add("active") : document.getElementById("sound-setting").classList.remove("active");
    settings.hints ? document.getElementById("hints-setting").classList.add("active") : document.getElementById("hints-setting").classList.remove("active");
    settings.colorblindIcons ? document.getElementById("colorblind-icons-setting").classList.add("active") : document.getElementById("colorblind-icons-setting").classList.remove("active");
}
updateSettingsSwitches();

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

let shareString = `Blueprintle${settings.b[10] ? "👑" : ""} - Day ${daysSinceLaunch === 1 ? "One" : daysSinceLaunch}\n💎 🅰️ 🅱️ 🔴 🚪\n`;

// Adding your guesses from today
if (!endlessMode) {
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
}

// Showing crowns in puzzle was completed
if (settings.b[10]) {
    document.querySelectorAll(".crown").forEach((elm) => {
        elm.classList.remove("hidden");
    });
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


// Hiding site if on vertical mode
const portraitQuery = window.matchMedia("(orientation: portrait)");
handleOrientationChange(portraitQuery);
function handleOrientationChange(e) {
    if (e.matches) {
        document.getElementById("every-container").classList.add("hidden");
        document.getElementById("mobile-warning").classList.remove("hidden");
    } else {
        document.getElementById("every-container").classList.remove("hidden");
        document.getElementById("mobile-warning").classList.add("hidden");
    }
}

// Listen for rotation changes
portraitQuery.addEventListener("change", handleOrientationChange);


// Adding hover sound effect to all clickables
document.querySelectorAll(".clickable").forEach((button) => {
    button.addEventListener("mouseenter", () => {
        if (sound) {
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
    document.getElementById("filter-container").classList.remove("hidden");
    if(!onMobile) document.getElementById("search-input").focus();

    // Playing sfx
    if (sound) {
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
            if (sound && !isMouseDown) {
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
        gallery.scrollLeft = 0;
    }

    // Animating measure line and gallery
    setTimeout(function() {
        document.getElementById("measure-line").classList.add("active");
        gallery.classList.add("active");
        document.getElementById("filter-container").style.opacity = 1;
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
        if (floorplan.name.indexOf(name) !== -1 && (color === "none" || floorplan.types.includes(color))) {
            shownsItems++;
            fp.classList.remove("hidden");
        }
        else {
            fp.classList.add("hidden");
        }
    });

    if (name === "sacredroom" && !puzzleMode) {
        document.getElementById("gallery-track").innerHTML = `<button id="sacred-room" class="floorplan-button clickable"><img class="gallery-item" src="./assets/floorplans/sacredroom.png"></button>`;
        document.getElementById("sacred-room").addEventListener("click", () => {
            puzzleMode = 1;
            choseFloorplan("sacredroom");
        });
    }

    // Bringing gallery to begining when filtering
    gallery.scrollLeft = 0;
}


// Letter keyboard arrows page change
document.addEventListener("keydown", (event) => {
    if (document.getElementById("letter-container").classList.contains("hidden")) return;

    if (event.key === "ArrowRight") {
        changeLetterPage(letterPage + 1);
    } else if (event.key === "ArrowLeft") {
        changeLetterPage(letterPage - 1);
    }  
});


// Letter page advance on click
document.getElementById("intro-letter").addEventListener("click", () => {
    changeLetterPage((letterPage + 1) % 4);
});


// UI close button
document.querySelectorAll(".close-button").forEach((button) => {
    button.addEventListener("click", (event) => {
        toggleUIContainer(false);
        hideDraftSelect();
    });
});


// Escape key to close ui
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        toggleUIContainer(false);
        hideDraftSelect();
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
    if (document.getElementById("letter-container").classList.contains("hidden")) {
        toggleUIContainer(false);
        toggleUIContainer(true, "letter");
    } else {
        toggleUIContainer(false);
    }
});


// Kofi button
document.getElementById("kofi-button").addEventListener("click", (event) => {
    if (document.getElementById("kofi-container").classList.contains("hidden")) {
        toggleUIContainer(false);
        toggleUIContainer(true, "kofi");
    } else {
        toggleUIContainer(false);
    }
});


// Settings button
document.getElementById("settings-button").addEventListener("click", (event) => {
    if (document.getElementById("settings-container").classList.contains("hidden")) {
        toggleUIContainer(false);
        toggleUIContainer(true, "settings");
    } else {
        toggleUIContainer(false);
    }
});


// Endless mode toggle switch, sending to page with toggled mode
document.getElementById("endless-button").addEventListener("click", () => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("endless") || url.searchParams.has("endlessMode")) {
        url.searchParams.delete("endless");
        url.searchParams.delete("endlessMode");
    } else {
        url.searchParams.set("endless", "true");
    }
    window.location.href = url.toString();
});


// Settings switches
document.querySelectorAll(".switch-button").forEach((swtch) => {
    if (swtch.id === "endless-button") return;
    swtch.addEventListener("click", () => {
        const setting = swtch.getAttribute("data-setting");
        settings[setting] = !settings[setting];
        updateSettingsSwitches();
        saveData();
        if (settings.sound) settingsSwitchSFX.play();
    });
});


// When a floorplan is chosen
let cannotDraftTimer = null;
const cannotDraftClasslist = document.getElementById("cannot-draft").classList;
function choseFloorplan(name) {
    // Preventing choosing when not active or if already guessed correctly
    if (document.getElementById("draftsheet-container").classList.contains("active") === false || guessedCorrectly) return;

    // Removing focus from search input
    document.getElementById("search-input").blur();

    // Preventing choosing if already chose this floorplan today
    if (localData.guesses.includes(name) && !(puzzleMode || endlessMode)) {
        if (cannotDraftTimer) {
            clearTimeout(cannotDraftTimer);
        }
        cannotDraftClasslist.remove("hidden");
        cannotDraftTimer = setTimeout(() => {
            cannotDraftClasslist.add("hidden");
        }, 2000);
        return;
    }

    // Saving guess data
    if (!(puzzleMode || endlessMode)) {
        localData.totalGuesses++;
        localData.guesses.push(name);
        saveData();
    }
    if (puzzleMode && sound) puzzleMusic.play();

    // Saving last selected index
    lastSelectedIndex = floorplans.findIndex(fp => fp.name === name);

    // Playing sfx
    if (sound) {
        draftEndSFX.play();
    }

    // Hiding draft selection
    hideDraftSelect();

    // Checking if guessed correctly
    if (correctFloorplan.name === name && !puzzleMode) {
        guessedCorrectly = true;
        newFloorplansButton.classList.add("hidden");
        setTimeout(function() {
            initEnding();
        }, 1500);

        // Saving win data
        if (!endlessMode) {
            localData.streak++;
            localData.wins++;
            localData.lastDayWon = daysSinceLaunch;
            saveData();
        }
    }

    drawFloorplan(name);
};


// Adding floorplan info to screen
function drawFloorplan(name) {
    let floorplan;
    let answers = {"cost": "wrong", "type": "wrong", "absent": "wrong", "excess": "wrong", "rarity": "wrong", "entrances": "wrong"};
    if (!puzzleMode) {
        // Incrementing steps
        steps++;
        document.getElementById("steps-counter").innerText = steps;

        // Initializing answer checking
        floorplan = floorplans.find(fp => fp.name === name);
        let numGreen = 0;

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
        const numTypesExcess = floorplan.types.length - numTypesShared;
        const numTypesCorrect = correctFloorplan.types.length;
        if (numTypesShared != 0) {
            answers.type = "close";
            answers.absent = "close";
            answers.excess = "close";

            if (numTypesShared == numTypesCorrect) {
                answers.absent = "correct";
                numGreen++;
                if (numTypesExcess == 0) {
                    answers.type = "correct";
                    answers.excess = "correct";
                }
            } else {
                if (numTypesExcess == 0) {
                    answers.excess = "correct";
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
        if (settings.hints && hints != name.length && (steps > 3 || numGreen === 4) && (steps >= 8 || numGreen >= 3)) {
            hints++;
            let visibleCharCount = hints - 1;
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
    } else {
        if (name === sequence[puzzleMode-1]) {
            answers = {"cost": "blueprint", "type": "blueprint", "absent": "blueprint", "excess": "blueprint", "rarity": "blueprint", "entrances": "blueprint"};
            if (puzzleMode === sequence.length) {
                floorplan = {"name": "?", "displayName": "", "cost": 0, "types": [], "rarity": 6, "entrances": 0};
                newFloorplansButton.classList.add("hidden");
                const fadeOutInterval = setInterval(() => {
                    puzzleMusic.volume = Math.max(0, puzzleMusic.volume - 0.01);
                    if (puzzleMusic.volume === 0) clearInterval(fadeOutInterval);
                }, 50);
                setTimeout(() => {puzzleMusic.pause()}, 1000);
            } else {
                floorplan = floorplans.find(fp => fp.name === sequence[puzzleMode]);
            }
            puzzleMode++;
        } else {
            floorplan = floorplans.find(fp => fp.name === name);
        }
    }
    shareString += answerToEmoji(answers.cost) + answerToEmoji(answers.absent) + answerToEmoji(answers.excess) + answerToEmoji(answers.rarity) + answerToEmoji(answers.entrances) + '\n';

    // Creating gems HTML
    let gemsHTML = "";
    if (floorplan.cost === 0) {
        gemsHTML = `<span class="info-text none">None</span>`;
    } else {
        for(let i = 0; i < floorplan.cost; i++) {
            gemsHTML += `<img class="gem" src="./assets/gem.png">`
        }
    }
    if (floorplan.name === '?') gemsHTML = '?';

    // Creating types HTML with colors and icons
    let typesHTML = "";
    const hasIcon = ["Drafting", "Entry", "Mechanical", "Puzzle", "Spread", "Tomorrow"];
    let i = 0;
    floorplan.types.forEach(type => {
        i++;
        typesHTML += `<span class="info-text ${type.toLowerCase().replaceAll(' ', '-').replaceAll('"', '')}">${hasIcon.includes(type) ? `<img class="type-icon" src="./assets/${type.toLowerCase()}-type-icon.png">` : ""}${type}${i === floorplan.types.length ? "" : ", "}</span>`;
    });
    if (floorplan.name === '?') typesHTML = '?';

    const rarityNames = ["n/a", "Commonplace", "Standard", "Unusual", "Rare", "Rumored", "?"];
    //Creating new entry element
    const newEntryElement = document.createElement("div");
    newEntryElement.classList.add("floorplan-entry");
    newEntryElement.innerHTML = `
        <div class="flex-row">
            <img class="floorplan" src="./assets/floorplans/${name}.png">
            <div class="info-container">
                <div>${settings.colorblindIcons ? `<img class="answer-icon" src="./assets/${answers.cost}.png">` : ""}<span class="${answers.cost}">COST</span><span class="colon">:</span>${gemsHTML}</div>
                <div>
                    <span class="${answers.type}">TYPE </span>
                    <span class="wrong" style="font-size: clamp(10px, 18px, 1.7vw)">(${settings.colorblindIcons ? `<img class="answer-icon" src="./assets/${answers.absent}.png">` : ""}<span class="${answers.absent}">ABSENT</span> - ${settings.colorblindIcons ? `<img class="answer-icon" src="./assets/${answers.excess}.png">` : ""}<span class="${answers.excess}">EXCESS</span>)</span><span class="colon">:</span>
                </div>
                <div>${typesHTML}</div>
                <div>
                    ${settings.colorblindIcons ? `<img class="answer-icon" src="./assets/${answers.rarity}.png">` : ""}
                    <span class="${answers.rarity}">RARITY</span><span class="colon">:</span>
                    ${floorplan.rarity >= 1 && floorplan.rarity < 5 ? `<img class="rarity-dot" src="./assets/commonplace-dot.png">` : ""}
                    ${floorplan.rarity >= 2 && floorplan.rarity < 5 ? `<img class="rarity-dot" src="./assets/standard-dot.png">` : ""}
                    ${floorplan.rarity >= 3 && floorplan.rarity < 5 ? `<img class="rarity-dot" src="./assets/unusual-dot.png">` : ""}
                    ${floorplan.rarity >= 4 && floorplan.rarity < 5 ? `<img class="rarity-dot" src="./assets/rare-dot.png">` : ""}
                    <span class="${floorplan.rarity === 6 ? "" : "info-text"} ${rarityNames[floorplan.rarity].toLowerCase()}">${rarityNames[floorplan.rarity]}</span>
                </div>
                <div>${settings.colorblindIcons ? `<img class="answer-icon" src="./assets/${answers.entrances}.png">` : ""}<span class="${answers.entrances}">ENTRANCES</span><span class="colon">:</span>${floorplan.entrances ? `<img class="type-icon" src="./assets/${floorplan.entrances}-icon.png">` : "?"}</div>
            </div>
        </div>
        ${guessedCorrectly || puzzleMode ? "" : hintText}
        ${guessedCorrectly || puzzleMode > sequence.length ? "" : `<img class="down-arrow" src="./assets/down arrow.png">`}
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

function answerToEmoji(answer) {
    switch(answer) {
        case "wrong":
            return "⬛ ";
        case "close":
            return "🟨 ";
        case "correct":
            return "🟩 ";
        default:
            return " ";
    }
}

function hideDraftSelect() {
    if (document.getElementById("draftsheet-container").classList.contains("active")) {
        document.getElementById("draftsheet-container").classList.remove("active");
    } else {
        return;
    }

    // Resetting new floorplan button and animations when offscreen
    setTimeout(function() {
        document.getElementById("draft-select-text").classList.remove("active");
        document.getElementById("measure-line").classList.remove("active");
        gallery.classList.remove("active");
        document.getElementById("filter-container").classList.add("hidden");
        document.getElementById("filter-container").style.opacity = 0;
        document.getElementById("filter-container").classList.remove("active");
        newFloorplansButton.classList.add("clickable");
        newFloorplansButton.classList.remove("disabled");
    }, 1000);
}

// Toggling intro letter or kofi note state
const containers = ["letter", "kofi", "settings"];
function toggleUIContainer(open, container) {
    // If no container was provided, closing all uis
    if (!container) {
        containers.forEach((c) => toggleUIContainer(false, c));
        document.getElementById("close-button").classList.add("hidden");
        return;
    }

    // Exiting if ui state is already matched
    const containerElm = document.getElementById(`${container}-container`)
    if (containerElm.classList.contains("hidden") !== open) return;

    // Playing sfx
    if (sound) {
        if (container === "settings") {
            open ? settingsOpenSFX.play() : settingsCloseSFX.play();
        } else {
            openSFXlist[Math.floor(Math.random() * openSFXlist.length)].play();
        }
    }

    if (open === true) {
        // Resetting letter to page 0 on open
        if (container === "letter") {
            changeLetterPage(0);
        }

        document.getElementById("close-button").classList.remove("hidden");
        containerElm.classList.remove("hidden");
    } else {
        containerElm.classList.add("hidden");
    }

    if ((container === "letter" || container === "kofi") && open === true && !isGlassVisible) {
        currentX = -(36.75 * window.innerHeight / 100) - 50;
        currentY = window.innerHeight + 50; 

        targetX = window.innerWidth * 0.05;
        targetY = window.innerHeight * 0.5;

        isGlassVisible = true;
        magContainer.classList.remove("hidden");
        requestAnimationFrame(animateMagnifier);
    } else {
        magContainer.classList.add("hidden");
        isGlassVisible = false;
    }
};


// Changing page in intro letter
function changeLetterPage(page) {
    // Checking if page change is valid
    const finalPage = 4;
    if (page < 0 || page > finalPage) return;

    // Playing sfx
    if (sound) {
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
    const dayText = document.getElementById("day-text");
    if (endlessMode) {
        dayText.innerText = "Endless Mode";
    } else {
        switch(daysSinceLaunch) {
            case 0:
                dayText.innerText = "The Day Before..";
                break;
            
            case 1:
                dayText.innerText = "Day One";
                break;
            
            default:
                dayText.innerText = "Day " + daysSinceLaunch;
                break;
        }
    }
    document.getElementById("today-floorplan-text").innerText = endlessMode ? "Chosen floorplan:" : "Today's floorplan:"
    document.getElementById("today-floorplan").src = `./assets/floorplans/${correctFloorplan.name}.png`;
    document.getElementById("guesses-num").innerText = steps;
    document.getElementById("average-num").innerText = endlessMode ? "-" : Math.round(((localData.totalGuesses / localData.wins) + Number.EPSILON) * 10) / 10;
    document.getElementById("streak-num").innerText = endlessMode ? "-" : localData.streak;
    shareString += steps.toString() + (steps === 1 ? " guess" : " guesses");

    // Playing ending music
    if (sound) {
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
        if (sound) {
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

    // Copying share string
    let copiedTimer;
    document.getElementById("ending-share-button").addEventListener("click", () => {
        navigator.clipboard.writeText(shareString);

        // Playing sfx
        if (sound) exitSFX.play();

        // Showing copied text
        if (copiedTimer) {
            clearTimeout(copiedTimer);
        }
        document.getElementById("copied-text").classList.remove("hidden");
        copiedTimer = setTimeout(() => {
            document.getElementById("copied-text").classList.add("hidden");
        }, 2000);
        return;
    });
}


function saveData() {
    localStorage.setItem('localData', JSON.stringify(localData));
    localStorage.setItem('settings', JSON.stringify(settings));
}


// The magnifying glass was a late addition, so a lot of its logic and structure is very seperate from the rest
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

// Grabbing glass hitbox (Touch)
hitboxes.forEach(hb => {
    hb.addEventListener("touchstart", (e) => {
        // Prevent browser scrolling/zooming when touching the glass
        if (e.cancelable) e.preventDefault(); 

        isMagGlassDragging = true;
        document.body.classList.add('is-dragging-glass');
        
        // Get the first finger's position
        const touch = e.touches[0];
        const rect = magContainer.getBoundingClientRect();
        
        magOffset.x = touch.clientX - rect.left;
        magOffset.y = touch.clientY - rect.top;
    }, { passive: false });
});


// Moving glass when dragging
window.addEventListener("mousemove", (e) => {
    if (!isMagGlassDragging) return;

    // Setting target glass position
    targetX = e.clientX - magOffset.x;
    targetY = e.clientY - magOffset.y;
});


// Moving glass when dragging (Touch)
window.addEventListener("touchmove", (e) => {
    if (!isMagGlassDragging) return;
    
    // Stop the screen from scrolling while dragging the glass
    if (e.cancelable) e.preventDefault(); 

    const touch = e.touches[0];
    targetX = touch.clientX - magOffset.x;
    targetY = touch.clientY - magOffset.y;
}, { passive: false });


// Releasing glass
window.addEventListener("mouseup", () => {
    if (isMagGlassDragging) {
        isMagGlassDragging = false;
        document.body.classList.remove('is-dragging-glass');
    }
});


// Releasing glass (Touch)
window.addEventListener("touchend", () => {
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
    const magRect = magContainer.getBoundingClientRect();
    const vh = magRect.height / 80;
    const containerWidth = 36.75 * vh;
    const containerHeight = 80 * vh;

    // Calculating lens center
    const lensRadius = 16 * vh;
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

