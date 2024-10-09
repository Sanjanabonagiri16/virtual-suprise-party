// Add these imports at the top of the file
const THREE = require('three');
const { gsap } = require('gsap');

// Add this at the beginning of the file
const gameList = [
    { name: "Scavenger Hunt", icon: "🔍" },
    { name: "Trivia Quiz", icon: "❓" },
    { name: "Pictionary", icon: "🎨" },
    { name: "Two Truths and a Lie", icon: "🤥" },
    { name: "Virtual Karaoke", icon: "🎤" },
    { name: "Charades", icon: "🎭" }
];

let currentIndex = 0;

function createGameCards() {
    const track = document.querySelector('.carousel-track');
    const angleIncrement = 360 / gameList.length;

    gameList.forEach((game, index) => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <div class="game-icon">${game.icon}</div>
            <h3>${game.name}</h3>
            <p class="game-description">${game.description}</p>
        `;
        card.style.transform = `rotateY(${index * angleIncrement}deg) translateZ(300px)`;
        track.appendChild(card);

        card.addEventListener('click', () => selectGame(index));
        
        // Add 3D hover effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                scale: 1.1,
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                duration: 0.5
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                duration: 0.5
            });
        });
    });
}

function rotateCarousel(index) {
    const track = document.querySelector('.carousel-track');
    const angle = index * -(360 / gameList.length);
    track.style.transform = `rotateY(${angle}deg)`;
}

function selectGame(index) {
    const cards = document.querySelectorAll('.game-card');
    cards.forEach((card, i) => {
        card.classList.toggle('selected', i === index);
        if (i === index) {
            gsap.to(card, {
                scale: 1.2,
                boxShadow: '0 0 30px rgba(255,255,255,0.8)',
                duration: 0.5
            });
        } else {
            gsap.to(card, {
                scale: 1,
                boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                duration: 0.5
            });
        }
    });
    currentIndex = index;
    rotateCarousel(index);

    // Initialize the selected game
    const gameName = gameList[index].name.toLowerCase().replace(/\s+/g, '');
    const game = games[gameName];
    if (game) {
        const gameArea = document.getElementById('gameArea');
        const gameTitle = document.getElementById('gameTitle');
        const gameContent = document.getElementById('gameContent');
        const gameControls = document.getElementById('gameControls');

        gsap.to(gameArea, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            onStart: () => {
                gameArea.style.display = 'block';
                gameTitle.textContent = game.title;
                gameContent.innerHTML = '';
                gameControls.innerHTML = '';
            },
            onComplete: () => {
                game.init(gameContent, gameControls);
            }
        });
    }
}

// Modify the existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    createGameCards();
    rotateCarousel(currentIndex);

    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + gameList.length) % gameList.length;
        rotateCarousel(currentIndex);
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % gameList.length;
        rotateCarousel(currentIndex);
    });

    // Add touch and drag functionality
    let startX, startY, startTime;
    const carousel = document.querySelector('.game-carousel');

    carousel.addEventListener('touchstart', handleTouchStart, false);
    carousel.addEventListener('touchmove', handleTouchMove, false);
    carousel.addEventListener('mousedown', handleMouseDown, false);

    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = new Date().getTime();
    }

    function handleMouseDown(e) {
        startX = e.clientX;
        startY = e.clientY;
        startTime = new Date().getTime();
        document.addEventListener('mousemove', handleMouseMove, false);
        document.addEventListener('mouseup', handleMouseUp, false);
    }

    function handleTouchMove(e) {
        if (!startX || !startY) return;
        const endX = e.touches[0].clientX;
        const endY = e.touches[0].clientY;
        handleSwipe(endX, endY);
    }

    function handleMouseMove(e) {
        if (!startX || !startY) return;
        const endX = e.clientX;
        const endY = e.clientY;
        handleSwipe(endX, endY);
    }

    function handleMouseUp() {
        startX = null;
        startY = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    function handleSwipe(endX, endY) {
        const diffX = startX - endX;
        const diffY = startY - endY;
        const elapsedTime = new Date().getTime() - startTime;

        if (elapsedTime <= 300) {
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    currentIndex = (currentIndex + 1) % gameList.length;
                } else {
                    currentIndex = (currentIndex - 1 + gameList.length) % gameList.length;
                }
                rotateCarousel(currentIndex);
            }
        }
        startX = null;
        startY = null;
    }

    // Add dynamic shadows and lighting
    function addDynamicLighting() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.querySelector('.game-carousel').appendChild(renderer.domElement);

        const light = new THREE.PointLight(0xffffff, 1, 1000);
        light.position.set(0, 0, 50);
        scene.add(light);

        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            light.position.set(x * 50, y * 50, 50);
        });

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    }

    addDynamicLighting();
});

// Game implementations
const games = {
    scavengerHunt: {
        title: "Virtual Scavenger Hunt",
        init: function(gameContent, gameControls) {
            const items = ["A book", "A spoon", "A plant", "Something red", "A pair of socks"];
            let foundItems = 0;

            gameContent.innerHTML = `
                <div class="timer">Time: <span id="timer">60</span>s</div>
                <ul class="item-list">
                    ${items.map(item => `<li>${item} <button class="found-button">Found</button></li>`).join('')}
                </ul>
            `;

            gameControls.innerHTML = `
                <button id="startScavengerHunt">Start Hunt</button>
            `;

            let timer;
            document.getElementById('startScavengerHunt').addEventListener('click', function() {
                this.disabled = true;
                timer = setInterval(() => {
                    let time = parseInt(document.getElementById('timer').textContent);
                    if (time > 0) {
                        document.getElementById('timer').textContent = time - 1;
                    } else {
                        clearInterval(timer);
                        alert("Time's up! You found " + foundItems + " items.");
                    }
                }, 1000);
            });

            gameContent.querySelectorAll('.found-button').forEach(button => {
                button.addEventListener('click', function() {
                    this.disabled = true;
                    this.textContent = "✓";
                    foundItems++;
                    if (foundItems === items.length) {
                        clearInterval(timer);
                        alert("Congratulations! You found all items!");
                    }
                });
            });
        }
    },
    trivia: {
        title: "Trivia Quiz",
        init: function(gameContent, gameControls) {
            const questions = [
                {
                    question: "What is the capital of France?",
                    options: ["London", "Berlin", "Paris", "Madrid"],
                    answer: 2
                },
                {
                    question: "Who painted the Mona Lisa?",
                    options: ["Van Gogh", "Da Vinci", "Picasso", "Rembrandt"],
                    answer: 1
                }
            ];
            let currentQuestion = 0;
            let score = 0;

            function displayQuestion() {
                const q = questions[currentQuestion];
                gameContent.innerHTML = `
                    <div class="score">Score: ${score}</div>
                    <h4>${q.question}</h4>
                    ${q.options.map((option, index) => `
                        <button class="answer-button" data-index="${index}">${option}</button>
                    `).join('')}
                `;

                gameContent.querySelectorAll('.answer-button').forEach(button => {
                    button.addEventListener('click', function() {
                        if (parseInt(this.dataset.index) === q.answer) {
                            score++;
                            this.style.backgroundColor = 'green';
                        } else {
                            this.style.backgroundColor = 'red';
                        }
                        setTimeout(() => {
                            currentQuestion++;
                            if (currentQuestion < questions.length) {
                                displayQuestion();
                            } else {
                                gameContent.innerHTML = `<h4>Quiz completed! Your score: ${score}/${questions.length}</h4>`;
                            }
                        }, 1000);
                    });
                });
            }

            displayQuestion();
        }
    },
    pictionary: {
        title: "Pictionary",
        init: function(gameContent, gameControls) {
            gameContent.innerHTML = `
                <canvas id="drawingBoard" class="drawing-board" width="500" height="300"></canvas>
                <div>
                    <input type="color" id="colorPicker" value="#000000">
                    <input type="range" id="brushSize" min="1" max="20" value="5">
                </div>
            `;

            gameControls.innerHTML = `
                <button id="clearCanvas">Clear Canvas</button>
                <button id="newWord">New Word</button>
            `;

            const canvas = document.getElementById('drawingBoard');
            const ctx = canvas.getContext('2d');
            let isDrawing = false;

            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseout', stopDrawing);

            document.getElementById('clearCanvas').addEventListener('click', () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            });

            document.getElementById('newWord').addEventListener('click', () => {
                alert("Your word is: " + getRandomWord());
            });

            function startDrawing(e) {
                isDrawing = true;
                draw(e);
            }

            function draw(e) {
                if (!isDrawing) return;
                ctx.lineWidth = document.getElementById('brushSize').value;
                ctx.lineCap = 'round';
                ctx.strokeStyle = document.getElementById('colorPicker').value;

                ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
            }

            function stopDrawing() {
                isDrawing = false;
                ctx.beginPath();
            }

            function getRandomWord() {
                const words = ['Apple', 'House', 'Car', 'Dog', 'Tree', 'Sun', 'Book', 'Chair'];
                return words[Math.floor(Math.random() * words.length)];
            }
        }
    },
    twoTruthsLie: {
        title: "Two Truths and a Lie",
        init: function(gameContent, gameControls) {
            gameContent.innerHTML = `
                <textarea id="statements" rows="3" placeholder="Enter two truths and a lie, separated by new lines"></textarea>
                <button id="submitStatements">Submit</button>
                <div id="guessArea" style="display: none;">
                    <h4>Guess which statement is the lie:</h4>
                    <div id="statementButtons"></div>
                </div>
            `;

            document.getElementById('submitStatements').addEventListener('click', function() {
                const statements = document.getElementById('statements').value.split('\n');
                if (statements.length !== 3) {
                    alert("Please enter exactly three statements.");
                    return;
                }
                
                const guessArea = document.getElementById('guessArea');
                const statementButtons = document.getElementById('statementButtons');
                guessArea.style.display = 'block';
                statementButtons.innerHTML = statements.map((statement, index) => 
                    `<button class="statement-button" data-index="${index}">${statement}</button>`
                ).join('');

                statementButtons.querySelectorAll('.statement-button').forEach(button => {
                    button.addEventListener('click', function() {
                        alert("You guessed statement " + (parseInt(this.dataset.index) + 1) + " is the lie!");
                    });
                });
            });
        }
    },
    karaoke: {
        title: "Virtual Karaoke",
        init: function(gameContent, gameControls) {
            gameContent.innerHTML = `
                <div class="karaoke-player">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                </div>
                <button id="nextSong">Next Song</button>
            `;

            document.getElementById('nextSong').addEventListener('click', function() {
                alert("Loading next song... (In a real implementation, this would load a new karaoke track)");
            });
        }
    },
    charades: {
        title: "Charades",
        init: function(gameContent, gameControls) {
            const words = ['Movie', 'Book', 'TV Show', 'Song', 'Animal', 'Sport'];
            let currentWord = '';

            gameContent.innerHTML = `
                <div class="timer">Time: <span id="charadeTimer">60</span>s</div>
                <h4 id="charadeWord"></h4>
            `;

            gameControls.innerHTML = `
                <button id="newCharade">New Word</button>
                <button id="startCharadeTimer">Start Timer</button>
            `;

            document.getElementById('newCharade').addEventListener('click', function() {
                currentWord = words[Math.floor(Math.random() * words.length)];
                document.getElementById('charadeWord').textContent = currentWord;
            });

            document.getElementById('startCharadeTimer').addEventListener('click', function() {
                let time = 60;
                const timerElement = document.getElementById('charadeTimer');
                const timer = setInterval(() => {
                    time--;
                    timerElement.textContent = time;
                    if (time <= 0) {
                        clearInterval(timer);
                        alert("Time's up!");
                    }
                }, 1000);
            });
        }
    }
};