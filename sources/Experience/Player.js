import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

import Experience from './Experience.js';

import AnimationManager from './managers/AnimationManager.js';
import AudioManager from './managers/AudioManager.js';
import gsap from 'gsap';

export default class Player {
    constructor(_options) {
        this.id = _options.id;
        this.keys = _options.keys;
        this.position = _options.position;

        this.defaultAnimation = _options.defaultAnimation;

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.axisManager = this.experience.axis;
        this.axis = this.axisManager.instance;

        this.count = 0;
        this.currentColumn = 1; // 0: gauche, 1: centre, 2: droite
        this.columnWidth = 1.5; // Largeur de chaque colonne
        this.players = this.experience.world.playerManager.players;
        this.speed = 0; // Current speed
        this.targetSpeed = 0; // Speed we're interpolating to
        this.maxSpeed = 6; // Maximum speed
        this.minSpeed = 4; // Minimum speed
        this.acceleration = 0.15; // Increase per button press
        this.deceleration = 1; // Decrease per second when not pressing
        this.timeSinceLastPress = 0;
        this.buttonPressInterval = 0.2; // Seconds
        this.isImmune = false;
        this.food = 10
        this.maxFood = 20

        this.AudioManager = new AudioManager();

        this.playerManager = _options.playerManager; //To optimize

        // Bind the startGame and handleInput methods to ensure correct reference
        this.boundStartGame = this.startGame.bind(this);
        this.boundHandleInput = this.handleInput.bind(this);
        this.isStop = false;
        this.life = 3;

        this.AudioManager = new AudioManager();

        this.playerManager = _options.playerManager; //To optimize

        // Bind the startGame and handleInput methods to ensure correct reference
        this.boundStartGame = this.startGame.bind(this);
        this.boundHandleInput = this.handleInput.bind(this);

        this.AudioManager = new AudioManager();

        this.playerManager = _options.playerManager; //To optimize

        // Bind the startGame and handleInput methods to ensure correct reference
        this.boundStartGame = this.startGame.bind(this);
        this.boundHandleInput = this.handleInput.bind(this);

        this.loadModel();
        this.setupInput();
    }

    loadModel() {
        let modelKey = 'player2';
        if (this.id === 1) {
            modelKey = 'player1';
        }
        const resourceModel = this.resources.items[modelKey];

        if (!resourceModel) {
            console.error(`Model '${modelKey}' is not loaded.`);
            return;
        }

        this.model = SkeletonUtils.clone(resourceModel.scene);

        // Apply transformations
        this.model.position.copy(this.position);

        // Initialize the AnimationManager
        this.animations = resourceModel.animations;
        this.animationManager = new AnimationManager(this.model, this.animations, this);

        // Play the default animation
        this.animationManager.playAnimation(this.defaultAnimation);
    }

