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

const url = new URL(window.location.href);
const urlParams = new URLSearchParams(document.location.search);
if ((urlParams.get("color") && urlParams.get("color").toLowerCase() === "black") || (urlParams.get("Color") && urlParams.get("Color").toLowerCase() === "black") || (urlParams.get("COLOR") && urlParams.get("COLOR").toLowerCase() === "black")) window.location.href = "./blackprintle";
const debug = urlParams.get("debug") === "true" ? true : false;
const endless = debug || urlParams.get("endlessMode") === "true" ? true : false || urlParams.get("endless") === "true" ? true : false;
const mode = urlParams.get("mode") === "dare" ? "dare" : urlParams.get("mode") === "curse" ? "curse" : "bequest";
const debugDay = null//urlParams.get("day");
const debugFloorplan = urlParams.get("floorplan");

const gallery = document.getElementById("gallery-viewport");
const newFloorplansButton = document.getElementById("new-floorplans");
const prevButton = document.getElementById("prev-page-button");
const nextButton = document.getElementById("next-page-button");
const colorTextElm = document.getElementById("color-filter-text");
const stepsCounter = document.getElementById("steps-counter");

const launchDate = mode === "bequest" ? new Date('2026-02-02T00:00:00').getTime() : new Date('2026-02-19T00:00:00').getTime();
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
const callItADay = new Audio("./audio/call-it-a-day.mp3");
callItADay.volume = 0.5;
const goodbyeToTheSea = new Audio("./audio/goodbye-to-the-sea.mp3");
goodbyeToTheSea.volume = 0.5;
const exitSFX = new Audio("./audio/exit-click.mp3");
exitSFX.volume = 0.5;
const puzzleMusic = new Audio("./audio/stories-of-all-manor.mp3");
puzzleMusic.loop = true;
puzzleMusic.volume = 0.2;
const settingsOpenSFX = new Audio("./audio/breaker-box-open.mp3");
const settingsCloseSFX = new Audio("./audio/breaker-box-close.mp3");
const settingsSwitchSFX = new Audio("./audio/breaker-toggle.mp3");

let dare1;
let dare2;
let dare1State;
let dare2State;
let prevFloorplan;
const answersList = [];
const hasIcon = ["Drafting", "Entry", "Mechanical", "Puzzle", "Spread", "Tomorrow", "Rocket"];

const itemWidth = window.innerWidth * 0.16;
let isScrolling = false;
let scrollDirection = 0;
let animationFrameId = null;
let scrollTimer = null;
let shownItems = 0;
let isMouseDown = false;
let isDragging = false;
let startX;
let scrollLeft;
let velX = 0;
let momentumID;
let lastSelectedIndex = null;

let onMobile = false;
onMobile = (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) return true;})(navigator.userAgent||navigator.vendor||window.opera);
let guessingDisabled = false;
let steps = mode === "curse" ? 13 : 0;
stepsCounter.innerText = steps;
let letterPage = 0;
const finalPage = mode === "dare" ? 1 : 4;
let endingOn = false;
let hints = 0;
let hintText = "";
let searchFilter = "";
let colorFilter = "none";
let puzzleMode = 0;
let currentGuesses = [];
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
const hashGenerator = mulberry32(daysSinceLaunch + (mode == "bequest" ? 12345 : mode == "dare" ? 69420 : 123456));
let correctFloorplan;
if (debugFloorplan && debug) {
    correctFloorplan = floorplans.find(fp => fp.name === debugFloorplan);
} else {
    if (endless) {
        // Picking random floorplan in endless mode
        correctFloorplan = floorplans[Math.floor(Math.random() * floorplans.length)];
        if (debug) console.log(correctFloorplan.name);
    } else {
        // Either picking a floorplan from hashed date or the date override if there is one
        const todayString = new Intl.DateTimeFormat('en-CA').format(today);
        if (dateOverrides[todayString] && mode === "bequest") {
            correctFloorplan = floorplans.find(fp => fp.name === dateOverrides[todayString]);
        } else {
            correctFloorplan = floorplans[Math.floor(hashGenerator() * floorplans.length)];
        }
    }
}


