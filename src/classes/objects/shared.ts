import { StaticObject } from "../static-object";

export abstract class SharedArmatureObject extends StaticObject {
  public abstract readonly width : number;
  public abstract readonly height : number;
  public abstract readonly pillow_count : number;
  public get bouncing_box() {
    return {
      x1: this.x - 2,
      y1: this.y - this.height * 0.45,
      x2: this.x + this.width + 2,
      y2: this.y + 5
    }
  }
  get pillow_area() { return this.width - (this.arm_width * 2); }
  get pillow_width() { return math.floor(this.pillow_area / this.pillow_count); }
  get pillow_height() { return this.height / 3 * 0.4; }
  get pillow_spacing() { return 4; }
  get pillow_thickness() { return math.max(8, math.min(13, this.pillow_height * 0.6)); }
  protected abstract readonly arm_width : number;
  protected draw_arms() {
    // love.graphics.arc('fill', 'open', this.x, this.y, 100, 0, -math.pi)
    for(let i = 0; i < 2; ++i) {
      /** Front */
      love.graphics.line(
        this.x + i * (this.width - this.arm_width), this.y - this.height / 3,
        this.x + i * (this.width - this.arm_width), this.y,
        this.x + i * (this.width - this.arm_width) + this.arm_width, this.y,
        this.x + i * (this.width - this.arm_width) + this.arm_width, this.y - this.height / 3
      );
      love.graphics.arc('line', 'open', this.x + i * (this.width - this.arm_width) + this.arm_width / 2, this.y - this.height / 3, this.arm_width / 2, 0, -math.pi);
      /** Back */
      love.graphics.arc(
        'line', 'open',
        this.x + i * (this.width - this.arm_width) + this.arm_width / 2, this.y - this.height / 2,
        this.arm_width / 2, 0, -math.pi
      );
      for(let j = 0; j < 2; ++j) {
        love.graphics.line(
          this.x + i * (this.width - this.arm_width) + j * this.arm_width, this.y - this.height / 3,
          this.x + i * (this.width - this.arm_width) + j * this.arm_width, this.y - this.height / 2
        )
      }
    }
  }
  protected draw_base() {
    /** Base */
    love.graphics.line(this.x + this.arm_width, this.y, this.x + (this.width - this.arm_width), this.y);
    for(let i = 0; i < this.pillow_count; ++i) {
      let x = this.x + this.arm_width + (this.pillow_spacing / 2) + (i * this.pillow_width - this.pillow_spacing / 2);
      let y = this.y - this.height / 3 * 0.85;
      love.graphics.rectangle(
        'line',
        x, y,
        this.pillow_width - this.pillow_spacing / 2, this.pillow_height
      );
      love.graphics.line(
        x, y + this.pillow_height,
        x + this.pillow_width - this.pillow_spacing / 2, y + this.pillow_height,
        x + this.pillow_width - this.pillow_spacing / 2, y + this.pillow_thickness + this.pillow_height,
        x, y + this.pillow_thickness + this.pillow_height,
        x, y + this.pillow_height
      )
    }
  }
  protected draw_back() {
    const draw_arc_base = (y_offset : number) => {
      const base_y = this.y - this.pillow_height + y_offset;
      const height = this.height * 0.25;
      /** Left */
      love.graphics.line(this.x + this.arm_width + 2, base_y - height, this.x + this.arm_width + 2, base_y);
      love.graphics.arc(
        'line', 'open',
        this.x + this.arm_width + 2 + height * 0.5, base_y - height,
        height * 0.5,
        math.pi + math.pi / 2, math.pi
      );
      /** Right */
      love.graphics.line(this.x + this.width - this.arm_width - 2, base_y - height, this.x + this.width - this.arm_width - 2, base_y);
      love.graphics.arc(
        'line', 'open',
        this.x + this.width - this.arm_width - 2 - height * 0.5, base_y - height,
        height * 0.5,
        0, -math.pi / 2
      );
      /** Base */
      love.graphics.line(
        this.x + this.arm_width + 2 + height * 0.5, base_y - height - (height * 0.5),
        this.x + this.width - this.arm_width - 2 - height * 0.5, base_y - height - (height * 0.5)
      );
    }
    draw_arc_base(-12);
    draw_arc_base(0);
  }
  protected draw_mask() {
    this.set_masking_color();
    const back_height = this.height * 0.25;
    const back_base_y = this.y - this.pillow_height;
    /** Sides and base */
    love.graphics.rectangle('fill', this.x, this.y, this.width, - (this.height / 2));
    for(let i = 0; i < 2; ++i) {
      love.graphics.arc('fill', 'closed', this.x + this.arm_width / 2 + (i * (this.width - this.arm_width)), this.y - (this.height / 2), this.arm_width / 2, -math.pi, 0);
    }
    /** Top */
    love.graphics.rectangle('fill', this.x + this.arm_width, this.y, this.width - this.arm_width * 2, -this.height * 0.59);
  }
}