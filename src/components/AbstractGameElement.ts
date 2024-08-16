import { Point } from "../Util/Point";
import { AbstractMap } from "./AbstractMap";

export abstract class AbstractGameElement {
  protected map: AbstractMap | null = null;
  protected position: Point = new Point(-1, -1);
  protected obj: Phaser.GameObjects.Container;

  getPosition() {
    return this.position;
  }

  getX() {
    return this.position.x;
  }

  getY() {
    return this.position.y;
  }

  setMapPosition(x: number, y: number) {
    if (!AbstractMap.tileSize) {
      return;
    }

    this.position = new Point(x, y);
    this.obj.setPosition(x * AbstractMap.tileSize, y * AbstractMap.tileSize);
  }

  setMap(map: AbstractMap) {
    this.map = map;
  }
}
