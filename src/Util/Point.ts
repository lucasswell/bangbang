export class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  isValid() {
    return this.x >= 0 && this.y >= 0;
  }

  distanceTo(point: Point) {
    return Math.sqrt(
      Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2)
    );
  }

  equals(point: Point) {
    return this.x === point.x && this.y === point.y;
  }

  left() {
    return new Point(this.x - 1, this.y);
  }

  right() {
    return new Point(this.x + 1, this.y);
  }

  up() {
    return new Point(this.x, this.y - 1);
  }

  down() {
    return new Point(this.x, this.y + 1);
  }
}
