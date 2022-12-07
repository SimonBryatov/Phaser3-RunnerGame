import Phaser from "phaser";
import { SceneKey } from "../consts/SceneKey";

export class GameOver extends Phaser.Scene {
  constructor() {
    super(SceneKey.gameOver);
  }

  resetGame = () => {
    this.scene.get(SceneKey.game).scene.restart();
    this.scene.stop();
  };

  create() {
    this.add
      .text(120, 200, "Game over, Dino!", {
        fontSize: "38px",
        color: "white",
        fontStyle: "bold",
        backgroundColor: "black",
      })
      .setScrollFactor(0);

    this.add
      .text(300, 250, "Try Again ?", {
        fontSize: "20px",
        color: "white",
        backgroundColor: "black",
      })
      .setScrollFactor(0)
      .setInteractive()
      .on("pointerdown", this.resetGame);
  }
}
