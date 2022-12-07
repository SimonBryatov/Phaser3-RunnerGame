import Phaser from "phaser";
import { AnimationKey } from "../consts/AnimationKey";
import { SceneKey } from "../consts/SceneKey";
import { TextureKey } from "../consts/TextureKey";
import AudioMotionAnalyzer from "audiomotion-analyzer";

export class Game extends Phaser.Scene {
  private background!: Phaser.GameObjects.TileSprite;
  private bush!: Phaser.GameObjects.Image;
  private copCar!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private prevRunVelocity = 0;
  private dino!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private audiomotion!: AudioMotionAnalyzer;
  private isGameOver: boolean = false;
  private scoreText!: Phaser.GameObjects.Text;
  private music!: any;

  constructor() {
    super(SceneKey.game);

    this.loadAudioAnalyzer();
  }

  private loadAudioAnalyzer = () => {
    const audioVisualizerContainer = document.createElement("div");
    audioVisualizerContainer.id = "audioVisualizer";

    document.body.appendChild(audioVisualizerContainer);

    this.audiomotion = new AudioMotionAnalyzer(audioVisualizerContainer, {
      volume: 0,
    });

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        const micStream =
          this.audiomotion.audioCtx.createMediaStreamSource(stream);
        this.audiomotion.connectInput(micStream);
        console.log(this.audiomotion.isOn);
      })
      .catch(function (err) {
        /* handle the error */
        console.error(err);
      });
  };

  private setPlayer(sceneWidth: number, sceneHeight: number) {
    this.dino = this.physics.add
      .sprite(sceneWidth * 0.5, Number.MAX_SAFE_INTEGER, TextureKey.dino)
      .setScale(2)
      .setOrigin(0.5, 1)
      .setImmovable(true);

    this.dino.body.setCircle(23);
    this.dino.body.setOffset(-5, 15);
    this.dino.body.collideWorldBounds = true;

    this.cameras.main.startFollow(this.dino);
    this.cameras.main.setFollowOffset(-sceneWidth * 0.25);
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, sceneHeight);
  }

  private setWorld(sceneWidth: number, sceneHeight: number) {
    this.background = this.add
      .tileSprite(0, 0, sceneWidth, sceneHeight, TextureKey.background)
      .setOrigin(0)
      .setScrollFactor(0, 0);

    this.physics.world.setBounds(0, 0, Number.MAX_SAFE_INTEGER, sceneHeight);

    this.bush = this.add
      .image(Phaser.Math.Between(900, 1500), sceneHeight - 72, TextureKey.bush)
      .setScale(0.25);

    this.copCar = this.physics.add
      .sprite(
        Phaser.Math.Between(900, 1500),
        sceneHeight - 40,
        TextureKey.copCar
      )
      .setScale(1.1)
      .setAngle(7)
      .setImmovable(true);

    this.copCar.body.setCircle(50);
    this.copCar.body.setOffset(60, 30);
    this.copCar.body.setAllowGravity(false);
  }

  private setSound() {
    if (!this.music) {
      this.music = this.sound.add("mainTheme", { volume: 0.5 });
      this.music.loop = true;
      this.music.play();
    }
  }

  private onObstacleHit = () => {
    if (this.isGameOver) {
      return;
    }
    this.isGameOver = true;
    this.dino.body.setVelocity(0, 0).setAllowGravity(false);

    this.dino
      .stop()
      .play({ key: AnimationKey.dinoDeath })
      .chain({ key: AnimationKey.dinoDead, repeat: -1 });
    this.scene.launch(SceneKey.gameOver);
  };

  private handleJumping = () => {
    const jumpInputPower = this.audiomotion.getEnergy(2000, 16000) * 1000;

    if (jumpInputPower > 130 && this.dino.body.onFloor()) {
      this.dino.setVelocityY(-500);
      this.dino.play({ key: AnimationKey.dinoJump, repeat: -1 });
    }
  };

  private handleRunning = () => {
    const runInputPower = this.audiomotion.getEnergy(0, 60) * 5000;
    const runVelocity = Phaser.Math.Linear(
      this.prevRunVelocity,
      runInputPower,
      0.015
    );

    this.dino.setVelocityX(runVelocity);
    this.prevRunVelocity = runVelocity;

    if (this.dino.body.onFloor()) {
      this.dino.play({ key: AnimationKey.dinoRun, repeat: -1 }, true);
    }
  };

  private spawnDecorations = () => {
    const scrollX = this.cameras.main.scrollX;
    const rightEdge = scrollX + this.scale.width;

    if (this.bush.x + this.bush.width < scrollX) {
      this.bush.x = Phaser.Math.Between(rightEdge + 100, rightEdge + 1000);
    }
  };

  private spawnObstacles = () => {
    const scrollX = this.cameras.main.scrollX;
    const rightEdge = scrollX + this.scale.width;

    if (this.copCar.x + this.copCar.width < scrollX) {
      this.copCar.x = Phaser.Math.Between(rightEdge + 100, rightEdge + 1000);
    }
  };

  create() {
    this.setSound();

    this.prevRunVelocity = 0;
    this.isGameOver = false;

    const sceneWidth = this.scale.width;
    const sceneHeight = this.scale.height;

    this.setWorld(sceneWidth, sceneHeight);

    this.setPlayer(sceneWidth, sceneHeight);

    this.physics.add.collider(this.dino, this.copCar, this.onObstacleHit);

    this.scoreText = this.add
      .text(0, 0, "Score: ", {
        fontSize: "16px",
        color: "white",
        backgroundColor: "black",
      })
      .setScrollFactor(0);

    this.add
      .text(90, 60, "Run frequencies (0-60)", {
        fontSize: "10px",
        color: "white",
        backgroundColor: "black",
      })
      .setScrollFactor(0);

    this.add
      .text(360, 60, "Jump frequencies (2k-16k)", {
        fontSize: "10px",
        color: "white",
        backgroundColor: "black",
      })
      .setScrollFactor(0);
  }

  update(): void {
    if (this.isGameOver) {
      return;
    }

    this.handleRunning();
    this.handleJumping();

    this.background.setTilePosition(this.cameras.main.scrollX);
    this.spawnDecorations();
    this.spawnObstacles();

    this.scoreText.text =
      "Score: " + Math.round(this.cameras.main.scrollX * 0.25 - 40);
  }
}
