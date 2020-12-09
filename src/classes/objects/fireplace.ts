import { DrawMode } from "love.graphics";
import { environment } from "../../config/environment";
import { StaticObject } from "../static-object";

export class Fireplace extends StaticObject {
  public readonly width : number = 125;
  private readonly base_height = 35;
  public readonly height : number = 85;
  public get bouncing_box() {
    return {
      x1: this.x - 10,
      y1: this.y + 15,
      x2: this.x + this.width + 10,
      y2: this.y - this.base_height - 15
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
    /** Draw mask */
    this.draw_mask();
    /** Set color */
    love.graphics.setColor(1, 1, 1, 1);
    /** Top board */
    this.draw_base();
    this.draw_fireplace();
    this.draw_top_board();
    /** Bouncing box */
    if(environment.showBouncingBoxes) {
      this.draw_bouncing_box();
    }
    /** Reset */
    love.graphics.setColor(color);
  }
  private draw_top_board() {
    const height = 35;
    const thickness = 7;
    /** Mask */
    this.set_masking_color();
    love.graphics.polygon(
      'fill',
      this.x - 5, this.y - this.height - height,
      this.x - 5, this.y - this.height + thickness,
      this.x + this.width + 5, this.y - this.height + thickness,
      this.x + this.width + 5, this.y - this.height - height,
    );
    /** Draw */
    love.graphics.setColor(1, 1, 1, 1);
    love.graphics.rectangle(
      'line',
      this.x - 5, this.y - this.height - height,
      this.width + 10, height
    );
    love.graphics.line(
      this.x - 5, this.y - this.height,
      this.x - 5, this.y - this.height + thickness,
      this.x + this.width + 5, this.y - this.height + thickness,
      this.x + this.width + 5, this.y - this.height
    );
  }
  private draw_base() {
    const thickness = 11;
    love.graphics.rectangle(
      'line',
      this.x, this.y - this.base_height - thickness,
      this.width, this.base_height
    );
    love.graphics.line(
      this.x, this.y - thickness,
      this.x, this.y,
      this.x + this.width, this.y,
      this.x + this.width, this.y - thickness,
    );
    love.graphics.rectangle(
      'line',
      this.x - 10,
      this.y - this.base_height - thickness - 4,
      this.width + 20, this.base_height + 26
    );
  }
  private draw_fireplace() {
    const base_thickness = 11;
    const conn_size = 25;
    /** Pillars */
    (['fill', 'line'] as DrawMode[]).forEach((mode) => {
      if(mode === 'fill') {
        this.set_masking_color();
      } else {
        love.graphics.setColor(1, 1, 1, 1);
      }
      love.graphics.polygon(
        mode,
        this.x + 5, this.y - base_thickness - 8,
        this.x + 5, this.y - base_thickness - 8 - this.height,
        this.x + conn_size, this.y - base_thickness - 8 - this.height,
        this.x + conn_size, this.y - base_thickness - 8
      );
      love.graphics.polygon(
        mode,
        this.x + this.width - conn_size, this.y - base_thickness - 8,
        this.x + this.width - conn_size, this.y - base_thickness - 8 - this.height,
        this.x + this.width - 5, this.y - base_thickness - 8 - this.height,
        this.x + this.width - 5, this.y - base_thickness - 8
      );
    });
    /** Now - Render FIRE! */
    const render_log = (x : number, y : number, width : number, height : number) => {
      /** Mask */
      love.graphics.setColor(0, 0, 0, 1);
      love.graphics.rectangle('fill', x, y, width, height);
      /** Shape */
      love.graphics.setColor(1, 1, 1, 1);
      love.graphics.rectangle('line', x, y, width, height);
      /** Render random wood artifacts */
      love.graphics.setColor(.8, .8, .8, 1);
      love.graphics.line(x + 4, y + height * 0.2, x + width * 0.7, y + height * 0.2);
      love.graphics.line(x + 8, y + height * 0.4, x + width * 0.3, y + height * 0.4);
      love.graphics.line(x + width, y + height * 0.75, x + width - (width * 0.6), y + height * 0.75);
    }
    /*
    render_block(this.x + this.width / 2 - 28, this.y - base_thickness - 8 - 16, 56, 16);
    */
    render_log(this.x + this.width / 2 - 28, this.y - base_thickness - 8 - 28, 56, 16);
    render_log(this.x + this.width / 2 - 21, this.y - base_thickness - 8 - 28, 42, 12);
    render_log(this.x + this.width / 2 - 25, this.y - base_thickness - 8 - 16, 48, 16);
  }
  private draw_mask() {
    this.set_masking_color();
    /** Base */
    const base_thickness = 11;
    love.graphics.rectangle(
      'fill',
      this.x, this.y - this.base_height - base_thickness,
      this.width, this.base_height
    );
    love.graphics.polygon(
      'fill',
      this.x, this.y - base_thickness,
      this.x, this.y,
      this.x + this.width, this.y,
      this.x + this.width, this.y - base_thickness,
    );
    love.graphics.rectangle(
      'fill',
      this.x - 10,
      this.y - this.base_height - base_thickness - 4,
      this.width + 20, this.base_height + 26
    );
    /** Fireplace */

  }
}