// Loading local user data
let localData = JSON.parse(localStorage.getItem(mode + 'Data'));
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
    if (mode !== "bequest") localData.lastDayEnded = -1;
    if (mode === "dare") {
        localData.dare1Final = true;
        localData.dare2Final = true;
    }
    saveData();
    if (!debug) setTimeout(() => {toggleUIContainer(true, mode === "curse" ? "curse-note" : "letter")}, 500);
} else {
    if (mode === "dare" && localData.lastDayEnded !== daysSinceLaunch) {
        setTimeout(() => {
            toggleUIContainer(true, "letter");
            changeLetterPage(1);
        }, 200);
    }
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
const oldData = JSON.parse(localStorage.getItem('localData'));
if (oldData) {
    if (oldData.playsound) {
        settings.sound = oldData.playsound;
        delete oldData.playsound;
        saveData();
    }
    if (oldData.b) {
        settings.b = oldData.b;
        delete oldData.b;
        saveData();
    }
    if (mode === "bequest") localData = oldData;
    localStorage.setItem('bequestData', JSON.stringify(oldData));
    localStorage.removeItem('localData');
}

// Updating stuff from settings
function updateSettingsSwitches() {
    if (endless) document.getElementById("endless-button").classList.add("active");
    settings.sound ? document.getElementById("sound-setting").classList.add("active") : document.getElementById("sound-setting").classList.remove("active");
    settings.hints ? document.getElementById("hints-setting").classList.add("active") : document.getElementById("hints-setting").classList.remove("active");
    settings.colorblindIcons ? document.getElementById("colorblind-icons-setting").classList.add("active") : document.getElementById("colorblind-icons-setting").classList.remove("active");
}
updateSettingsSwitches();

// Endless mode play again button click
if (endless) {
    document.getElementById("ending-play-again-button").classList.remove("hidden");
    document.getElementById("ending-play-again-button").addEventListener("click", () => {location.reload()});
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


// Initializing share string
let shareString = `${settings.b[10] ? "👑" : ""}Blueprintle${mode === "bequest" ? "" : mode === "dare" ? " DARE MODE" : " CURSE MODE"} - ${endless ? "Endless Mode" : `Day ${daysSinceLaunch === 1 ? "One" : daysSinceLaunch}`}\n💎 🅰️ 🅱️ 🔴 🚪\n`;


// Adding your guesses from today
if (!endless) {
    localData.guesses.forEach((guess) => {
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


// Setting mode logo image
if (mode === "bequest") {
    document.getElementById("mode-logo").classList.add("hidden");
} else {
    document.getElementById("mode-logo").src = "./assets/" + mode + "-mode-logo.png";
}


// Initializing dare mode
const yesterdayFloorplans = [
    floorplans[Math.floor(mulberry32(daysSinceLaunch + 12344)() * floorplans.length)].name,
    floorplans[Math.floor(mulberry32(daysSinceLaunch + 69419)() * floorplans.length)].name,
    floorplans[Math.floor(mulberry32(daysSinceLaunch + 123455)() * floorplans.length)].name
];
const dareHashGenerator = mulberry32(endless ? Math.random() * 1000000 : daysSinceLaunch);
const dares = [
    {"name": "archived", "startState": true, "incompatibleRooms": [], "incompatibleDares": ["allGrey", "keepGreen"]},
    {"name": "b2bColors", "startState": true, "incompatibleRooms": ["aquarium", "electriceelaquraium"], "incompatibleDares": []},
    {"name": "allGrey", "startState": false, "incompatibleRooms": ["thefoundation", "garage", "musicroom", "lockerroom", "ballroom", "rumpusroom", "drawingroom", "chamberofmirrors", "thepool", "draftingstudio", "boilerroom", "security", "laboratory", "observatory", "conferenceroom", "aquarium", "electriceelaquarium", "servantsquarters", "eastwinghall", "greathall", "cloisterofdraxus", "secretgarden", "locksmith", "laundryroom", "bookshop", "mounthollygiftshop", "archives", "thekennel", "clocktower", "classroom", "planetarium", "mechanarium", "treasuretrove", "conservatory", "closedexhibit"], "incompatibleDares": ["archived", "keepGreen"]},
    {"name": "singleBedroom", "startState": true, "incompatibleRooms": [], "incompatibleDares": []},
    {"name": "allRarities", "startState": false, "incompatibleRooms": [], "incompatibleDares": ["limitedRarities", "keepGreen"]},
    {"name": "hint", "startState": false, "incompatibleRooms": [], "incompatibleDares": ["noHints"]},
    {"name": "yesterdayRooms", "startState": true, "incompatibleRooms": yesterdayFloorplans, "incompatibleDares": [yesterdayFloorplans.includes("lavatory") ? "lavatoryWait" : "", yesterdayFloorplans.includes("entrancehall") ? "startEntrance" : ""]},
    {"name": "exactRedRooms", "startState": false, "incompatibleRooms": [], "incompatibleDares": []},
    {"name": "noSafeOrLever", "startState": true, "incompatibleRooms": ["boudoir", "office", "drawingroom", "study", "draftingstudio", "shelter", "secretgarden", "greenhouse", "greenhousesecret", "greathall", "weightroom", "mechanarium", "throneroom", "throneoftheblueprince"], "incompatibleDares": []},
    {"name": "noUpgrades", "startState": true, "incompatibleRooms": floorplans.filter(fp => fp.types.includes("Upgrade")).map(fp => fp.name), "incompatibleDares": []},
    {"name": "lavatoryWait", "startState": false, "incompatibleRooms": ["lavatory"], "incompatibleDares": [yesterdayFloorplans.includes("lavatory") ? "yesterdayRooms" : ""]},
    {"name": "dupeFirstLetters", "startState": true, "incompatibleRooms": [], "incompatibleDares": ["hideHistory"]},
    {"name": "noSingleType", "startState": true, "incompatibleRooms": floorplans.filter(fp => fp.types.length !== 1).map(fp => fp.name), "incompatibleDares": []},
    {"name": "filterClear", "startState": true, "incompatibleRooms": [], "incompatibleDares": ["onlySearch"]},
    {"name": "deadEndEquals", "startState": true, "incompatibleRooms": [], "incompatibleDares": ["hideHistory"]},
    {"name": "singleCostDiff", "startState": true, "incompatibleRooms": ["trophyroom", "throneroom", "throneoftheblueprince"], "incompatibleDares": []},
    {"name": "chooseTimer", "startState": true, "incompatibleRooms": [], "incompatibleDares": ["onlySearch"]},
    {"name": "noHints", "startState": true, "incompatibleRooms": [], "incompatibleDares": ["hint"]},
    {"name": "onlySearch", "startState": true, "incompatibleRooms": [], "incompatibleDares": ["filterClear", "chooseTimer", "cropped"]},
    {"name": "sixColors", "startState": false, "incompatibleRooms": ["aquarium", "electriceelaquarium", "corriyard", "thearmory", "maidschamber"], "incompatibleDares": []},
    {"name": "noTypeIcon", "startState": true, "incompatibleRooms": floorplans.filter(fp => fp.types.some(t => hasIcon.includes(t))).map(fp => fp.name), "incompatibleDares": []},
    {"name": "startEntrance", "startState": false, "incompatibleRooms": ["entrancehall"], "incompatibleDares": ["randomFirst", yesterdayFloorplans.includes("entrancehall") ? "yesterdayRooms" : ""]},
    {"name": "curseMode", "startState": false, "incompatibleRooms": [], "incompatibleDares": []},
    {"name": "chess", "startState": false, "incompatibleRooms": [], "incompatibleDares": []},
    {"name": "totalCost", "startState": true, "incompatibleRooms": ["trophyroom", "throneroom", "throneoftheblueprince"], "incompatibleDares": []},
    {"name": "no3Types", "startState": true, "incompatibleRooms": floorplans.filter(fp => fp.types.length >= 3).map(fp => fp.name), "incompatibleDares": []},
    {"name": "limitedRarities", "startState": true, "incompatibleRooms": ["entrancehall", "antechamber", "room46"], "incompatibleDares": ["allRarities"]},
    {"name": "hideHistory", "startState": true, "incompatibleRooms": [], "incompatibleDares": ["deadEndEquals", "dupeFirstLetters"]},
    {"name": "diffEntrances", "startState": true, "incompatibleRooms": [], "incompatibleDares": []},
    {"name": "noDucts", "startState": true, "incompatibleRooms": ["garage", "boilerroom", "pumproom", "laboratory", "laundryroom", "furnace", "lockerroom", "security", "passageway", "archives","darkroom", "weightroom", "electriceelaquarium"], "incompatibleDares": []},
    {"name": "keepGreen", "startState": true, "incompatibleRooms": [], "incompatibleDares": ["archived", "allGrey", "allRarities"]},
    {"name": "randomFirst", "startState": false, "incompatibleRooms": [], "incompatibleDares": ["startEntrance"]},
    {"name": "cropped", "startState": true, "incompatibleRooms": [], "incompatibleDares": ["onlySearch"]},
];//{"name": "", "startState": true, "incompatibleRooms": [], "incompatibleDares": []},
if (mode === "dare") {
    // Changing letter button icon
    document.getElementById("intro-icon").src = "./assets/dare-letter-icon.png";

    // Filtering out dares that aren't compatible with today's room
    let filteredDares = dares.filter(dare => !dare.incompatibleRooms.includes(correctFloorplan.name));

    // Choosing first dare, filtering out dares that aren't compatible with it, and choosing second dare
    dare1 = filteredDares[Math.floor(dareHashGenerator() * filteredDares.length)];
    dare1State = dare1.startState;
    dare1 = dare1.name;
    filteredDares = filteredDares.filter(dare => !dare.incompatibleDares.includes(dare1) && dare.name !== dare1);
    dare2 = filteredDares[Math.floor(dareHashGenerator() * filteredDares.length)];
    dare2State = dare2.startState;
    dare2 = dare2.name;

    // Setting dares in intro letter & ending dares note
    document.getElementById("dare1").src = "./assets/dares/" + dare1 + ".png";
    document.getElementById("dare2").src = "./assets/dares/" + dare2 + ".png";
    document.getElementById("dare1-ending").src = "./assets/dares/" + dare1 + ".png";
    document.getElementById("dare2-ending").src = "./assets/dares/" + dare2 + ".png";
}


// Syncing dare mode in case dare states or defeat cause we're because of guesses
if (mode === "dare" && !endless && localData.lastDayEnded === daysSinceLaunch) {
    dare1State = localData.dare1Final;
    dare2State = localData.dare2Final;
    if (!endingOn) initEnding("DEFEAT");
}


// Initializing curse mode
if (mode === "curse") {
    document.body.style.backgroundImage = 'url("../assets/curse-background.png")';
    newFloorplansButton.classList.add("cursed");
    document.getElementById("letter-button").classList.add("hidden");
    document.getElementById("curse-note-button").classList.remove("hidden");
    document.getElementById("curse-steps-container").classList.remove("hidden");
}


// Mobile warning check if aspect ratio is less than 1:1
const mainContent = document.getElementById("every-container");
const mobileWarning = document.getElementById("mobile-warning");
let aspectRatioProceed = false;

const aspectQuery = window.matchMedia("(max-aspect-ratio: 1/1)");
handleLayoutChange(aspectQuery);

document.getElementById("mobile-warning-button").addEventListener("click", () => {
    aspectRatioProceed = true;
    mainContent.classList.remove("hidden");
    mobileWarning.classList.add("hidden");
});

function handleLayoutChange(e) {
    if (aspectRatioProceed) return;

    if (e.matches) {
        mainContent.classList.add("hidden");
        mobileWarning.classList.remove("hidden");
    } else {
        mainContent.classList.remove("hidden");
        mobileWarning.classList.add("hidden");
    }
}
// Listening for aspect ratio changes
aspectQuery.addEventListener("change", handleLayoutChange);


// Adding hover sound effect to all clickables
document.querySelectorAll(".clickable").forEach((button) => {
    button.addEventListener("mouseenter", () => {
        if (settings.sound) {
            hoverSFX.play();
        }
    });
});


// New Floorplans Button Click
let chooseInterval;
document.getElementById("new-floorplans").addEventListener("click", () => {
    // Preventing clicking while active
    if (newFloorplansButton.classList.contains("disabled")) return;
    newFloorplansButton.classList.remove("clickable");
    newFloorplansButton.classList.add("disabled");

    // Showing draft selection
    document.getElementById("draftsheet-container").classList.add("active");

    // Focusing on search input
    document.getElementById("filter-container").classList.remove("hidden");
    if(!onMobile) document.getElementById("search-input").focus();

    // Playing sfx
    if (settings.sound) {
        draftStartSFX.play();
    }
    
    // Showing slection text
    setTimeout(function() {
        document.getElementById("draft-select-text").classList.add("active");
    }, 600);

    // Populating gallery
    let galleryHTML = `<button id="random-floorplan" class="floorplan-button clickable gallery-floorplan"><img class="gallery-item" src="./assets/floorplans/random.png"></button>`;
    let i = 0;
    const crop = daresCheck("cropped");
    floorplans.forEach(fp => {
        galleryHTML += `
            <button class="floorplan-button clickable gallery-floorplan" data-index="${i}"><img class="gallery-item${crop ? " cropped" : ""}" src="./assets/floorplans/${fp.name}.png"></button>
        `;
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
            const index = fp.getAttribute("data-index");
            if (index) choseFloorplan(floorplans[parseInt(index)].name);
        });

        fp.addEventListener("mouseenter", () => {
            if (settings.sound && !isMouseDown) {
                hoverSFX.play();
            }
        });
    });

    // Random floorplan functionality
    document.getElementById("random-floorplan").addEventListener("click", () => {
        let roomList = [];

        if (daresCheck("randomFirst") && currentGuesses.length === 0) {
            dare1 === "randomFirst" ? dare1State = true : dare2State = true;
            roomList = floorplans.map(fp => fp.name);
        } else {
            document.querySelectorAll(".gallery-floorplan").forEach(fp => {
                const index = fp.getAttribute("data-index");
                if (index && !fp.classList.contains("hidden")) roomList.push(floorplans[parseInt(index)].name);
            });
            roomList = roomList.filter(fp => !currentGuesses.includes(fp));
        }

        if (mode === "dare") {
            if (dare1 !== "") roomList = roomList.filter(fp => !dares.find(dare => dare.name === dare1).incompatibleRooms.includes(fp));
            if (dare2 !== "") roomList = roomList.filter(fp => !dares.find(dare => dare.name === dare2).incompatibleRooms.includes(fp));
        }

        if (roomList.length === 0) return;
        choseFloorplan(roomList[Math.floor(Math.random() * roomList.length)]);
    });

    // Resetting gallery filter
    document.getElementById("search-input").value = "";
    searchFilter = "";
    colorFilter = "none";
    colorTextElm.innerText = "NONE";
    colorTextElm.classList = "none";
    filterGallery("", "none");

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

    // Choose timer dare
    if (daresCheck("chooseTimer")) {
        const chooseTimer = document.getElementById("choose-timer");
        chooseTimer.classList.add("hidden");

        setTimeout(function() {
            let time = 8;
            chooseTimer.innerText = 8;
            chooseTimer.classList.remove("hidden");

            chooseInterval = setInterval(() => {
                time--;
                chooseTimer.innerText = time;

                if (time === 0) {
                    dare1 === "chooseTimer" ? dare1State = false : dare2State = false;
                    hideDraftSelect();
                    disableGuessing();
                    initEnding("DEFEAT");
                    clearInterval(chooseInterval);
                }
            }, 1000);
        }, 2000);
    }
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
    if (event.key === "Enter" && shownItems === 1) {
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
if (daresCheck("cropped")) {
    document.getElementById("search-input").classList.add("hidden");
} else {
    document.getElementById("search-input").addEventListener("input", function() {
        const name = this.value ? this.value.toLowerCase().replaceAll(' ','') : "";

        // No filter clear dare
        if (daresCheck("filterClear") && name.indexOf(searchFilter) !== 0) {
            dare1 === "filterClear" ? dare1State = false : dare2State = false;
            hideDraftSelect();
            disableGuessing();
            initEnding("DEFEAT");
        }

        searchFilter = name;
        filterGallery(name, colorFilter);
    });
}


// Gallery color filter
document.querySelectorAll(".color-filter-button").forEach((button) => {
    button.addEventListener("click", () => {
        let color = button.getAttribute("data-color");

        // No filter clear dare
        if (daresCheck("filterClear") && colorFilter !== "none") {
            dare1 === "filterClear" ? dare1State = false : dare2State = false;
            hideDraftSelect();
            disableGuessing();
            initEnding("DEFEAT");
        }

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
    shownItems = 0;
    document.querySelectorAll(".gallery-floorplan").forEach(fp => {
        const index = fp.getAttribute("data-index");
        if (!index) return;
        const floorplan = floorplans[parseInt(index)];
        // Only search dare
        if (daresCheck("onlySearch")) {
            if (floorplan.displayName.toLowerCase().replaceAll(' ', '') === name) {
                shownItems++;
                fp.classList.remove("hidden");
            }
            else {
                fp.classList.add("hidden");
            }
        } else { // Normal filter
            if (floorplan.name.indexOf(name) !== -1 && (color === "none" || floorplan.types.includes(color))) {
                shownItems++;
                fp.classList.remove("hidden");
            }
            else {
                fp.classList.add("hidden");
            }
        }
    });

    // Showing or hiding random floorplan button
    if (shownItems > 1) {
        document.getElementById("random-floorplan").classList.remove("hidden");
    } else {
        document.getElementById("random-floorplan").classList.add("hidden");
    }

    // Creating rocket silo easter egg option if searched for directly
    if (name === "rocketsilo" && mode !== "dare") {
        const easterEggButton = document.createElement("button");
        easterEggButton.classList = "floorplan-button clickable";
        easterEggButton.id = "rocketsilo";
        easterEggButton.innerHTML = `<img class="gallery-item" src="./assets/floorplans/rocketsilo.png">`;
        easterEggButton.addEventListener("click", () => choseFloorplan("rocketsilo"));
        document.getElementById("gallery-track").appendChild(easterEggButton);
    }

    if (name === "sacredroom" && !puzzleMode && mode === "bequest") {
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
    changeLetterPage((letterPage + 1) % (finalPage + 1));
});


// UI close button
document.querySelectorAll(".close-button").forEach((button) => {
    if ((daresCheck("filterClear") ||daresCheck("chooseTimer")) && !button.id) button.classList.add("hidden");
    button.addEventListener("click", () => {
        if (document.getElementById("close-button").classList.contains("hidden")) hideDraftSelect();
        toggleUIContainer(false);
    });
});


// Escape key to close ui
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        if (!daresCheck("filterClear") && !daresCheck("chooseTimer") && document.getElementById("close-button").classList.contains("hidden")) hideDraftSelect();
        toggleUIContainer(false);
    }
});


// Previous page button click
prevButton.addEventListener("click", () => {
    changeLetterPage(letterPage - 1);
});


// Next page button click
nextButton.addEventListener("click", () => {
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


// Curse note button
document.getElementById("curse-note-button").addEventListener("click", (event) => {
    if (document.getElementById("curse-note-container").classList.contains("hidden")) {
        toggleUIContainer(false);
        toggleUIContainer(true, "curse-note");
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


// Mode select button
document.getElementById("mode-select-button").addEventListener("click", (event) => {
    if (document.getElementById("mode-container").classList.contains("hidden")) {
        toggleUIContainer(false);
        toggleUIContainer(true, "mode");
    } else {
        toggleUIContainer(false);
    }
});


// Mode buttons
document.querySelectorAll(".mode-button").forEach((button) => {
    
    button.addEventListener("click", () => {
        // Closing menu if already in mode
        const buttonMode = button.getAttribute("data-mode");
        if (buttonMode === mode)  {
            toggleUIContainer(false);
            return;
        }

        // Changing url to correct mode parameter and sending to new url
        if (buttonMode === "bequest") {
            url.searchParams.delete("mode");
        } else {
            url.searchParams.set("mode", buttonMode);
        }
        window.location.href = url.toString();
    });
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
    if (document.getElementById("draftsheet-container").classList.contains("active") === false) return;

    // Removing focus from search input
    document.getElementById("search-input").blur();

    // Clearing interval for choose timer dare
    if (chooseInterval) clearInterval(chooseInterval);

    // Preventing choosing if already chose this floorplan today
    if (currentGuesses.includes(name) && !puzzleMode) {
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
    if (!(puzzleMode || endless)) {
        localData.totalGuesses++;
        localData.guesses.push(name);
        saveData();
    }
    if (puzzleMode && settings.sound) puzzleMusic.play();

    // Saving last selected index
    lastSelectedIndex = floorplans.findIndex(fp => fp.name === name);

    // Playing sfx
    if (settings.sound) {
        draftEndSFX.play();
    }

    // Hiding draft selection
    hideDraftSelect();

    // Saving win data if guessed correctly
    if (correctFloorplan.name === name && !puzzleMode && !endless) {
        localData.streak++;
        localData.wins++;
        localData.lastDayWon = daysSinceLaunch;
        saveData();
    }

    // Hide draft history dare
    if (daresCheck("hideHistory") && document.querySelector(".floorplan-entry")) document.querySelector(".floorplan-entry").remove();

    // Random floorplan dare
    if (daresCheck("randomFirst") && !((dare1 === "randomFirst" ? dare1State : dare2State))) {
        disableGuessing();
        initEnding("DEFEAT");
    }

    drawFloorplan(name);
};


// Adding floorplan info to screen
function drawFloorplan(name) {
    let floorplan;
    let answers = {"cost": "wrong", "type": "wrong", "absent": "wrong", "excess": "wrong", "rarity": "wrong", "entrances": "wrong"};
    currentGuesses.push(name);
    if (!puzzleMode) {
        // Incrementing steps
        if (mode !== "curse") {
            steps++;
            stepsCounter.innerText = steps;
        }

        // Initializing answer checking
        if (name === "rocketsilo") {
            floorplan = {"name": "rocketsilo", "displayName": "ROCKET SILO", "cost": 0, "types": ["Rocket", "Hallway", "Addition", "Objective", "Outer Room"], "rarity": 5, "entrances": 5};
        } else {
            floorplan = floorplans.find(fp => fp.name === name);
        }
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
        const numTypesShared = correctFloorplan.types.filter(value => value !== "" && floorplan.types.includes(value)).length;
        const numTypesExcess = floorplan.types.filter(value => value !== "").length - numTypesShared;
        const numTypesCorrect = correctFloorplan.types.filter(value => value !== "").length;
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
        if (settings.hints && mode !== "curse" && correctFloorplan.name !== name && !daresCheck("noHints") && hints != name.length && (steps > 3 || numGreen === 4 || daresCheck("hint")) && (steps >= 8 || numGreen >= 3)) {
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
                disableGuessing();
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

    // Keeping green stats dare
    if (daresCheck("keepGreen")) {
        answersList.push(answers);
    }

    // Checking floorplan guess for dares
    if (mode === "dare") {
        let failed = false;
        let dareResult = dareFloorplanCheck(dare1, floorplan);
        if (dareResult !== null) {
            dare1State = dareResult;
            if (dareResult === false) failed = true;
        }
        dareResult = dareFloorplanCheck(dare2, floorplan);
        if (dareResult !== null) {
            dare2State = dareResult;
            if (dareResult === false) failed = true;
        }
        prevFloorplan = floorplan;

        if (failed) {
            disableGuessing();
            initEnding("DEFEAT");
        }
    }

    // All grey stats dare
    if (answers.cost === "wrong" && answers.type === "wrong" && answers.rarity === "wrong" && answers.entrances === "wrong") {
        if (dare1 === "allGrey") dare1State = true;
        if (dare2 === "allGrey") dare2State = true;
    }

    // Lowering steps based on guess if on curse mode
    if (mode === "curse" && currentGuesses.length !== 0) {
        // Calculating lost steps
        let lostSteps = 0;
        lostSteps -= answers.cost === "correct" ? 0 : answers.cost === "close" ? 1 : 2;
        lostSteps -= answers.type === "correct" ? 0 : answers.type === "close" ? 1 : 2;
        lostSteps -= answers.rarity === "correct" ? 0 : answers.rarity === "close" ? 1 : 2;
        lostSteps -= answers.entrances === "correct" ? 0 : answers.entrances === "close" ? 1 : 2;
        
        // Lowering step counter visually
        if (lostSteps) {
            steps += lostSteps;
            document.getElementById("curse-steps-num").innerText = lostSteps;
            document.getElementById("curse-steps-container").classList.add("active");
            setTimeout(() => {
                const stepsReduceInterval = setInterval(() => {
                    stepsCounter.innerText = parseInt(stepsCounter.innerText) - 1;
                    lostSteps++;
                    if (lostSteps === 0) {
                        document.getElementById("curse-steps-container").classList.remove("active");
                        clearInterval(stepsReduceInterval);
                    }
                }, 300)
            }, 1000);
        }

        // Failing if steps go below 0
        if (steps <= 0) {
            disableGuessing();
            setTimeout(function() {
                initEnding("DEFEAT");
            }, 1500);
        }
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
    if (floorplan.name === '?') gemsHTML = '?';

    // Creating types HTML with colors and icons
    let typesHTML = "";
    let i = 0;
    floorplan.types.forEach(type => {
        i++;
        typesHTML += `<span class="info-text ${type.toLowerCase().replaceAll(' ', '-').replaceAll('"', '')}">${hasIcon.includes(type) ? `<img class="type-icon" src="./assets/${type.toLowerCase()}-type-icon.png">` : ""}${type}${i === floorplan.types.length ? "" : ", "}</span>`;
    });
    if (floorplan.name === '?') typesHTML = '?';

    // Creating rarity HTML with dots
    const rarityNames = ["n/a", "Commonplace", "Standard", "Unusual", "Rare", "Rumored", "?"];
    let rarityHTML = "";
    if (floorplan.rarity < 5) {
        if (floorplan.rarity >= 1) rarityHTML += `<img class="rarity-dot" src="./assets/commonplace-dot.png"> `;
        if (floorplan.rarity >= 2) rarityHTML += `<img class="rarity-dot" src="./assets/standard-dot.png"> `;
        if (floorplan.rarity >= 3) rarityHTML += `<img class="rarity-dot" src="./assets/unusual-dot.png"> `;
        if (floorplan.rarity >= 4) rarityHTML += `<img class="rarity-dot" src="./assets/rare-dot.png"> `;
    }
    rarityHTML += `<span class="${floorplan.rarity === 6 ? "" : "info-text"} ${rarityNames[floorplan.rarity].toLowerCase()}">${rarityNames[floorplan.rarity]}</span>`;

    // Creating entrances number HTML
    let entrancesHTML = `${floorplan.entrances ? `<img class="type-icon" src="./assets/${floorplan.entrances}-icon.png">` : "?"}`;

    // Random stat archive dare
    if (daresCheck("archived")) {
        const archivedHTML = `<img class="archived-stat" src="./assets/archived-stat.png">`;
        switch(Math.floor(dareHashGenerator() * 4)) {
            case 0:
                answers.cost = "archived";
                gemsHTML = archivedHTML;
                break;
            
            case 1:
                answers.type = "archived";
                answers.absent = "archived";
                answers.excess = "archived";
                typesHTML= archivedHTML;
                break;
            
            case 2:
                answers.rarity = "archived";
                rarityHTML = archivedHTML;
                break;
            
            case 3:
                answers.entrances = "archived";
                entrancesHTML = archivedHTML;
                break;
        }
    }

    // Adding guess results to share string
    shareString += answerToEmoji(answers.cost) + answerToEmoji(answers.absent) + answerToEmoji(answers.excess) + answerToEmoji(answers.rarity) + answerToEmoji(answers.entrances) + '\n';

    // Initializing ending if guessed correctly
    if (correctFloorplan.name === name && !puzzleMode && !guessingDisabled) {
        disableGuessing();
        setTimeout(function() {
            initEnding("SUCCESS");
        }, 1500);
    }

    //Creating new entry element
    const newEntryElement = document.createElement("div");
    newEntryElement.classList.add("floorplan-entry");
    newEntryElement.style.visibility = "hidden";
    newEntryElement.style.position = "absolute";
    newEntryElement.innerHTML = `
        <div class="flex-row">
            <img class="floorplan" src="./assets/floorplans/${name}.png">
            <div class="info-container">
                <div>${settings.colorblindIcons ? `<img class="answer-icon" src="./assets/${answers.cost}-cb.png">` : ""}<span class="${answers.cost}">COST</span><span class="colon">:</span>${gemsHTML}</div>
                <div>
                    ${settings.colorblindIcons ? `<img class="answer-icon" src="./assets/${answers.type}-cb.png">` : ""}<span class="${answers.type}">TYPE </span>
                    <span class="wrong" style="font-size: clamp(10px, 18px, 1.7vw)">(${settings.colorblindIcons ? `<img class="answer-icon" src="./assets/${answers.absent}-cb.png">` : ""}<span class="${answers.absent}">ABSENT</span> - ${settings.colorblindIcons ? `<img class="answer-icon" src="./assets/${answers.excess}-cb.png">` : ""}<span class="${answers.excess}">EXCESS</span>)</span><span class="colon">:</span>
                </div>
                <div>${typesHTML}</div>
                <div>
                    ${settings.colorblindIcons ? `<img class="answer-icon" src="./assets/${answers.rarity}-cb.png">` : ""}<span class="${answers.rarity}">RARITY</span><span class="colon">:</span>
                    ${rarityHTML}
                </div>
                <div>${settings.colorblindIcons ? `<img class="answer-icon" src="./assets/${answers.entrances}-cb.png">` : ""}<span class="${answers.entrances}">ENTRANCES</span><span class="colon">:</span>${entrancesHTML}</div>
            </div>
        </div>
        ${guessingDisabled || puzzleMode ? "" : hintText}
        ${guessingDisabled ? "" : `<img class="down-arrow" src="./assets/down arrow.png">`}
    `;

    // Adding new entry to the DOM with animation
    document.getElementById("floorplans-container").appendChild(newEntryElement);

    // Waiting for floorplan entry images to load
    const images = newEntryElement.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve;
        });
    });

    Promise.all(imagePromises).then(() => {
        const entryHeight = newEntryElement.offsetHeight;
        newEntryElement.style.position = "";
        newEntryElement.style.visibility = "";
        newEntryElement.style.height = "0";

        // Starting scroll in animation
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
    });
}

function disableGuessing() {
    guessingDisabled = true;
    newFloorplansButton.classList.add("hidden");
}

function answerToEmoji(answer) {
    switch(answer) {
        case "wrong":
            return "⬛ ";
        case "close":
            return "🟨 ";
        case "correct":
            return "🟩 ";
        case "archived":
            return "🟥 ";
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
const containers = ["letter", "kofi", "settings", "mode", "curse-note"];
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
    if (settings.sound && container !== "mode") {
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

    if ((container === "letter" || container === "kofi" || container == "curse-note") && open === true && !isGlassVisible) {
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
    if (page < 0 || page > finalPage) return;

    // Playing sfx
    if (settings.sound) {
        pageSFXlist[Math.floor(Math.random() * pageSFXlist.length)].play();
    }

    // Changing page
    letterPage = page;
    document.getElementById("intro-letter").src = `./assets/${mode === "dare" ? "dare-" : ""}letter${page}.png`;

    if (page === 0) {
        if (mode === "bequest") document.getElementById("stamp").classList.remove("hidden");
        prevButton.classList.add("disabled");
        prevButton.classList.remove("clickable");
    } else {
        if (mode === "bequest") document.getElementById("stamp").classList.add("hidden");
        prevButton.classList.remove("disabled");
        prevButton.classList.add("clickable");
    }

    if (page === finalPage) {
        if (mode === "bequest") {
            document.getElementById("new-clue-text").classList.remove("hidden");
        } else {
            document.getElementById("dare1").classList.remove("hidden");
            document.getElementById("dare2").classList.remove("hidden");
        }
        nextButton.classList.add("disabled");
        nextButton.classList.remove("clickable");
    } else {
        if (mode === "bequest") {
            document.getElementById("new-clue-text").classList.add("hidden");
        } else {
            document.getElementById("dare1").classList.add("hidden");
            document.getElementById("dare2").classList.add("hidden");
        }
        nextButton.classList.remove("disabled");
        nextButton.classList.add("clickable");
    }
}

if (debug || debugDay) {
    document.addEventListener("keydown", (event) => {
        if (event.key === "1") {
            initEnding("SUCCESS");
        }
    });
}

// Ending sequence when floorplan is correctly guessed or defeated
function initEnding(result) {
    if (endingOn) return;

    // Setting win state local data for curse/dare mode
    if (!endless) {
        if (mode !== "bequest") localData.lastDayEnded = daysSinceLaunch;
        if (mode === "dare") {
            localData.dare1Final = dare1State;
            localData.dare2Final = dare2State;
        }
        saveData();
    }

    // Dare mode final dares check
    if (mode === "dare") {
        let dareResult = dareEndingCheck(dare1);
        if (dareResult !== null) dare1State = dareResult;
        dareResult = dareEndingCheck(dare2);
        if (dareResult !== null) dare2State = dareResult;

        // Overriding ending if result doesn't match dare states
        if ((result === "SUCCESS" && ((!dare1State) || (!dare2State))) || (result === "DEFEAT" && dare1State && dare2State)) {
            if (dare1State && dare2State) {
                initEnding("SUCCESS");
            } else {
                initEnding("DEFEAT");
            }
            return;
        }
    }

    // Setting stats from local data and floorplan image to today's floorplan
    endingOn = true;
    const dayText = document.getElementById("day-text");
    if (endless) {
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
    document.getElementById("today-floorplan-text").innerText = endless ? "Chosen floorplan:" : "Today's floorplan:"
    document.getElementById("today-floorplan").src = `./assets/floorplans/${correctFloorplan.name}.png`;

    // Result text, hidden in bequest
    const resultText = document.getElementById("result-text");
    if (mode === "bequest") {
        resultText.classList.add("hidden");
    } else {
        resultText.innerText = result;
        if (result === "SUCCESS") {
            resultText.classList.add("blueprint");
        } else {
            resultText.classList.add("red-room");
        }
    }

    // Steps remaining stat in curse mode
    if (mode === "curse") {
        const stepsRemainging = document.getElementById("steps-remaining");
        document.getElementById("steps-remaining-text").classList.remove("hidden");
        stepsRemainging.innerText = steps > 0 ? steps : "none";
        if (steps <= 0) {
            stepsRemainging.classList.remove("ending-stat-num");
            stepsRemainging.classList.add("ending-special-text");
        } 
    }

    document.getElementById("guesses-num").innerText = currentGuesses.length;
    document.getElementById("average-num").innerText = endless || localData.wins === 0 ? "-" : Math.round(((localData.totalGuesses / localData.wins) + Number.EPSILON) * 10) / 10;
    document.getElementById("streak-num").innerText = endless ? "-" : localData.streak;

    // Adding final stats to share string
    shareString += currentGuesses.length.toString() + (currentGuesses.length === 1 ? " guess" : " guesses");
    if (mode === "curse" && steps > 0) shareString += " " + steps.toString() + " steps remaining" ;
    if (mode !== "bequest") shareString += " - " + result;

    // Resetting streak if lost
    if (result === "DEFEAT" && !endless) {
        localData.streak = 0;
        saveData();
    }

    // Playing ending music
    const endingMusic = result === "SUCCESS" ? callItADay : goodbyeToTheSea;
    if (settings.sound) {
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
    if (mode === "dare") {
        if (result === "DEFEAT") document.getElementById("dare-bird").classList.remove("hidden");
        if (!dare1State) document.getElementById("dare1-ending").classList.add("dare-failed");
        if (!dare2State) document.getElementById("dare2-ending").classList.add("dare-failed");
        setTimeout(function() {
            document.getElementById("dare-ending-container").style.opacity = 1;
        }, 4900);
    }

    // Fading away when exit button is pressed
    document.getElementById("ending-exit-button").addEventListener("click", () => {
        endingScreen.style.opacity = 0;
        setTimeout(function() {
            endingScreen.classList.add("hidden");
            endingOn = false;
        }, 1000);

        // Fading out music
        if (settings.sound) {
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
        if (settings.sound) exitSFX.play();

        // Showing copied text
        if (copiedTimer) clearTimeout(copiedTimer);
        document.getElementById("copied-text").classList.remove("hidden");
        copiedTimer = setTimeout(() => {
            document.getElementById("copied-text").classList.add("hidden");
        }, 2000);
        return;
    });
    document.getElementById("ending-discord-button").addEventListener("click", () => {
        const lines = shareString.split('\n');
        for(let i = 0; i < lines.length; i++) {
            if (i !== 0 && i !== 1 && i !== lines.length - 1) {
                const fp = floorplans.find(fp => fp.name === currentGuesses[i-2]);
                if (fp) lines[i] = lines[i] + " ||" + fp.displayName + "||";
            }
        }
        navigator.clipboard.writeText(lines.join('\n'));

        // Playing sfx
        if (settings.sound) exitSFX.play();

        // Showing copied text
        if (copiedTimer) clearTimeout(copiedTimer);
        document.getElementById("copied-text").classList.remove("hidden");
        copiedTimer = setTimeout(() => {
            document.getElementById("copied-text").classList.add("hidden");
        }, 2000);
        return;
    });
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

    // Arrays to store CSS properties for multiple layers
    const bgImages = [];
    const bgSizes = [];
    const bgPositions = [];
    Array.from(document.querySelectorAll(".zoomable")).reverse().forEach(img => {
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
            // Applying mask to original image
            const mask = `radial-gradient(circle ${lensRadius - 2}px at ${xOnImage}px ${yOnImage}px, transparent 99%, black 100%)`;
            img.style.webkitMaskImage = mask;
            img.style.maskImage = mask;

            // Checking if zoomed view is withing lens
            if ((bgX + imgRect.width * zoomLevel) > 0 && bgX < lensEffect.offsetWidth && (bgY + imgRect.height * zoomLevel) > 0 && bgY < lensEffect.offsetHeight) {
                bgImages.push(`url('${img.src}')`);
                bgSizes.push(`${imgRect.width * zoomLevel}px ${imgRect.height * zoomLevel}px`);
                bgPositions.push(`${bgX}px ${bgY}px`);
            }
        } else {
            // Removing mask if there's no overlap
            img.style.webkitMaskImage = "none";
            img.style.maskImage = "none";
        }
    });

    // Applying combined layers to the lens
    if (bgImages.length > 0) {
        lensEffect.style.backgroundImage = bgImages.join(", ");
        lensEffect.style.backgroundSize = bgSizes.join(", ");
        lensEffect.style.backgroundPosition = bgPositions.join(", ");
    } else {
        lensEffect.style.backgroundImage = "none";
    }
}


function daresCheck(dare) {
    return dare1 === dare || dare2 === dare;
}

// Dare check per guess
const colors = ["Red Room", "Green Room", "Hallway", "Bedroom", "Shop", "Blackprint", "Blueprint"];
function dareFloorplanCheck(dare, floorplan) {
    switch(dare) {
        case "b2bColors":
            if(prevFloorplan && floorplan.types.filter((type) => prevFloorplan.types.filter((x) => colors.includes(x)).includes(type)).length) return false;
            break;
        
        case "singleBedroom":
            let numBedrooms = 0;
            currentGuesses.forEach((guess) => {
                if (floorplans.find(fp => fp.name === guess).types.includes("Bedroom")) numBedrooms++;
            });
            if (numBedrooms > 1) return false;
            break;
        
        case "yesterdayRooms":
            if (yesterdayFloorplans.includes(floorplan.name)) return false;
            break;
        
        case "exactRedRooms":
            let numRedRooms = 0;
            currentGuesses.forEach((guess) => {
                if (floorplans.find(fp => fp.name === guess).types.includes("Red Room")) numRedRooms++;
            });
            if (numRedRooms === 2) return true;
            if (numRedRooms > 2) return false;
            break;
        
        case "noSafeOrLever":
        case "noUpgrades":
        case "noSingleType":
        case "sixColors":
        case "noTypeIcon":
        case "no3Types":
        case "noDucts":
            if (dare !== "" && dares.find(x => x.name === dare).incompatibleRooms.includes(floorplan.name)) return false;
            break;
        
        case "lavatoryWait":
            if (floorplan.name === "lavatory") setTimeout(() => startLavatoryTimer(), 50);
            break;
        
        case "dupeFirstLetters":
            if (floorplan.name === correctFloorplan.name) return null;

            const letters = [];
            currentGuesses.forEach((guess) => {
                letters.push(guess[0]);
            });

            const counts = {};
            let numDuplicates = 0;
            for (const char of letters) {
                counts[char] = (counts[char] || 0) + 1;
                if (counts[char] > 1) numDuplicates++;
            }
            
            if (numDuplicates > 0) return false;
            break;
        
        case "singleCostDiff":
            if (prevFloorplan && Math.abs(floorplan.cost - prevFloorplan.cost) !== 1) return false;
            break;
        
        case "startEntrance":
            if (currentGuesses.length === 1) {
                if (floorplan.name === "entrancehall") {
                    return true;
                } else {
                    return false;
                }
            }
            break;
        
        case "totalCost":
            let totalCost = 0;
            currentGuesses.forEach((guess) => {
                totalCost += floorplans.find(fp => fp.name === guess).cost;
            });
            if (totalCost > 8) return false;
            break;
        
        case "limitedRarities":
            let rarities = [];
            currentGuesses.forEach((guess) => {
                const roomRarity = floorplans.find(fp => fp.name === guess).rarity
                if (!rarities.includes(roomRarity)) rarities += roomRarity;
            });
            if (rarities.length > 3) return false;
            break;

        case "diffEntrances":
            if(prevFloorplan && floorplan.entrances === prevFloorplan.entrances) return false;
            break;
        
        case "keepGreen":
            const len = answersList.length - 1;
            if(len === 0) return null;
            if (answersList[len - 1].cost === "correct" && answersList[len].cost !== "correct") return false;
            if (answersList[len - 1].type === "correct" && answersList[len].type !== "correct") return false;
            if (answersList[len - 1].rarity === "correct" && answersList[len].rarity !== "correct") return false;
            if (answersList[len - 1].entrances === "correct" && answersList[len].entrances !== "correct") return false;
            break;
    }
    return null;
}


// Dare final check at ending
function dareEndingCheck(dare) {
    switch(dare) {
        case "allRarities":
            const rarities = [];
            currentGuesses.forEach((guess) => {
                rarities.push(floorplans.find(fp => fp.name === guess).rarity);
            });
            return rarities.includes(1) && rarities.includes(2) && rarities.includes(3) && rarities.includes(4);
        
        case "hint":
            return hints > 0;
        
        case "deadEndEquals":
            let deadEndTally = 0;
            currentGuesses.forEach((guess) => {
                if (floorplans.find(fp => fp.name === guess).types.includes("Dead End")) {
                    deadEndTally++;
                } else {
                    deadEndTally--;
                }
            });
            return deadEndTally === 0;
        
        case "sixColors":
            const colorsTracker = [];
            currentGuesses.forEach((guess) => {
                floorplans.find(fp => fp.name === guess).types.filter((x) => colors.includes(x)).forEach((color) => {
                    if (!colorsTracker.includes(color)) colorsTracker.push(color);
                });
            });
            return colorsTracker.length >= 6;
        
        case "curseMode":
            const curseData = JSON.parse(localStorage.getItem('curseData'));
            return curseData && curseData.lastDayEnded === daysSinceLaunch;
        
        case "chess":
            const chessTracker = [];
            currentGuesses.forEach((guess) => {
                if (!chessTracker.includes(0) && ["parlor", "funeralparlor", "walkincloset", "storeroom", "den", "drawingroom", "draftingstudio", "freezer", "diningroom", "bedroom", "guestbedroom", "questbedroom", "nursery", "nursesstation", "indoornursery", "bunkroom", "secretpassage", "solarium", "dormitory", "lostfound"].includes(guess)) chessTracker.push(0);
                if (!chessTracker.includes(1) && ["security", "observatory", "thearmory", "treasuretrove"].includes(guess)) chessTracker.push(1);
                if (!chessTracker.includes(2) && ["attic", "rumpusroom", "bookshop", "chapel"].includes(guess)) chessTracker.push(2);
                if (!chessTracker.includes(3) && ["nook", "readingnook", "vault", "clocktower", "conservatory"].includes(guess)) chessTracker.push(3);
                if (!chessTracker.includes(4) && ["study", "herladyshipschamber"].includes(guess)) chessTracker.push(4);
                if (!chessTracker.includes(5) && ["office", "throneroom", "throneoftheblueprince"].includes(guess)) chessTracker.push(5);
            });
            if (chessTracker.length >= 3) return true;
            break;
            
    }
    return null;
}


function startLavatoryTimer() {
    const lavatoryDare = dare1 === "lavatoryWait" ? 1 : 2;
    let timePassed = false;
    const lavatoryTimer = setTimeout(() => {
        dare1 === "lavatoryWait" ? dare1State = true : dare2State = true;
        timePassed = true;
    }, 30000);
    document.addEventListener("click", () => {
        if (!timePassed) {
            hideDraftSelect();
            disableGuessing();
            initEnding("DEFEAT");
            clearTimeout(lavatoryTimer);
            timePassed = true;
        }
    });
    document.addEventListener("keydown", () => {
        if (!timePassed) {
            hideDraftSelect();
            disableGuessing();
            initEnding("DEFEAT");
            clearTimeout(lavatoryTimer);
            timePassed = true;
        }
    });
}


function saveData() {
    localStorage.setItem(mode + 'Data', JSON.stringify(localData));
    localStorage.setItem('settings', JSON.stringify(settings));
}