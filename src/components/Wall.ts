import { AbstractGameElement } from "./AbstractGameElement";
import { AbstractMap } from "./AbstractMap";

export class Wall extends AbstractGameElement {
  private rect: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    super();

    this.rect = scene.add
      .rectangle(0, 0, AbstractMap.tileSize, AbstractMap.tileSize, 0x000000)
      .setFillStyle(0x983322, 0.9)
      .setStrokeStyle(0.5, 0x000000, 0);
    // .setAlpha(0.9);

    this.obj = scene.add.container().add(this.rect);
  }
}
