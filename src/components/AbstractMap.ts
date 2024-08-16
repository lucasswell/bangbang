import { Point } from "../Util/Point";
import { AbstractGameElement } from "./AbstractGameElement";
import { MapTile, TileState } from "./MapTile";
import { MapUI } from "./MapUI";
import { PlayerAI } from "./PlayerAI";
import { Unit } from "./Unit";
import { Wall } from "./Wall";

export abstract class AbstractMap {
  public static instance: AbstractMap;
  public static tileSize: number;

  protected scene: Phaser.Scene;
  protected map: MapTile[][];
  protected ui: MapUI;

  protected units: Unit[] = [];
  protected walls: AbstractGameElement[] = [];

  constructor(
    scene: Phaser.Scene,
    width: number,
    height: number,
    tileSize: number
  ) {
    AbstractMap.instance = this;
    AbstractMap.tileSize = tileSize;

    this.scene = scene;
    this.map = new Array(width)
      .fill(null)
      .map(() => new Array(height).fill(null));

    for (let x = 1; x < width; x++) {
      for (let y = 1; y < height; y++) {
        this.map[x][y] = new MapTile(scene, x, y, tileSize);
      }
    }

    this.ui = new MapUI(scene);
  }

  abstract setup(): void;

  addUnit(unit: Unit, x: number, y: number) {
    this.units.push(unit);
    this.move(unit, x, y);
  }

  getUnits() {
    return this.units;
  }

  addWall(wall: AbstractGameElement, x: number, y: number) {
    this.walls.push(wall);
    this.move(wall, x, y);
  }

  getTileSize() {
    return AbstractMap.tileSize;
  }

  move(unit: AbstractGameElement, x: number, y: number) {
    if (this.isValid(unit.getPosition())) {
      const from = this.map[unit.getX()][unit.getY()];
      from.setElement(null);
    }

    unit.setMap(this);
    unit.setMapPosition(x, y);
    this.map[x][y].setElement(unit);
  }

  resetTiles() {
    for (let x = 1; x < this.map.length; x++) {
      for (let y = 1; y < this.map[x].length; y++) {
        this.map[x][y].setState("idle");
        this.map[x][y].setCallback(null);
      }
    }
  }

  showAvailableMoves(
    origin: Point,
    current: Point,
    moviment: number,
    state: TileState,
    callback: (tile: MapTile) => void
  ) {
    if (
      !this.isValid(current) ||
      origin.distanceTo(current) >= moviment + 0.1
    ) {
      return;
    }

    const tile = this.map[current.x][current.y];

    if (tile.getState() != "idle") {
      return;
    }

    if (!tile.isAvailable() && !origin.equals(current)) {
      return;
    }

    if (!this.hasLineOfSight(origin, current)) {
      return;
    }

    tile.setState(state);
    tile.setCallback(callback);

    this.showAvailableMoves(origin, current.left(), moviment, state, callback);
    this.showAvailableMoves(origin, current.right(), moviment, state, callback);
    this.showAvailableMoves(origin, current.up(), moviment, state, callback);
    this.showAvailableMoves(origin, current.down(), moviment, state, callback);
  }

  getAvailableMoves() {
    return this.map
      .map((row) => row.filter((tile) => tile?.getState() === "available"))
      .reduce((acc, val) => acc.concat(val), []);
  }

  hasLineOfSight(origin: Point, target: Point) {
    const dx = target.x - origin.x;
    const dy = target.y - origin.y;

    const steps = Math.max(Math.abs(dx), Math.abs(dy));

    for (let i = 1; i < steps; i++) {
      const x = origin.x + Math.round((dx / steps) * i);
      const y = origin.y + Math.round((dy / steps) * i);

      const tile = this.map[x][y];

      if (
        !tile.getPosition().equals(origin) &&
        !tile.getPosition().equals(target) &&
        tile.getElement() instanceof Wall
      ) {
        return false;
      }
    }

    return true;
  }

  isValid(point: Point | number, y?: number) {
    if (point instanceof Point) {
      return (
        point.x >= 1 &&
        point.x < this.map.length &&
        point.y >= 1 &&
        point.y < this.map[0].length
      );
    }

    if (typeof point === "number" && typeof y === "number") {
      return (
        point >= 1 &&
        point < this.map.length &&
        y >= 1 &&
        y < this.map[0].length
      );
    }

    return false;
  }

  processTurn() {
    const npcs = this.units.filter((unit) => unit instanceof PlayerAI);
    for (const npc of npcs) {
      npc.processTurn();
    }

    const players = this.units.filter((unit) => !(unit instanceof PlayerAI));
    for (const player of players) {
      player.processTurn();
    }
  }
}
