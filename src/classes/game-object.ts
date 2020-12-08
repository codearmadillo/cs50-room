import { BouncingBoxConstraints } from "../types/boucing-box";

export abstract class GameObject {
  /** Position */
  protected _x : number = 0;
  protected _y : number = 0;
  public get x() { return this._x; };
  public get y() { return this._y; };
  /** Size */
  abstract readonly width : number;
  abstract readonly height : number;
  /** Bouncing box */
  public get bouncing_box() : BouncingBoxConstraints {
    return {
      x1: this.x - 5,
      y1: this.y - 5,
      x2: this.x + this.width + 5,
      y2: this.y + this.height + 5
    }
  }
  draw() { }
  draw_bouncing_box(color : [number, number, number, number] = [ 0, 0, 1, .5 ]) {
    love.graphics.setColor(color);
    love.graphics.polygon(
      'fill',
      this.bouncing_box.x1, this.bouncing_box.y1,
      this.bouncing_box.x2, this.bouncing_box.y1,
      this.bouncing_box.x2, this.bouncing_box.y2,
      this.bouncing_box.x1, this.bouncing_box.y2,
      this.bouncing_box.x1, this.bouncing_box.y1,
    )
  }
  /**
   * Returns true if object collides with other
   */
  collides(game_object : GameObject, axis : 'x' | 'y') : boolean {
    return false;
  }
}