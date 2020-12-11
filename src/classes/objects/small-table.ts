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
  get mask_threshold() { return this.y + this.height; }
  get stand_width() { return this.width * 0.8; }
  get stand_height() { return this.stand_width * 0.3; }
  get stand_xdiff() { return (this.width - this.stand_width) / 2; }
  get stand_thickness() { return 4; }
  constructor(
    protected _x : number,
    protected _y : number
  ) {
    super();
  }
  draw() {
    const color = love.graphics.getColor();
    /** Draw mask */
    this.draw_mask();
    /** Set color */
    love.graphics.setColor(1, 1, 1, 1);
    /** Render */
    this.draw_stand();
    this.draw_leg();
    this.draw_board();
    /** Bouncing box */
    if(environment.showBouncingBoxes) {
      this.draw_bouncing_box();
    }
    /** Reset */
    love.graphics.setColor(color);
  }
  private draw_stand(mask : boolean = false) {
    let outlines1 = [
      this.x + this.stand_xdiff, this.y + this.height,
      this.x + this.width / 2, this.y + this.height - this.stand_height,
      this.x + this.width - this.stand_xdiff, this.y + this.height,
      this.x + this.width / 2, this.y + this.height + this.stand_height,
      this.x + this.stand_xdiff, this.y + this.height,
    ];
    let outlines2 = [
      this.x + this.stand_xdiff, this.y + this.height,
      this.x + this.stand_xdiff, this.y + this.height + this.stand_thickness,
      this.x + this.width / 2, this.y + this.height + this.stand_height + this.stand_thickness,
      this.x + this.width - this.stand_xdiff, this.y + this.height + this.stand_thickness,
      this.x + this.width - this.stand_xdiff, this.y + this.height
    ];
    if(!mask) {
      love.graphics.line(outlines1 as any);
      love.graphics.line(outlines2 as any);
      love.graphics.line(
        this.x + this.width / 2, this.y + this.height + this.stand_height,
        this.x + this.width / 2, this.y + this.height + this.stand_height + this.stand_thickness
      );
    } else {
      love.graphics.polygon('fill', outlines1 as any);
      love.graphics.polygon('fill', outlines2 as any);
    }
  }
  private draw_leg() {
    const base_width = this.width * 0.8;
    const base_height = base_width * 0.3;
    /** Mask */
    this.set_masking_color();
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
    this.set_masking_color();
    love.graphics.ellipse(
      'fill', this.x + this.width / 2, this.y, width, height);
    /** Render */
    love.graphics.setColor(1, 1, 1, 1);
    love.graphics.ellipse(
      'line', this.x + this.width / 2, this.y, width, height);
  }
  private draw_mask() {
    this.set_masking_color();
    /** Draw */
    this.draw_stand(true);
  }
}