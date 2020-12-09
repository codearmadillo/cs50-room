import { GameObject } from "../game-object";

export abstract class SharedArmatureObject extends GameObject {
  public abstract readonly width : number;
  public abstract readonly height : number;
  public abstract readonly pillow_count : number;
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
      /** Mask */

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
    /** Pillows */
    const pillow_area = this.width - (this.arm_width * 2);
    const pillow_width = math.floor(pillow_area / this.pillow_count);
    const pillow_height = this.height / 3 * 0.4;
    const pillow_spacing = 4;
    const pillow_thickness = math.max(8, math.min(13, pillow_height * 0.6));
    for(let i = 0; i < this.pillow_count; ++i) {
      let x = this.x + this.arm_width + (pillow_spacing / 2) + (i * pillow_width - pillow_spacing / 2);
      let y = this.y - this.height / 3 * 0.85;
      love.graphics.rectangle(
        'line',
        x, y,
        pillow_width - pillow_spacing / 2, pillow_height
      );
      love.graphics.line(
        x, y + pillow_height,
        x + pillow_width - pillow_spacing / 2, y + pillow_height,
        x + pillow_width - pillow_spacing / 2, y + pillow_thickness + pillow_height,
        x, y + pillow_thickness + pillow_height,
        x, y + pillow_height
      )
    }
  }
  protected draw_back() {
    const draw_arc_base = (y_offset : number) => {
      const pillow_height = this.height / 3 * 0.85;
      const base_y = this.y - pillow_height + y_offset;
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
}