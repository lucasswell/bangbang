import { AbstractMap } from "./AbstractMap";
export const text_style_l = {
  fontFamily: "Arial Black",
  fontSize: 24,
  color: "#ffffff",
  stroke: "#000000",
  strokeThickness: 8,
  align: "center",
} as Phaser.Types.GameObjects.Text.TextStyle;

export const text_style_m = {
  fontFamily: "Arial Black",
  fontSize: 16,
  color: "#ffffff",
  stroke: "#000000",
  strokeThickness: 3,
  align: "center",
} as Phaser.Types.GameObjects.Text.TextStyle;

export const text_style_xs = {
  fontFamily: "Arial Black",
  fontSize: 9,
  color: "#ffffff",
  stroke: "#000000",
  strokeThickness: 2,
  align: "center",
} as Phaser.Types.GameObjects.Text.TextStyle;

type buttonCallback = (() => void) | null;

export class MapUI {
  scene: Phaser.Scene;
  keyboardProxy: buttonCallback[] = new Array(10).fill(null);

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.addButton(0, "Move", () => {
      console.log("Move");
      AbstractMap.instance.getUnits()[0].move();
    });

    this.addButton(1, "Fire", () => {
      console.log("Fire");
      AbstractMap.instance.getUnits()[0].attack();
    });

    this.addButton(9, "End\nTurn", () => {
      AbstractMap.instance.processTurn();
    });

    this.scene.input.keyboard?.on("keydown", (e: KeyboardEvent) =>
      this.onKeyDown(e)
    );
  }

  private onKeyDown(event: KeyboardEvent) {
    if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(event.key)) {
      const index = parseInt(event.key) - 1;
      this.keyboardProxy[index]?.();
    }

    if (["0"].includes(event.key)) {
      this.keyboardProxy[9]?.();
    }

    if (event.key === "c") {
      AbstractMap.instance.resetTiles();
    }

    if (event.key === " ") {
      AbstractMap.instance.processTurn();
    }
  }

  private addButton(position: number, title: string, onClick: () => void) {
    const size = AbstractMap.tileSize * 2;

    this.scene.add
      .container()
      .add(
        this.scene.add
          .rectangle(position * size, 0, size, size)
          .setFillStyle(0x000000, 0.5)
          .setStrokeStyle(0.5, 0xffffff, 1)
          .setOrigin(0, 0)
          .setInteractive()
          .on("pointerdown", () => onClick())
      )
      .add(
        this.scene.add
          .text(position * size + size / 2, size / 2, title, text_style_m)
          .setOrigin(0.5)
      )
      .add(
        this.scene.add
          .text(
            position * size + size - 2,
            1,
            ((position != 9 ? position : -1) + 1).toFixed(),
            text_style_xs
          )
          .setOrigin(1, 0)
      )
      .setPosition(
        AbstractMap.tileSize / 2,
        AbstractMap.tileSize * 22 - size / 8
      );
    11;

    this.keyboardProxy[position] = onClick;
  }
}
