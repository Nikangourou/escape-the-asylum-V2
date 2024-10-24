import { Frustum, Matrix4, Vector3 } from 'three';
import Experience from '../Experience.js';
import gsap from 'gsap';
export default class GameLogic {
    constructor(players, groundManager) {
        this.players = players;
        this.groundManager = groundManager;
        this.experience = new Experience();
        this.player2OutOfFOV = false;
        this.isPlayersInThreshold = false;
        this.isTimerRunning = false;
        this.seconds = 3;
        this.timerInterval = null;  // Per salvare l'interval ID
    }

    update() {
        this.detectPlayer2OutOfFOV();
        this.detectPlayerProximity();
    }

    detectPlayer2OutOfFOV() {
        const frustum = new Frustum();
        const camera = this.experience.camera.instance;
        const projectionMatrix = camera.projectionMatrix.clone();
        const viewMatrix = camera.matrixWorldInverse.clone();

        frustum.setFromProjectionMatrix(
            new Matrix4().multiplyMatrices(projectionMatrix, viewMatrix)
        );

        const player2 = this.players[1];
        const headOffset = 3;
        const headPosition = new Vector3(
            player2.model.position.x,
            player2.model.position.y + headOffset,
            player2.model.position.z
        );


        // Se Player 2 esce dal campo visivo
        if (!frustum.containsPoint(headPosition) && !this.player2OutOfFOV) {
            this.player2OutOfFOV = true;


            // Avvia il timer solo se non è già in esecuzione
            if (!this.isTimerRunning) {
                this.isTimerRunning = true;
                this.startTimer();
            }

        // Se Player 2 rientra nel campo visivo prima della fine del timer
        } else if (frustum.containsPoint(headPosition) && this.player2OutOfFOV) {
          
            this.player2OutOfFOV = false;
                console.log("Player 2 back in FOV, resetting timer...");
                this.resetTimer();  // Reset del timer e sparizione del timerWrapper
            
        }
    }

    startTimer() {
        this.seconds = 5;  // Reset the timer 
    
        let timerWrapper = document.querySelector('.timer__wrapper');
        let timer = document.querySelector('.timer__wrapper p');
    
        // Check if timerWrapper and timer elements are found in the DOM
        if (!timerWrapper || !timer) {
            console.error("timerWrapper or timer not found in the DOM!");
            return;
        }
    
        // Reset the timer display and set the initial text
        timer.innerText = this.seconds;
    
        // Animate the timerWrapper entrance
        gsap.fromTo(timerWrapper, 
            { opacity: 0, scale: 0, display: 'none' },  // Initial state
            { opacity: 1, scale: 1, duration: 0.5, display: 'flex',
                onStart: () => {
                    console.log("Timer animation started!");
                }
            }  // Final state
        );
    
        // Start the countdown
        this.timerInterval = setInterval(() => {
            this.seconds--;
            timer.innerText = this.seconds;
    
            // If the countdown reaches 0, stop the interval and hide the timerWrapper
            if (this.seconds === 0) {
                this.endTimer();
            }
        }, 1000);
    }
    
    resetTimer() {
        // Ferma il timer se Player 2 rientra nella FOV
        clearInterval(this.timerInterval);
        this.isTimerRunning = false;

        let timerWrapper = document.querySelector('.timer__wrapper');

        // Animazione per nascondere il timerWrapper
        gsap.to(timerWrapper, {
            opacity: 0,
            scale: 0,
            duration: 0.5,
            onComplete: () => {
                timerWrapper.style.display = 'none';  // Nascondi dopo l'animazione
            }
        });
    }

    endTimer() {
        clearInterval(this.timerInterval);
        this.isTimerRunning = false;

        let timerWrapper = document.querySelector('.timer__wrapper');

        // Animazione per nascondere il timerWrapper dopo che il tempo è scaduto
        gsap.to(timerWrapper, {
            opacity: 0,
            scale: 0,
            duration: 0.5,
            onComplete: () => {
                console.log('Player 1 wins! Player 2 is out of view.');
                const winWrapper = document.querySelector('.win__wrapper');
                        winWrapper.style.display = 'block';
                        // get win__red and set opacity to 1
                        const winWhite = document.querySelector('.win__white');
                        winWhite.style.opacity = 1;
                        
            }
        });
    }

    detectPlayerProximity() {
        const player1 = this.players[0];
        const player2 = this.players[1];

        const distance = player1.model.position.distanceTo(player2.model.position);
        const threshold = 1;

        if (distance < threshold && player1.model.position.x === player2.model.position.x) {
            this.isPlayersInThreshold = true;
            // console.log('Players are within threshold distance!');
        } else {
            this.isPlayersInThreshold = false;
        }
    }
}
