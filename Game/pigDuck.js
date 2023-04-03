const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win'),
    back: document.querySelector('.card-back'),
    responseContainer: document.getElementById('response')
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}



const shuffle = array => {
    const clonedArray = [...array]

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedArray[index]

        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}

  //Random generator
const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        
        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}

const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension')

    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.")
    }

    //Card images
    var images = ["axe",
"bow",
"cannon",
"flail",
"knife",
"molotov",
"rocket",
"spear"];


    //Cards
    const picks = pickRandom(images, (dimensions * dimensions) / 2) 
    const items = shuffle([...picks, ...picks])
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card" data-card="${item}">
                    <div class="card-front"></div>
                    <div class="card-back" style="background-image: url(${item}.png)"></div>
                </div>
            `).join('')}
       </div>
    `

    const parser = new DOMParser().parseFromString(cards, 'text/html')
    selectors.board.replaceWith(parser.querySelector('.board'))
}

const startGame = () => {
    state.gameStarted = true
    selectors.start.classList.add('disabled')

    state.loop = setInterval(() => {
        state.totalTime++

        selectors.moves.innerText = `${state.totalFlips} moves`
        selectors.timer.innerText = `time: ${state.totalTime} sec`
    }, 1000)
}

    //Match response
let good = ["Good for you I guess",
    "Finally.",
    "Took you long enough.",
    "There ya go.",
    "Well that wasn't so hard was it?",
    "Wow, so you do have a brain then.",
    "I'd clap for you, but who would hold my knives?",
    "See, it's not rigged. You just suck.",
    "At this rate, I'll be back in an hour.",
    "It wouldn't be a game of luck if you were smart.",
    "Let's play hide and seek. You hide.",
    "Good job. You can match.",
    "Hurry up so I can leave.",
    "Yes, let's get on with it already.",
    "Wow. Just. Wow.",
    "Surprising. You actually made a match.",
    "I was starting to lose hope you'd ever make it.",
    "It's a wonder you're not a rocket scientist.",
    "This was coded quicker than you made a match."
    ]


    //No match response
let bad = ["You suck.",
    "Do better.",
    "Be better.",
    "Nope.",
    "Not even close.",
    "As if.",
    "Are you even trying?",
    "Still no.",
    "*zzzzzzzzz*",
    "Oh, you're still here?",
    "Give up.",
    "You know, you're not very good at this.",
    "It almost hurts to watch.",
    "No!",
    "Please, make it stop.",
    "Come on! This is so easy.",
    "Still. Not. A. Match.",
    "I'm convinced you don't even care anymore.",
    "It really isn't that difficult.",
    "Well, this is boring.",
    "Grass growing would be more entertaining.",
    "It's like watching paint dry.",
    "Matching games are for preschoolers...",
    "So you're not smarter than a kindergartner?",
    "Only 8 weapons and you can't figure it out.",
    "Aren't humans supposed to be intelligent?",
    "Got skills? Um nope.",
    "Oof, you should ask your mom for help.",
    "Do the directions confuse you or something?",
    "Step 1: Match the pictures. That's it.",
    "Can you even tie your shoe?",
    "Geez, go back to kindergarten!",
    "No, you're supposed to match the cards.",
    "The longer you take, the more time we share.",
    "I can hear you getting dumber.",
    "I'm sure you have other qualities, not smarts.",
    "Maybe we should just try the 2 block version."
]

const response = (emotion) => {
    return emotion[Math.floor(Math.random() * emotion.length)];
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0

}

const flipCard = card => {
    state.flippedCards++
    state.totalFlips++

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }


    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')
        selectors.board

        if (flippedCards[0].getAttribute('data-card') === flippedCards[1].getAttribute('data-card')) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
            selectors.responseContainer.innerText = response(good);
        } else {
            selectors.responseContainer.innerText = response(bad);
        }



        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    //Win response Text
    let winText = ["Wow, you impressed me. Then again, the bar was set very, VERY low.",
    "Well, that was painful. Please, don't come back.",
    "Congrats. 100 years later and you finally beat the game.",
    "I've never met anyone worse at this, but I suppose you made it...",
    "Yikes, that was a rough one. I mean, good job Champ!",
    "'Winning' doesn't seem like the right word for whatever you just did.",
    "I'd congratulate you but we both know you don't deserve that.",
    "Did you finally give up and just press random buttons?",
    "Great. You know this is timed, right?",
    "Roses are red. Violets are blue. You suck, and you're stupid too!",
    "Maybe timing you with a calendar would be more appropriate.",
    "I had enough time to read the entire dictionary. 'Boring' really stood out to me."
    ]

    let winResponse = winText[Math.floor(Math.random() * winText.length)];

    // If there are no more cards that we can flip, we won the game
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    ${winResponse}<br />
                    <span class="highlight">${state.totalFlips}</span> moves<br />
                    <span class="highlight">${state.totalTime}</span> seconds
                </span>
            `

            clearInterval(state.loop)
        }, 1000)
    }
}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
    })
}

generateGame()
attachEventListeners()