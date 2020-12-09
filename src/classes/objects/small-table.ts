import { environment } from "../../config/environment";
import { StaticObject } from "../static-object";

export class SmallTable extends StaticObject {
  public readonly width : number = 35;
  public readonly height : number = 35;
  private readonly thickness : number = 6;
  public get bouncing_box() {
    return {
      x1: this.x - 5,
      y1: this.y - 5,
      x2: this.x + this.width + 5,
      y2: this.y + this.height + this.width * 0.20
    }
  }
  constructor(
    protected _x : number,
    protected _y : number
  ) {
    super();
  }
  draw() {
    const color = love.graphics.getColor();
    love.graphics.setColor(1, 1, 1, 1);
    /** Render */
    this.draw_stand();
    this.draw_leg();
    this.draw_board();
    /** Bouncing box */
    if(environment.bouncingBoxes) {
      this.draw_bouncing_box();
    }
    /** Reset */
    love.graphics.setColor(color);
  }
  private draw_stand() {
    const width = this.width * 0.8;
    const height = width * 0.3;
    const xdiff = (this.width - width) / 2;
    const thickness = 4;
    love.graphics.line(
      this.x + xdiff, this.y + this.height,
      this.x + this.width / 2, this.y + this.height - height,
      this.x + this.width - xdiff, this.y + this.height,
      this.x + this.width / 2, this.y + this.height + height,
      this.x + xdiff, this.y + this.height,
    );
    love.graphics.line(
      this.x + xdiff, this.y + this.height,
      this.x + xdiff, this.y + this.height + thickness,
      this.x + this.width / 2, this.y + this.height + height + thickness,
      this.x + this.width - xdiff, this.y + this.height + thickness,
      this.x + this.width - xdiff, this.y + this.height
    );
    love.graphics.line(
      this.x + this.width / 2, this.y + this.height + height,
      this.x + this.width / 2, this.y + this.height + height + thickness
    );
  }
  private draw_leg() {
    const base_width = this.width * 0.8;
    const base_height = base_width * 0.3;
    /** Mask */
    love.graphics.setColor(0, 0, 0, 1);
    love.graphics.polygon(
      'fill',
      this.x + this.width / 2 - 4, this.y,
      this.x + this.width / 2 + 4, this.y,
      this.x + this.width / 2 + 4, this.y + this.height + 2,
      this.x + this.width / 2 - 4, this.y + this.height + 2
    );
    /** Draw line */
    love.graphics.setColor(1, 1, 1, 1);
    love.graphics.line(
      this.x + this.width / 2, this.y,
      this.x + this.width / 2, this.y + this.height + 2,
      this.x + this.width / 2 - 4, this.y + this.height + 2 - (this.width / 2 - 8) * 0.3,
      this.x + this.width / 2 - 4, this.y
    );
    love.graphics.line(
      this.x + this.width / 2 + 4, this.y,
      this.x + this.width / 2 + 4, this.y + this.height + 2 - (this.width / 2 - 8) * 0.3,
      this.x + this.width / 2, this.y + this.height + 2,
    );
  }
  private draw_board() {
    const width = this.width * 0.8;
    const height = width * 0.6;
    /** Mask */
    love.graphics.setColor(0, 0, 0, 1);
    love.graphics.ellipse(
      'fill', this.x + this.width / 2, this.y, width, height);
    /** Render */
    love.graphics.setColor(1, 1, 1, 1);
    love.graphics.ellipse(
      'line', this.x + this.width / 2, this.y, width, height);
  }
}