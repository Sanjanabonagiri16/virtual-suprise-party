const THREE = require('three');
const { EffectComposer } = require('three/examples/jsm/postprocessing/EffectComposer.js');
const { RenderPass } = require('three/examples/jsm/postprocessing/RenderPass.js');
const { ShaderPass } = require('three/examples/jsm/postprocessing/ShaderPass.js');
const { GlitchPass } = require('three/examples/jsm/postprocessing/GlitchPass.js');
const { SepiaShader } = require('three/examples/jsm/shaders/SepiaShader.js');
const { DotScreenShader } = require('three/examples/jsm/shaders/DotScreenShader.js');
const { gsap } = require('gsap');

class PhotoBooth {
    constructor() {
        this.photoBooth = document.getElementById('photoBooth');
        this.cameraFeed = document.getElementById('cameraFeed');
        this.captureButton = document.getElementById('captureButton');
        this.backgroundCarousel = document.getElementById('backgroundCarousel');
        this.backgroundLayer = document.getElementById('backgroundLayer');
        this.effectsCanvas = document.getElementById('effectsCanvas');
        this.photoPreview = document.getElementById('photoPreview');
        this.capturedPhoto = document.getElementById('capturedPhoto');

        this.stream = null;
        this.currentBackground = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.composer = null;
        this.currentFilter = null;
        this.currentStickers = [];
        this.currentOverlay = null;
        this.capturedPhotos = [];

        // Add new properties for assets
        this.backgrounds = [
            { name: 'Party Hall', url: 'assets/backgrounds/party-hall.jpg' },
            { name: 'Beach', url: 'assets/backgrounds/beach.jpg' },
            { name: 'Christmas', url: 'assets/backgrounds/christmas.jpg' },
        ];

        this.stickers = [
            { name: 'Party Hat', url: 'assets/stickers/party-hat.png' },
            { name: 'Sunglasses', url: 'assets/stickers/sunglasses.png' },
            { name: 'Mustache', url: 'assets/stickers/mustache.png' },
        ];


        this.overlays = [
            { name: 'Frame', url: 'assets/overlays/frame.png' },
            { name: 'Hearts', url: 'assets/overlays/hearts.png' },
            { name: 'Stars', url: 'assets/overlays/stars.png' },
        ];

        this.sounds = {
            capture: new Audio('assets/sounds/capture.mp3'),
            background: new Audio('assets/sounds/background-music.mp3'),
        };

        this.init();
    }

    async init() {
        await this.setupCamera();
        this.setupBackgrounds();
        this.setupThreeJS();
        this.setupFilters();
        this.setupStickers();
        this.setupOverlays();
        this.setupThemes();
        this.setupEventListeners();
        this.setupAudio();
    }

