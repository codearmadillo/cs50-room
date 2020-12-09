import { BouncingBoxConstraints } from "../types/boucing-box";
import { GameObject } from "./game-object";

export abstract class StaticObject extends GameObject {
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
  /**
   * Returns true if object collides with other
   */
  collides(game_object : StaticObject, axis : 'x' | 'y') : boolean {
    return false;
  }
}