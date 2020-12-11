import { environment } from "../config/environment";
import { BouncingBoxConstraints } from "../types/boucing-box";

export abstract class GameObject {
  /** Position */
  protected _x : number = 0;
  protected _y : number = 0;
  public get x() { return this._x; };
  public get y() { return this._y; };
  public get mask_threshold() { return this._y; }
  /** Bouncing box */
  public get bouncing_box() : BouncingBoxConstraints {
    return {
      x1: this.x - 5,
      y1: this.y - 5,
      x2: this.x + this.width + 5,
      y2: this.y + this.height + 5
    }
  }
  /** Size */
  abstract readonly width : number;
  abstract readonly height : number;
  protected set_masking_color() {
    if(environment.showMasks) {
      love.graphics.setColor(0, 1, 0, .3);
    } else {
      love.graphics.setColor(0, 0, 0, 1);
    }
  }
  /**
   * Returns true if object collides with other
   */
  collides(game_object : GameObject, axis : 'x' | 'y') : boolean {
    return false;
  }
  draw_bouncing_box(color : [number, number, number, number] = [ 0, 0, 1, .2 ]) {
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
  abstract draw() : void;
}