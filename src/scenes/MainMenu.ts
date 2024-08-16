import { GameObjects, Scene } from "phaser";
import { Map01 } from "../levels/Map01";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;

  constructor() {
    super("MainMenu");
  }

  create() {
    const tileSize = this.game.canvas.width / 32;

    const width = 32;
    const height = 22;

    const map = new Map01(this, width, height, tileSize);
    map.setup();

    this.input.mouse?.disableContextMenu();
    this.input.once("pointerdown", () => {
      //   this.scene.start("Game");
    });
  }
}
