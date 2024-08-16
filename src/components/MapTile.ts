import { Point } from "../Util/Point";
import { AbstractGameElement } from "./AbstractGameElement";

export type TileState =
  | "idle"
  | "available"
  | "available_hovered"
  | "unavailable"
  | "aiming"
  | "aiming_hovered";

const idleColor = 0xffffff;
const availableColor = 0x00ff00;
const availableHoveredColor = 0x00ff00;
const unavailableColor = 0xff0000;
const aimingColor = 0xff6784;
const aimingHoveredColor = 0xff87a4;

export class MapTile {
  private position: Point;
  private state: TileState = "idle";
  private callback: ((tile: MapTile) => void) | null = null;

  private element: AbstractGameElement | null = null;
  private obj: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, size: number) {
    this.position = new Point(x, y);

    this.obj = scene.add
      .rectangle(x * size, y * size, size, size, 0xffffff)
      .setStrokeStyle(0.5, 0x000000, 0.0)
      .setAlpha(1)
      .setDepth(-1)
      .setInteractive()
      .on("pointerover", () => this.onPointerOver())
      .on("pointerout", () => this.onPointerOut())
      .on("pointerdown", () => this.onPointerDown());
  }

  onPointerOver() {
    switch (this.state) {
      case "available":
        this.setState("available_hovered");
        break;

      case "aiming":
        this.setState("aiming_hovered");
        break;
    }
  }

  onPointerOut() {
    switch (this.state) {
      case "available_hovered":
        this.setState("available");
        break;

      case "aiming_hovered":
        this.setState("aiming");
        break;
    }
  }

  onPointerDown() {
    if (this.callback) {
      this.callback(this);
    }
  }

  setState(state: TileState) {
    this.state = state;

    switch (state) {
      case "idle":
        this.obj.setFillStyle(idleColor);
        break;
      case "available":
        this.obj.setFillStyle(availableColor, 0.8);
        break;
      case "available_hovered":
        this.obj.setFillStyle(availableHoveredColor, 1.0);
        break;
      case "unavailable":
        this.obj.setFillStyle(unavailableColor);
        break;
      case "aiming":
        this.obj.setFillStyle(aimingColor);
        break;
      case "aiming_hovered":
        this.obj.setFillStyle(aimingHoveredColor);
        break;
    }
  }

  setElement(element: AbstractGameElement | null) {
    this.element = element;
  }

  getElement() {
    return this.element;
  }

  setCallback(callback: ((tile: MapTile) => void) | null) {
    this.callback = callback;
  }

  getCallback() {
    return this.callback;
  }

  getState() {
    return this.state;
  }

  isAvailable() {
    return this.element === null;
  }

  getPosition() {
    return this.position;
  }
}
