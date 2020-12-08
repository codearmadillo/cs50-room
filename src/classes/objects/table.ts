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
    love.graphics.setLineWidth(2);
    love.graphics.rectangle('line', this.x, this.y, this.width, this.height);
    love.graphics.rectangle('line', this.x, this.y + this.height, this.width, this.board_thickness);
    /** Legs */
    for (let i = 0; i < 2; i++) {
      /** Get coordinates */
      const leg_x = i == 0 ? this.x + this.leg_offset : this.x + this.width - this.leg_offset - this.leg_size;
      const leg_y = this.y + this.height + this.board_thickness;
      /** Render */
      love.graphics.rectangle('line', leg_x, leg_y, this.leg_size, this.leg_length);
    }
    /** Bouncing box */
    if(environment.bouncingBoxes) {
      this.draw_bouncing_box();
    }
    /** Reset */
    love.graphics.setColor(color);
  }
}