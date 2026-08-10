const viewport = document.getElementById("viewport");
const world = document.getElementById("world");
const cart = document.getElementById("minecart");
const lever = document.getElementById("startLever");

const sections = [
    { name: "About", x: 850 },
    { name: "Projects", x: 1750 },
    { name: "Journey", x: 2650 },
    { name: "Skills", x: 3550 },
    { name: "Contact", x: 4450 },
    { name: "Letter", x: 5350 }
];

const CART_START = 250;
const CART_WIDTH = 190;

const MOVE_TIME = 2800;
const STOP_TIME = 8000;

let running = false;
let currentIndex = 0;
let timer = null;

function getCartCenter(x) {
    return x + CART_WIDTH / 2;
}

function getCameraOffset(cartX) {
    const cartCenter = getCartCenter(cartX);
    const screenCenter = window.innerWidth / 2;

    return screenCenter - cartCenter;
}

function setCamera(cartX, duration = 0) {
    const offset = getCameraOffset(cartX);

    world.style.transition =
        duration === 0
            ? "none"
            : `transform ${duration}ms cubic-bezier(.22,.61,.36,1)`;

    world.style.transform =
        `translate3d(${offset}px,0,0)`;
}

function setCart(x, duration = 0) {
    cart.style.transition =
        duration === 0
            ? "none"
            : `left ${duration}ms cubic-bezier(.22,.61,.36,1)`;

    cart.style.left = `${x}px`;
}

function positionStart() {
    setCart(CART_START, 0);
    setCamera(CART_START, 0);
}

function moveToSection(section) {
    const cartX = section.x - CART_WIDTH / 2;

    setCart(cartX, MOVE_TIME);
    setCamera(cartX, MOVE_TIME);
}

function startJourney() {
    if (running) return;

    running = true;
    currentIndex = 0;

    clearTimeout(timer);

    if (lever) {
        lever.setAttribute("aria-pressed", "true");
    }

    moveNext();
}

function moveNext() {
    if (!running) return;

    if (currentIndex >= sections.length) {
        finishJourney();
        return;
    }

    const section = sections[currentIndex];

    moveToSection(section);

    currentIndex++;

    timer = setTimeout(() => {
        moveNext();
    }, MOVE_TIME + STOP_TIME);
}

function finishJourney() {
    running = false;

    clearTimeout(timer);

    if (lever) {
        lever.setAttribute("aria-pressed", "false");
    }
}

if (lever) {
    lever.addEventListener("click", startJourney);
}

window.addEventListener("resize", () => {
    if (!running && cart) {
        const currentCart =
            parseFloat(cart.style.left) || CART_START;

        setCamera(currentCart, 0);
    }
});

positionStart();

