import { environment } from "../../config/environment";
import { GameObject } from "../game-object";

export class SmallTable extends GameObject {
  public readonly width : number = 35;
  public readonly height : number = 35;
  constructor(
    protected _x : number,
    protected _y : number
  ) {
    super();
  }
  draw() {
    const color = love.graphics.getColor();
    love.graphics.setColor(1, 1, 1, 1);
    /** Board */
    love.graphics.ellipse(
      'line',
      this.x, this.y,
      100, 50
    );
    /** Bouncing box */
    if(environment.bouncingBoxes) {
      this.draw_bouncing_box();
    }
    /** Reset */
    love.graphics.setColor(color);
  }
}