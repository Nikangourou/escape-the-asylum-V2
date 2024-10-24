export default class AudioManager {
    constructor() {
      this.clickAudio = new Audio('assets/audio/click.mp3');
      this.ambientAudio = new Audio('assets/audio/ambient.mp3');  // Added ambient audio
      this.runner__one = new Audio('assets/audio/foot_one.mp3');
      this.runner__two = new Audio('assets/audio/foot_two.mp3');
      this.eatingAudio = new Audio('assets/audio/eat.wav');
      this.jumpAudio = new Audio('assets/audio/jump.wav');
      this.slideAudio = new Audio('assets/audio/slide.wav');

      this.ambientAudio.loop = true;  // Set ambient audio to loop
    }

    playAmbient() {
      this.ambientAudio.play();

      this.runner__one.play();
      this.runner__two.play();

      this.ambientAudio.volume = 0.6;
      this.runner__two.volume = 0.2;
      this.runner__one.volume = 0.2;
      this.runner__one.loop = true;
      this.runner__two.loop = true;
      this.ambientAudio.loop = true;



    }

    stopAmbient() {
      this.ambientAudio.pause();
      this.ambientAudio.currentTime = 0;  // Resets the track to the start
    }

    playClick() {
      this.clickAudio.play();
      console.log('click');
    }

    playEating() {  
      // Add eating audio
      this.eatingAudio.play();
      console.log('eating');
    }

    playJump() {
      this.jumpAudio.play();
      console.log('jump');
    }

    playSlide() {
      this.slideAudio.play();
      console.log('slide');
    }
    update(delta) {
      // You could manage audio effects or adjustments here based on delta
    }
}
