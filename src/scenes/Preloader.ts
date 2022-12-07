import Phaser from "phaser";
import { SceneKey } from "../consts/SceneKey";
import { TextureKey } from "../consts/TextureKey";

export class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKey.preloader);
  }

  preload() {
    this.load.image(TextureKey.background, "world/bg_city.png");
    this.load.image(TextureKey.bush, "world/bush.png");
    this.load.image(TextureKey.copCar, "world/cop_car.webp");
    this.load.audio('mainTheme', 'audio/mainTheme.mp3')

    this.load.aseprite(
      TextureKey.dino,
      "characters/Dino_gop.png",
      "characters/Dino_gop.json"
    );
  }
  create() {
    this.anims.createFromAseprite(TextureKey.dino)
    this.scene.start(SceneKey.game)
  }
}
