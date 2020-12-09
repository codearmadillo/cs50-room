import { environment } from "../../config/environment";
import { StaticObject } from "../static-object";

export class Table extends StaticObject {
  private readonly leg_size = 10;
  private readonly leg_length = 10;
  private readonly leg_offset = 15;
  private readonly board_thickness = 4;
  constructor(
    protected _x : number,
    protected _y : number,
    public readonly width : number,
    public readonly height : number
  ) {
    super();
  }
  draw() {
    const color = love.graphics.getColor();
    /** Draw mask */
    this.draw_mask();
    /** Set color */
    love.graphics.setColor(1, 1, 1, 1);
    /** Board */
    love.graphics.rectangle('line', this.x, this.y, this.width, this.height);
    /** Bouncing box */
    if(environment.showBouncingBoxes) {
      this.draw_bouncing_box();
    }
    /** Reset */
    love.graphics.setColor(color);
  }
  private draw_mask() {
    if(environment.showMasks) {
      love.graphics.setColor(0, 1, 0, .3);
    } else {
      love.graphics.setColor(0, 0, 0, 1);
    }
    /** Draw */
  }
}