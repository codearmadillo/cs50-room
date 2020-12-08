import { environment } from "../../config/environment";
import { GameObject } from "../game-object";

export class Piano extends GameObject {
  private readonly thickness : number = 7;
  private readonly z : number = 60;
  public readonly width : number = 43;
  public readonly height : number = 120;
  public get bouncing_box() {
    return {
      x1: this.x,
      y1: this.y + this.z,
      x2: this.x + this.width + this.width * 0.3,
      y2: this.y + this.height + this.z + this.thickness + 3
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
    /** Keys */
    this.render_keys();
    /** Well... render piano */
    this.render_top();
    /** Bottom board - Stand */
    this.render_stand();
    /** Bouncing box */
    if(environment.bouncingBoxes) {
      this.draw_bouncing_box();
    }
    /** Reset */
    love.graphics.setColor(color);
  }
  private render_keys() {
    const keysStartX = this.x + this.width * 0.7;
    const keysStartY = this.y + this.height + this.thickness + this.z * 0.25;
    love.graphics.rectangle(
      'line',
      keysStartX, keysStartY - this.height,
      this.width / 2, this.height
    );
    /** Thickness */
    love.graphics.rectangle(
      'line',
      keysStartX, keysStartY,
      this.width / 2, this.thickness
    );
    /** Keys */
    for(let i = 1; i < math.floor(this.height / 8); ++i) {
      love.graphics.setColor(1, 1, 1, 1);
      love.graphics.rectangle(
        'fill',
        keysStartX, keysStartY - 8 * i,
        this.width / 2 - 4, 3
      );
    }
  }
  private render_stand() {
    love.graphics.line(
      this.x, this.y + this.height + this.thickness,
      this.x, this.y + this.height + this.thickness + this.z,
      this.x + this.width * 0.7, this.y + this.height + this.thickness + this.z,
      this.x + this.width * 0.7, this.y + this.height + this.thickness
    );
  }
  private render_top() {
    /** Render mask */
    love.graphics.setColor(0, 0, 0, 1);
    love.graphics.rectangle('fill', this.x, this.y, this.width, this.height + this.thickness);
    love.graphics.setColor(1, 1, 1, 1);
    love.graphics.rectangle('line', this.x, this.y, this.width, this.height);
    love.graphics.line(
      this.x, this.y + this.height,
      this.x, this.y + this.height + this.thickness,
      this.x + this.width, this.y + this.height + this.thickness,
      this.x + this.width, this.y + this.height
    );
  }
}