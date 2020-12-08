import { DrawMode } from "love.graphics";
import { environment } from "../../config/environment";
import { GameObject } from "../game-object";

export class Fireplace extends GameObject {
  public readonly width : number = 125;
  public readonly height : number = 85;
  constructor(
    protected _x : number,
    protected _y : number
  ) {
    super();
  }
  draw() {
    const color = love.graphics.getColor();
    love.graphics.setColor(1, 1, 1, 1);
    /** Top board */
    this.draw_base();
    this.draw_fireplace();
    this.draw_top_board();
    /** Bouncing box */
    if(environment.bouncingBoxes) {
      this.draw_bouncing_box();
    }
    /** Reset */
    love.graphics.setColor(color);
  }
  private draw_top_board() {
    const height = 35;
    const thickness = 7;
    /** Mask */
    love.graphics.setColor(0, 0, 0, 1);
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
    const height = 35;
    const thickness = 11;
    love.graphics.rectangle(
      'line',
      this.x, this.y - height - thickness,
      this.width, height
    );
    love.graphics.line(
      this.x, this.y - thickness,
      this.x, this.y,
      this.x + this.width, this.y,
      this.x + this.width, this.y - thickness,
    );
  }
  private draw_fireplace() {
    const base_height = 35;
    const base_thickness = 11;
    const conn_size = 25;
    /** Pillars */
    (['fill', 'line'] as DrawMode[]).forEach((mode) => {
      if(mode === 'fill') {
        love.graphics.setColor(0, 0, 0, 1);
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
    const render_block = (x : number, y : number, width : number, height : number) => {
      const arr = [];
      for(let i = 0; i < height; i++) {
        arr.push(1 - i * 0.2);
      }
      arr.forEach((colour, j) => {
        love.graphics.setColor(colour, colour, colour, 1);
        love.graphics.line(x, y - j, x + width, y - j);
      });
    }
    render_block(this.x, this.y - 300, 35, 8);
  }
}