    setupInput() {
        // Access joysticks from AxisManager
        const buttons = this.keys.map((key) => {
            return this.axis.registerKeys(key[0], key[1], this.id);
        });

        // Create player with correct parameters
        this.instance = this.axis.createPlayer({
            id: this.id,
            buttons: buttons,
        });

        // Check if instance is valid
        if (!this.instance) {
            console.error(`Failed to create player instance for player ${this.id}`);
            return;
        }

        // Add event listener for keydown events
        if (!this.playerManager.isGameStarted()) {
            this.instance.addEventListener('keydown', this.boundStartGame);
        } else {
            this.instance.addEventListener('keydown', this.boundHandleInput);
        }

        this.axis[`joystick${this.id}`].addEventListener("joystick:quickmove", (e) => this.handleJoystickQuickmoveHandler(e));

        // set key arro left to move left without joystick
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.moveRight();
            }
            if (e.key === 'ArrowRight') {
                this.moveLeft();
            }
            if (e.key === 'ArrowUp') {
                this.jump();
            }
            if (e.key === 'ArrowDown') {

                this.AudioManager.playSlide();
                this.animationManager.playAnimation('run_slide', false)
            }
        });
    }

    handleJoystickQuickmoveHandler(event) {
        console.log(event.direction)
        if (event.direction === 'left') {
            console.log('left');
            this.moveRight();
        }
        if (event.direction === 'right') {
            console.log('right');
            this.moveLeft();
        }
        if (event.direction === 'up') {
            console.log('up');
            this.jump();
        }
        if (event.direction === 'down') {
            console.log('down');
            this.AudioManager.playSlide();
            this.animationManager.playAnimation('run_slide', false)
        }
    }

    startGame(event) {
        if (event.key === "a") {
            // Notify the PlayerManager that the game has started
            this.playerManager.startGame();

            this.removeStartScreen()

            // Play audio for game start
            this.AudioManager.playClick();
            this.AudioManager.playAmbient();
        }
    }

    handleInput(event) {
        switch (event.key) {
            case 'a':
            case 'x':
            case 'i':
            case 's':
                console.log("HEY")
                this.count++;
                this.experience.countElements[this.id - 1].textContent = this.count;

                this.targetSpeed = Math.min(this.targetSpeed + this.acceleration, this.maxSpeed);
                this.timeSinceLastPress = 0;
                break;

            case 'w':
                if (!this.experience.world.gameLogic.isPlayersInThreshold) {
                    return;
                }

                if (this.id === 1) {
                    // this.animationManager.playAnimation('dodge_right', false);
                } else if (this.id === 2) {
                    this.animationManager.playAnimation('grab', false);
                    const player1 = this.players[0];

                    const hearts = document.querySelector(`.hearts .heart:nth-child(${player1.life}) path`);

                    gsap.to(hearts, {
                        fill: 'white',
                        strokeWidth: 2,
                        duration: 1.5,
                        ease: "elastic.inOut(1,0.3)"
                    });

                    const redGradient = document.querySelector('.red-vignette');

                    gsap.to(redGradient, {
                        opacity: 1,
                        duration: 0.5,
                        ease: "elastic.inOut(1,0.3)",
                        onComplete: () => {
                            gsap.to(redGradient, {
                                opacity: 0,
                                duration: 1,
                                ease: "elastic.inOut(1,0.3)",
                            });
                        }
                    });

                    this.AudioManager.playStab();
                    player1.life--;


                    if (player1.life === 0) {
                        console.log(`Player ${this.id} won!`);
                        const winWrapper = document.querySelector('.win__wrapper');
                        const winRed = document.querySelector('.win__red');

                        gsap.to(winWrapper, {
                            display: 'block',
                            delay: 2
                        });

                        gsap.to(winRed, {
                            opacity: 1,
                            duration: 1,
                            scale: 1.2,
                            ease: "elastic.out(1, 0.3)",
                            delay: 2
                        });


                        player1.animationManager.playAnimation('fall', false);
                        player1.animationManager.end = true;
                        this.isStop = true;
                        player1.isStop = true;
                        this.animationManager.end = true;
                    } else {
                        this.stop();
                        // pause animation
                    }
                }

                break;
            default:
                break;
        }
    }

    moveLeft() {
        if (this.currentColumn > 0) {
            this.currentColumn--;
            this.updatePosition();
        }
    }

    moveRight() {
        if (this.currentColumn < 2) {
            this.currentColumn++;
            this.updatePosition();
        }
    }

    jump() {
        // Get the jump animation from the AnimationManager
        this.animationManager.playAnimation('run_jump', false);

        // Check if already jumping to avoid multiple jumps
        if (this.isJumping) return;

        // Set the flag that the player is jumping
        this.isJumping = true;

        // Define jump properties
        const jumpHeight = 1; // Maximum height of the jump
        const jumpDuration = 0.6; // Duration of the entire jump

        // GSAP tween to handle jump (up and down)
        gsap.to(this.model.position, {
            y: jumpHeight, // Move model up to the specified jump height
            duration: jumpDuration / 2, // Half the time for upward motion
            ease: 'power1.out', // Easing for smooth deceleration
            onComplete: () => {
                // After reaching the peak, fall back down
                gsap.to(this.model.position, {
                    y: 0, // Return to the ground
                    duration: jumpDuration / 2, // Second half of the jump
                    ease: 'power1.inOut', // A slight bounce effect upon landing
                    onComplete: () => {
                        // Jump complete, allow jumping again
                        this.isJumping = false;
                    },
                });
            },
        });

        this.AudioManager.playJump();
    }

    collide() {
        const blinkCount = 3;
        const blinkInterval = 100;
        const immunityDuration = 3000;

        // Activer l'immunité
        this.isImmune = true;

        // Faire clignoter le modèle
        for (let i = 0; i < blinkCount; i++) {
            setTimeout(() => {
                this.model.visible = !this.model.visible;
            }, blinkInterval * (2 * i + 1));

            setTimeout(() => {
                this.model.visible = !this.model.visible;
            }, blinkInterval * (2 * i + 2));
        }

        // descelerer le joueur
        this.targetSpeed = this.minSpeed;

        // Désactiver l'immunité après la durée spécifiée
        setTimeout(() => {
            this.isImmune = false;
        }, immunityDuration);
    }

    updateFood(nb) {
        if (this.id === 1) {

            let segments = document.querySelectorAll(`.jauge .segment`);

            this.food += nb;

            if (this.food > this.maxFood) {
                this.food = this.maxFood;
            }

            if (this.food < 0) {
                this.food = 0;
                console.log(this.maxSpeed);
                this.maxSpeed = 3;
            } else {
                this.maxSpeed = 6;
            }


            // reverse the array to start from the end
            segments = Array.from(segments).reverse();

            segments.forEach((segment, index) => {
                segment.style.opacity = index < this.food ? 1 : 0.2;
            });
        }
    }

    stop() {
        this.isStop = true;

        setTimeout(() => {
            this.isStop = false;
        }, 400);

    }

    updatePosition() {
        this.model.position.x = (this.currentColumn - 1) * this.columnWidth;
    }

    get currentSpeed() {
        return this.speed;
    }

    removeStartScreen() {
        console.log("removeStartScreen")
        this.splashScreen = document.querySelector('.splashscreen');

        const tl = gsap.timeline();
        tl.to([".splashscreen svg, .splashscreen img"], {
            autoAlpha: 0,
            duration: 0.5,
            stagger: 0.1,
        })

        tl.to(".splashscreen", {
            autoAlpha: 0,
            duration: 0.5,
            onComplete: () => {
                this.splashScreen.style.display = "none";
                // Remove the startGame event listener and add handleInput
                this.instance.removeEventListener('keydown', this.boundStartGame);
                this.instance.addEventListener('keydown', this.boundHandleInput);
            }
        })

        tl.to(".controls", {
            autoAlpha: 1,
            duration: 1.5,
        })
    }
    update(delta) {
        const deltaSeconds = delta / 1000;

        // Increase time since last button press
        this.timeSinceLastPress += deltaSeconds;

        // Decrease target speed if no recent button press
        if (this.timeSinceLastPress > this.buttonPressInterval) {
            this.targetSpeed = Math.max(this.targetSpeed - this.deceleration * deltaSeconds, this.minSpeed);
        }

        // Smoothly interpolate current speed towards target speed
        const speedChangeRate = 5; // Adjust for desired responsiveness
        this.speed += (this.targetSpeed - this.speed) * speedChangeRate * deltaSeconds;

        // Update animation manager
        if (this.animationManager) {
            // Optionally adjust animation speed
            this.animationManager.mixer.timeScale = 0.5 + (this.speed / this.maxSpeed) * 0.5;
            this.animationManager.update(deltaSeconds);
        }

        const player1 = this.players[0];
        const player2 = this.players[1];

        if (this.id === 2 && this.experience.world.gameLogic.isPlayersInThreshold) {
            const player1Speed = player1 ? player1.currentSpeed : 0;

            // Limit targetSpeed to not exceed Player 1's speed
            this.targetSpeed = Math.min(this.targetSpeed, player1Speed);
        }
        // Update position based on current speed
        if (!this.isStop) {
            // this.speed = 0;
            this.model.position.z += this.speed * deltaSeconds;
            // food -1 every 3 seconds
            this.updateFood(-1 * deltaSeconds / 3);
        }
    }
}
