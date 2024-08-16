import { AbstractMap } from "../components/AbstractMap";
import { PlayerAI } from "../components/PlayerAI";
import { Unit } from "../components/Unit";
import { Wall } from "../components/Wall";

export class Map01 extends AbstractMap {
  constructor(
    scene: Phaser.Scene,
    width: number,
    height: number,
    tileSize: number
  ) {
    super(scene, width, height, tileSize);
  }
  setup() {
    this.addUnit(new Unit(this.scene), 10, 19);
    this.addUnit(new PlayerAI(this.scene), 19, 5);

    this.addWall(new Wall(this.scene), 13, 18);
    this.addWall(new Wall(this.scene), 12, 18);
    this.addWall(new Wall(this.scene), 12, 17);
    this.addWall(new Wall(this.scene), 11, 17);
    this.addWall(new Wall(this.scene), 11, 16);

    this.addWall(new Wall(this.scene), 20, 8);
    this.addWall(new Wall(this.scene), 21, 8);
    this.addWall(new Wall(this.scene), 20, 9);
    this.addWall(new Wall(this.scene), 19, 7);
    this.addWall(new Wall(this.scene), 19, 8);
  }
}
