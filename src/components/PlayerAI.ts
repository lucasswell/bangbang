import { MapTile } from "./MapTile";
import { Unit } from "./Unit";

export class PlayerAI extends Unit {
  idleColor = 0xbb5363;

  protected moviment: number = 5;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.body.disableInteractive();
    this.setState("idle");
  }

  processTurn() {
    this.map?.showAvailableMoves(
      this.position,
      this.position,
      this.moviment,
      "available",
      (tile) => this.onMoveSelected(tile)
    );

    const tiles = this.map?.getAvailableMoves();

    if (tiles) {
      const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
      randomTile.getCallback()!(randomTile);
    }

    this.map?.resetTiles();
  }

  onMoveSelected(tile: MapTile): void {
    this.map?.move(this, tile.getPosition().x, tile.getPosition().y);
    this.map?.resetTiles();
  }
}
