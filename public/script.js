const { gsap } = require('gsap');

// Add this code near the beginning of your script.js file
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(function(error) {
            console.log('Service Worker registration failed:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.getElementById('chatButton');
    const chatWindow = document.getElementById('chatWindow');
    const closeChatButton = document.getElementById('closeChatButton');
    const chatInput = document.getElementById('chatInput');
    const sendMessageButton = document.getElementById('sendMessageButton');
    const chatMessages = document.getElementById('chatMessages');

    // Add this new code for mobile chat functionality
    const isMobile = window.innerWidth <= 768;
    const chatHeader = document.querySelector('.chat-header');

    if (isMobile) {
        chatHeader.addEventListener('click', toggleChatMinimize);
    }

    function toggleChatMinimize() {
        chatWindow.classList.toggle('minimized');
    }

    function openChat() {
        chatWindow.classList.add('open');
        if (isMobile) {
            chatWindow.classList.remove('minimized');
        }
    }

    function closeChat() {
        if (isMobile) {
            chatWindow.classList.add('minimized');
        } else {
            chatWindow.classList.remove('open');
        }
    }

    // Update existing event listeners
    chatButton.addEventListener('click', openChat);
    closeChatButton.addEventListener('click', closeChat);

    sendMessageButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            const messageElement = document.createElement('p');
            messageElement.textContent = message;
            chatMessages.appendChild(messageElement);
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Initialize parallax effect
    const scene = document.querySelector('.parallax-container');
    const parallaxInstance = new Parallax(scene);

    // Mouse movement effect
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        const depth = 15; // Adjust this value to increase or decrease the effect
        const moveX = (mouseX - 0.5) * depth;
        const moveY = (mouseY - 0.5) * depth;

        gsap.to('.introduction', {
            x: moveX,
            y: moveY,
            duration: 0.5,
            ease: 'power2.out'
        });
    });

    // Staggered animation for party buttons
    gsap.from('.party-button', {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.party-buttons',
            start: 'top 80%'
        }
    });

    // Initialize particles.js
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#ffffff'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#ffffff',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 6,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 400,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });

    // Add this code near the beginning of your existing DOMContentLoaded event listener
    const createPartyButton = document.querySelector('.create-party');
    const modal = document.getElementById('createPartyModal');
    const closeButton = modal.querySelector('.close');
    const createPartyForm = document.getElementById('createPartyForm');

    createPartyButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    createPartyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically send the form data to your backend
        // For now, we'll just log it to the console
        const formData = new FormData(createPartyForm);
        const partyData = Object.fromEntries(formData);
        console.log('Party Data:', partyData);

        // Close the modal after submission
        modal.style.display = 'none';

        // Optionally, you can reset the form
        createPartyForm.reset();
    });

    // Add this code to dynamically update the max participants based on the selected platform
    const videoPlatform = document.getElementById('videoPlatform');
    const participantCount = document.getElementById('participantCount');

    videoPlatform.addEventListener('change', () => {
        switch(videoPlatform.value) {
            case 'zoom':
                participantCount.max = 100;
                break;
            case 'google-meet':
                participantCount.max = 250;
                break;
            case 'skype':
                participantCount.max = 50;
                break;
            default:
                participantCount.max = 100;
        }
        participantCount.value = Math.min(participantCount.value, participantCount.max);
    });

    // Add this code inside your existing DOMContentLoaded event listener
    const partyTheme = document.getElementById('partyTheme');
    const giftOption = document.getElementById('giftOption');

    partyTheme.addEventListener('change', () => {
        updateThemeBasedElements(partyTheme.value);
    });

    function updateThemeBasedElements(theme) {
        // You can customize this function to update other elements based on the selected theme
        const body = document.body;
        body.className = ''; // Reset any existing theme classes
        body.classList.add(`theme-${theme}`);

        // Update gift options based on the theme
        while (giftOption.options.length > 1) {
            giftOption.remove(1);
        }

        const themeGifts = {
            birthday: ['Virtual Gift Card', 'Custom Birthday Video', 'Digital Birthday Card'],
            anniversary: ['Virtual Romantic Getaway', 'Custom Anniversary Video', 'Digital Photo Album'],
            christmas: ['Virtual Christmas Card', 'Custom Santa Video', 'Digital Christmas Ornament'],
            diwali: ['Virtual Diya Lighting', 'Custom Diwali Greetings Video', 'Digital Rangoli Art'],
            summer: ['Virtual Beach Day', 'Custom Summer Playlist', 'Digital Summer Scrapbook'],
            winter: ['Virtual Snowball Fight', 'Custom Winter Wonderland Video', 'Digital Snowflake Art'],
            custom: ['Virtual Gift Card', 'Custom Video Message', 'Digital Artwork', 'Personalized Playlist', 'Donation to Charity']
        };

        const gifts = themeGifts[theme] || themeGifts.custom;
        gifts.forEach(gift => {
            const option = new Option(gift, gift.toLowerCase().replace(/\s+/g, '-'));
            giftOption.add(option);
        });
    }

    createPartyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(createPartyForm);
        const partyData = Object.fromEntries(formData);
        
        // Handle multiple selected games
        partyData.games = formData.getAll('games');

        console.log('Party Data:', partyData);

        // Here you would typically send the data to your backend
        // For now, we'll just display a success message
        displaySuccessMessage(partyData);

        // Close the modal after submission
        modal.style.display = 'none';

        // Reset the form
        createPartyForm.reset();
    });

    function displaySuccessMessage(partyData) {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <h3>Party Created Successfully!</h3>
            <p>Party Name: ${partyData.partyName}</p>
            <p>Theme: ${partyData.partyTheme}</p>
            <p>Games: ${partyData.games.join(', ')}</p>
            <p>Surprise Message will be revealed at: ${partyData.surpriseTime}</p>
            <p>Virtual Gift: ${partyData.giftOption}</p>
        `;

        document.body.appendChild(successMessage);

        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    // Initialize the theme-based elements
    updateThemeBasedElements(partyTheme.value);

    // Add these variables at the beginning of your script
    const countdownOverlay = document.getElementById('countdownOverlay');
    const countdownElement = document.getElementById('countdown');
    const privateCapsuleOverlay = document.getElementById('privateCapsuleOverlay');
    const capsuleMessageElement = document.getElementById('capsuleMessage');
    const closeCapsuleButton = document.getElementById('closeCapsuleButton');

    // Modify the createPartyForm submit event listener
    createPartyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(createPartyForm);
        const partyData = Object.fromEntries(formData);
        
        // Handle multiple selected games
        partyData.games = formData.getAll('games');

        console.log('Party Data:', partyData);

        // Close the modal after submission
        modal.style.display = 'none';

        // Start the countdown
        startCountdown(partyData.privateCapsuleMessage);

        // Reset the form
        createPartyForm.reset();
    });

    function startCountdown(capsuleMessage) {
        let timeLeft = 15;
        countdownOverlay.style.display = 'flex';

        const countdownInterval = setInterval(() => {
            countdownElement.textContent = timeLeft;
            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(countdownInterval);
                countdownOverlay.style.display = 'none';
                showPrivateCapsuleMessage(capsuleMessage);
            }
        }, 1000);
    }

    function showPrivateCapsuleMessage(message) {
        capsuleMessageElement.textContent = message || "No private message set for this party.";
        privateCapsuleOverlay.style.display = 'flex';
    }

    closeCapsuleButton.addEventListener('click', () => {
        privateCapsuleOverlay.style.display = 'none';
    });

    // Add this to your existing displaySuccessMessage function
    function displaySuccessMessage(partyData) {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <h3>Party Created Successfully!</h3>
            <p>Party Name: ${partyData.partyName}</p>
            <p>Theme: ${partyData.partyTheme}</p>
            <p>Games: ${partyData.games.join(', ')}</p>
            <p>Surprise Message will be revealed at: ${partyData.surpriseTime}</p>
            <p>Virtual Gift: ${partyData.giftOption}</p>
            <p>Countdown will start soon!</p>
        `;

        document.body.appendChild(successMessage);

        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    // Add these functions to your existing script.js file

    function setupMultiStepForm() {
        const form = document.getElementById('createPartyForm');
        const steps = form.querySelectorAll('.form-step');
        const nextButtons = form.querySelectorAll('.next-step');
        const prevButtons = form.querySelectorAll('.prev-step');

        let currentStep = 0;

        function showStep(stepIndex) {
            steps.forEach((step, index) => {
                step.classList.toggle('active', index === stepIndex);
            });
        }

        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                }
            });
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    showStep(currentStep);
                }
            });
        });

        showStep(currentStep);
    }

    function setupCapsuleMessages() {
        const addButton = document.getElementById('addCapsuleMessage');
        const capsuleMessages = document.getElementById('capsuleMessages');

        addButton.addEventListener('click', () => {
            const newMessage = document.createElement('div');
            newMessage.className = 'capsule-message';
            newMessage.innerHTML = `
                <input type="text" name="capsuleRecipient[]" placeholder="Recipient's name">
                <textarea name="capsuleContent[]" placeholder="Capsule message"></textarea>
            `;
            capsuleMessages.appendChild(newMessage);
        });
    }

    // Modify the existing createPartyForm submit event listener
    createPartyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(createPartyForm);
        const partyData = Object.fromEntries(formData);
        
        // Handle multiple selected games
        partyData.games = formData.getAll('games');

        // Handle capsule messages
        partyData.capsuleMessages = [];
        const recipients = formData.getAll('capsuleRecipient[]');
        const contents = formData.getAll('capsuleContent[]');
        for (let i = 0; i < recipients.length; i++) {
            if (recipients[i] && contents[i]) {
                partyData.capsuleMessages.push({
                    recipient: recipients[i],
                    content: contents[i]
                });
            }
        }

        console.log('Party Data:', partyData);

        // Close the modal after submission
        modal.style.display = 'none';

        // Start the countdown
        startCountdown(partyData.capsuleMessages);

        // Reset the form
        createPartyForm.reset();
    });

    function startCountdown(capsuleMessages) {
        let timeLeft = 15;
        countdownOverlay.style.display = 'flex';

        const countdownInterval = setInterval(() => {
            countdownElement.textContent = timeLeft;
            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(countdownInterval);
                countdownOverlay.style.display = 'none';
                showCapsuleMessages(capsuleMessages);
            }
        }, 1000);
    }

    function showCapsuleMessages(messages) {
        if (messages && messages.length > 0) {
            let currentMessageIndex = 0;

            function displayNextMessage() {
                if (currentMessageIndex < messages.length) {
                    const message = messages[currentMessageIndex];
                    capsuleMessageElement.innerHTML = `
                        <h3>Message for ${message.recipient}</h3>
                        <p>${message.content}</p>
                    `;
                    privateCapsuleOverlay.style.display = 'flex';
                    currentMessageIndex++;
                } else {
                    privateCapsuleOverlay.style.display = 'none';
                }
            }

            displayNextMessage();

            closeCapsuleButton.addEventListener('click', () => {
                privateCapsuleOverlay.style.display = 'none';
                setTimeout(displayNextMessage, 500);
            });
        }
    }

    // Call these functions when the DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        setupMultiStepForm();
        setupCapsuleMessages();
        // ... (rest of your existing code)
    });

    // Add this code near the beginning of your existing DOMContentLoaded event listener
    const startGameButton = document.querySelector('.start-game');
    const gamesModal = document.getElementById('gamesModal');
    const closeGameButton = gamesModal.querySelector('.close');

    startGameButton.addEventListener('click', () => {
        gamesModal.style.display = 'block';
    });

    closeGameButton.addEventListener('click', () => {
        gamesModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === gamesModal) {
            gamesModal.style.display = 'none';
        }
    });

    // ... rest of your existing code

    // Add this near the top of your existing DOMContentLoaded event listener
    const openPhotoBoothButton = document.createElement('button');
    openPhotoBoothButton.textContent = 'Open Photo Booth';
    openPhotoBoothButton.classList.add('party-button');
    document.querySelector('.party-buttons').appendChild(openPhotoBoothButton);

    openPhotoBoothButton.addEventListener('click', () => {
        document.getElementById('photoBooth').style.display = 'flex';
    });

    // Add this at the end of your DOMContentLoaded event listener
    import('./photoBooth.js').then(module => {
        const PhotoBooth = module.default;
        new PhotoBooth();
    });

    // Add this at the end of your DOMContentLoaded event listener
    import('./capsules.js').then(module => {
        const SurpriseCapsules = module.default;
        new SurpriseCapsules();
    });
});

module.exports = {
    // Export any functions or variables you want to use in other files
};