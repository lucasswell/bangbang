import { AbstractGameElement } from "./AbstractGameElement";
import { AbstractMap } from "./AbstractMap";
import { MapTile } from "./MapTile";

type UnitState = "idle" | "hover" | "selected";

export class Unit extends AbstractGameElement {
  body: Phaser.GameObjects.Arc;
  healthbar: Phaser.GameObjects.Container;
  healthfill: Phaser.GameObjects.Rectangle;
  healthbg: Phaser.GameObjects.Rectangle;

  hoverColor = 0x5656ff;
  idleColor = 0x0000ff;
  selectedColor = 0x0000ff;

  state: UnitState = "idle";

  protected health: number = 100;
  protected moviment: number = 5;
  protected sight: number = 8;

  protected remainingMoves: number = 1;
  protected remainingAttacks: number = 1;

  constructor(scene: Phaser.Scene) {
    super();

    const size = AbstractMap.tileSize;

    this.body = scene.add
      .circle(0, 0, size / 2 - 1, 0xffffff)
      .setStrokeStyle(0.5, 0x000000, 0.1)
      .setAlpha(0.9)
      .setInteractive()
      .on("pointerover", () => this.onPointerOver())
      .on("pointerout", () => this.onPointerOut())
      .on("pointerdown", () => this.onPointerDown());

    this.healthbg = scene.add.rectangle(0, -size + 8, size + 2, 6, 0x000000);
    this.healthfill = scene.add
      .rectangle(-size / 2, -size + 8, size, 4, 0x00ff00)
      .setOrigin(0, 0.5);

    this.healthbar = scene.add
      .container()
      .add(this.healthbg)
      .add(this.healthfill);

    this.obj = scene.add.container().add(this.body).add(this.healthbar);

    this.setState("idle");
  }

  setState(state: UnitState) {
    this.state = state;

    switch (state) {
      case "idle":
        this.body.setFillStyle(this.idleColor);
        break;
      case "hover":
        this.body.setFillStyle(this.hoverColor);
        break;
      case "selected":
        this.body.setFillStyle(this.selectedColor);
        break;
    }
  }

  onPointerDown() {
    switch (this.state) {
      case "hover":
        this.setState("selected");

        if (this.remainingMoves > 0) {
          this.map?.showAvailableMoves(
            this.position,
            this.position,
            this.moviment,
            "available",
            (tile) => this.onMoveSelected(tile)
          );
        }

        break;
      case "selected":
        this.setState("hover");
        this.map?.resetTiles();
        break;
    }
  }

  onPointerOver() {
    if (this.state === "idle") {
      this.setState("hover");
    }
  }

  onPointerOut() {
    if (this.state === "hover") {
      this.setState("idle");
    }
  }

  processTurn() {
    // setTimeout(() => {
    //   this.move();
    // }, 1000);

    this.remainingAttacks = 1;
    this.remainingMoves = 1;
  }

  move() {
    if (this.remainingMoves <= 0) {
      return;
    }

    this.map?.showAvailableMoves(
      this.position,
      this.position,
      this.moviment,
      "available",
      (tile) => this.onMoveSelected(tile)
    );
  }

  onMoveSelected(tile: MapTile) {
    this.setState("hover");
    this.remainingMoves--;
    this.map?.move(this, tile.getPosition().x, tile.getPosition().y);
    this.map?.resetTiles();
  }

  attack() {
    if (this.remainingAttacks <= 0) {
      return;
    }

    this.map?.showAvailableMoves(
      this.position,
      this.position,
      this.sight,
      "aiming",
      (tile) => this.onAttackSelected(tile)
    );
  }

  onAttackSelected(tile: MapTile) {
    // this.map?.move(this, tile.getPosition().x, tile.getPosition().y);

    this.map?.resetTiles();
    // this.map?.processTurn();
  }
}
