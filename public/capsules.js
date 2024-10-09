const { gsap } = require('gsap');

class SurpriseCapsules {
    constructor() {
        this.capsules = [];
        this.themes = [
            { name: 'Birthday', icon: '🎂', colors: ['#FF69B4', '#FFA500'] },
            { name: 'Anniversary', icon: '💑', colors: ['#FF1493', '#FF69B4'] },
            { name: 'Christmas', icon: '🎄', colors: ['#228B22', '#8B0000'] },
            { name: 'Diwali', icon: '🪔', colors: ['#FFD700', '#FF4500'] },
            { name: 'Summer', icon: '☀️', colors: ['#FFD700', '#87CEEB'] },
            { name: 'Winter', icon: '❄️', colors: ['#87CEEB', '#FFFFFF'] },
            { name: 'Halloween', icon: '🎃', colors: ['#FF4500', '#000000'] },
            { name: 'Graduation', icon: '🎓', colors: ['#4B0082', '#FFD700'] }
        ];
        this.selectedTheme = null;
        this.partyCode = '';

        this.themeAnimations = {
            Birthday: this.birthdayAnimation,
            Anniversary: this.anniversaryAnimation,
            Christmas: this.christmasAnimation,
            Diwali: this.diwaliAnimation,
            Summer: this.summerAnimation,
            Winter: this.winterAnimation,
            Halloween: this.halloweenAnimation,
            Graduation: this.graduationAnimation
        };
    }

    init() {
        this.loadCapsules();
        this.setupEventListeners();
        this.checkCapsuleUnlockTimes();
        this.setupThemeSelection();
        this.renderCapsules();
    }

    loadCapsules() {
        const storedCapsules = localStorage.getItem('surpriseCapsules');
        if (storedCapsules) {
            this.capsules = JSON.parse(storedCapsules);
        }
    }

    saveCapsules() {
        localStorage.setItem('surpriseCapsules', JSON.stringify(this.capsules));
    }

    renderCapsules() {
        const capsuleList = document.getElementById('capsuleList');
        if (!capsuleList) {
            console.error('Capsule list element not found');
            return;
        }
        capsuleList.innerHTML = '';
        this.capsules.forEach((capsule, index) => {
            const capsuleElement = document.createElement('div');
            capsuleElement.className = `capsule ${this.isCapsuleUnlocked(capsule) ? 'capsule-unlocked' : 'capsule-locked'}`;
            capsuleElement.style.background = capsule.theme ? 
                `linear-gradient(45deg, ${capsule.theme.colors[0]}, ${capsule.theme.colors[1]})` : 
                '#ffffff';
            capsuleElement.dataset.shape = capsule.shape || 'circle';
            capsuleElement.innerHTML = `
                <div class="capsule-icon">${capsule.theme ? capsule.theme.icon : '🎁'}</div>
                <div class="capsule-title">${capsule.title}</div>
                <div class="capsule-timer">${this.getTimeRemaining(capsule)}</div>
            `;
            capsuleElement.addEventListener('click', () => this.openCapsule(capsule, index));
            capsuleList.appendChild(capsuleElement);

            gsap.from(capsuleElement, {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                delay: index * 0.1,
                ease: 'back.out(1.7)',
                onComplete: () => {
                    if (capsule.theme && this.themeAnimations[capsule.theme.name]) {
                        this.themeAnimations[capsule.theme.name](capsuleElement);
                    }
                }
            });
        });
    }

    setupEventListeners() {
        const addCapsuleButton = document.getElementById('addCapsuleButton');
        if (addCapsuleButton) {
            addCapsuleButton.addEventListener('click', () => this.showNewCapsuleModal());
        }

        const newCapsuleForm = document.getElementById('newCapsuleForm');
        if (newCapsuleForm) {
            newCapsuleForm.addEventListener('submit', (e) => this.handleNewCapsuleSubmit(e));
        }

        window.addEventListener('click', (e) => {
            const newCapsuleModal = document.getElementById('newCapsuleModal');
            if (e.target === newCapsuleModal) {
                newCapsuleModal.style.display = 'none';
            }
        });
    }

    // ... rest of the methods ...

}

export function initCapsules() {
    const capsules = new SurpriseCapsules();
    capsules.init();
}

document.addEventListener('DOMContentLoaded', initCapsules);