    async setupCamera() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.cameraFeed.srcObject = this.stream;
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    }

    setupBackgrounds() {
        this.backgrounds.forEach((bg, index) => {
            const option = document.createElement('div');
            option.className = 'background-option';
            option.style.backgroundImage = `url(${bg.url})`;
            option.addEventListener('click', () => this.changeBackground(bg.url));
            this.backgroundCarousel.appendChild(option);
        });
    }

    setupThreeJS() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.effectsCanvas.width / this.effectsCanvas.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.effectsCanvas, alpha: true });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
        const plane = new THREE.Mesh(geometry, material);
        this.scene.add(plane);

        this.camera.position.z = 1;

        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.composer.render();
    }

    setupFilters() {
        const filters = [
            { name: 'Normal', shader: null },
            { name: 'Sepia', shader: SepiaShader },
            { name: 'Dot Screen', shader: DotScreenShader },
            { name: 'Glitch', shader: GlitchPass },
        ];

        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';

        filters.forEach(filter => {
            const button = document.createElement('button');
            button.textContent = filter.name;
            button.addEventListener('click', () => this.applyFilter(filter));
            filterContainer.appendChild(button);
        });

        this.photoBooth.appendChild(filterContainer);
    }

    applyFilter(filter) {
        if (this.currentFilter) {
            this.composer.removePass(this.currentFilter);
        }

        if (filter.shader) {
            const pass = filter.shader === GlitchPass ? new GlitchPass() : new ShaderPass(filter.shader);
            this.composer.addPass(pass);
            this.currentFilter = pass;
        }
    }

    setupStickers() {
        const stickerContainer = document.createElement('div');
        stickerContainer.className = 'sticker-container';

        this.stickers.forEach(sticker => {
            const img = document.createElement('img');
            img.src = sticker.url;
            img.alt = sticker.name;
            img.className = 'sticker-option';
            img.addEventListener('click', () => this.addSticker(sticker));
            stickerContainer.appendChild(img);
        });

        this.photoBooth.appendChild(stickerContainer);
    }

    addSticker(sticker) {
        const stickerElement = document.createElement('img');
        stickerElement.src = sticker.url;
        stickerElement.className = 'sticker';
        stickerElement.style.position = 'absolute';
        stickerElement.style.left = '50%';
        stickerElement.style.top = '50%';
        stickerElement.style.transform = 'translate(-50%, -50%)';
        stickerElement.style.pointerEvents = 'none';

        this.currentStickers.push(stickerElement);
        this.photoBooth.appendChild(stickerElement);
    }

    setupOverlays() {
        const overlayContainer = document.createElement('div');
        overlayContainer.className = 'overlay-container';

        this.overlays.forEach(overlay => {
            const button = document.createElement('button');
            button.textContent = overlay.name;
            button.className = 'overlay-button';
            button.addEventListener('click', () => this.applyOverlay(overlay));
            overlayContainer.appendChild(button);
        });

        this.photoBooth.appendChild(overlayContainer);
    }

    applyOverlay(overlay) {
        if (this.currentOverlay) {
            this.photoBooth.removeChild(this.currentOverlay);
        }

        const overlayElement = document.createElement('img');
        overlayElement.src = overlay.url;
        overlayElement.className = 'overlay';
        overlayElement.style.position = 'absolute';
        overlayElement.style.left = '0';
        overlayElement.style.top = '0';
        overlayElement.style.width = '100%';
        overlayElement.style.height = '100%';
        overlayElement.style.pointerEvents = 'none';

        this.currentOverlay = overlayElement;
        this.photoBooth.appendChild(overlayElement);
    }

    setupThemes() {
        const themes = ['Default', 'Retro', 'Futuristic', 'Tropical'];

        const themeContainer = document.createElement('div');
        themeContainer.className = 'theme-container';

        themes.forEach(theme => {
            const button = document.createElement('button');
            button.textContent = theme;
            button.addEventListener('click', () => this.applyTheme(theme));
            themeContainer.appendChild(button);
        });

        this.photoBooth.appendChild(themeContainer);
    }

    applyTheme(theme) {
        this.photoBooth.className = `photo-booth theme-${theme.toLowerCase()}`;
        
        // Theme-specific animations
        switch (theme.toLowerCase()) {
            case 'retro':
                this.applyRetroTheme();
                break;
            case 'futuristic':
                this.applyFuturisticTheme();
                break;
            case 'tropical':
                this.applyTropicalTheme();
                break;
            default:
                this.applyDefaultTheme();
        }
    }

    applyRetroTheme() {
        gsap.to(this.photoBooth, {
            filter: 'sepia(100%) saturate(300%) brightness(80%)',
            duration: 0.8, // Adjust duration as needed
            ease: 'power2.inOut' // Try different easing functions
        });
    }

    applyFuturisticTheme() {
        gsap.to(this.photoBooth, {
            filter: 'hue-rotate(180deg) brightness(120%) contrast(120%)',
            duration: 1
        });
    }

    applyTropicalTheme() {
        gsap.to(this.photoBooth, {
            filter: 'saturate(150%) brightness(110%)',
            duration: 1
        });
    }

    applyDefaultTheme() {
        gsap.to(this.photoBooth, {
            filter: 'none',
            duration: 1
        });
    }

    setupEventListeners() {
        this.captureButton.addEventListener('click', () => this.capturePhoto());
    }

    changeBackground(url) {
        this.backgroundLayer.style.backgroundImage = `url(${url})`;
    }

    capturePhoto() {
        const canvas = document.createElement('canvas');
        canvas.width = this.cameraFeed.videoWidth;
        canvas.height = this.cameraFeed.videoHeight;
        const ctx = canvas.getContext('2d');

        // Draw the background
        ctx.drawImage(this.backgroundLayer, 0, 0, canvas.width, canvas.height);

        // Draw the video feed
        ctx.drawImage(this.cameraFeed, 0, 0, canvas.width, canvas.height);

        // Draw the Three.js effects
        ctx.drawImage(this.effectsCanvas, 0, 0, canvas.width, canvas.height);

        // Draw stickers and overlays
        this.currentStickers.forEach(sticker => {
            ctx.drawImage(sticker, 0, 0, canvas.width, canvas.height);
        });

        if (this.currentOverlay) {
            ctx.drawImage(this.currentOverlay, 0, 0, canvas.width, canvas.height);
        }

        // Add the captured photo to the array
        this.capturedPhotos.push(canvas.toDataURL('image/png'));

        // Update the 3D photo preview grid
        this.updatePhotoPreviewGrid();

        // Display the captured photo
        this.capturedPhoto.src = canvas.toDataURL('image/png');
        this.capturedPhoto.style.display = 'block';
        this.photoPreview.style.display = 'block';

        // Play capture sound
        this.playSound('capture');
    }

    updatePhotoPreviewGrid() {
        const gridContainer = document.createElement('div');
        gridContainer.className = 'photo-grid';

        this.capturedPhotos.forEach((photoUrl, index) => {
            const photoElement = document.createElement('img');
            photoElement.src = photoUrl;
            photoElement.className = 'grid-photo';
            photoElement.style.transform = `rotateY(${index * 60}deg) translateZ(300px)`;
            
            gsap.from(photoElement, {
                opacity: 0,
                scale: 0.5,
                duration: 0.5,
                delay: index * 0.1,
                ease: 'back.out(1.7)'
            });

            gridContainer.appendChild(photoElement);
        });

        if (this.photoPreview.firstChild) {
            this.photoPreview.replaceChild(gridContainer, this.photoPreview.firstChild);
        } else {
            this.photoPreview.appendChild(gridContainer);
        }

        gsap.to(gridContainer, {
            rotationY: 360,
            duration: 30, // Adjust the rotation speed
            repeat: -1,
            ease: 'linear'
        });
    }

    setupAudio() {
        this.sounds.background.loop = true;
        this.sounds.background.volume = 0.5;
        this.sounds.background.play();
    }

    playSound(soundName) {
        this.sounds[soundName].play();
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const photoBooth = new PhotoBooth();
});