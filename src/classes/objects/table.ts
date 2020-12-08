import { environment } from "../../config/environment";
import { GameObject } from "../game-object";

export class Table extends GameObject {
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
    love.graphics.setColor(1, 1, 1, 1);
    /** Board */
    love.graphics.rectangle('line', this.x, this.y, this.width, this.height);
    /** Bouncing box */
    if(environment.bouncingBoxes) {
      this.draw_bouncing_box();
    }
    /** Reset */
    love.graphics.setColor(color);
  }
}