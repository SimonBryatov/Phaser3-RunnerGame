import Phaser from "phaser";
import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { Preloader } from "./scenes/Preloader";
import "./style.css";

export const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 640,
  height: 450,
  scale: {zoom: 2},
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1000 },
      debug: false,
    },
  },
  scene: [Preloader, Game, GameOver],
});
