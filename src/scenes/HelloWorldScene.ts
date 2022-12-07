import Phaser from "phaser";

export class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("helloworld");
  }

  preload() {
    this.load.setBaseURL("http://labs.phaser.io");

    this.load.image("sky", "assets/skies/space3.png");
    this.load.image("logo", "assets/sprites/phaser3-logo.png");
    this.load.image("red", "assets/particles/red.png");
  }
  create() {
    this.add.image(400, 300, "sky");

    const particles = this.add.particles("logo");

    const emitter = particles.createEmitter({
      speed: 1,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
    });

    const logo = this.physics.add.image(400, 100, "logo");

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
  }
}
