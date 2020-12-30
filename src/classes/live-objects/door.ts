import { environment } from "../../config/environment";
import { InteractiveObject } from "../interactive_object";
import { StaticObject } from "../static-object";

export class Door extends InteractiveObject {
  protected readonly scale : number = 1.5;
  public get width() {
    return 52 * this.scale;
  }
  public get height() {
    return 105 * this.scale;
  }
  public get bouncing_box() {
    return {
      x1: this.x - 2,
      y1: this.y + 2,
      x2: this.x + this.width + 2,
      y2: this.y - this.height - 2
    }
  }
  constructor(
    protected _x : number,
    protected _y : number,
    readonly key : string
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
    love.graphics.line(
      this.x, this.y,
      this.x, this.y - this.height,
      this.x + this.width, this.y - this.height,
      this.x + this.width, this.y
    );
    love.graphics.rectangle('line', this.x + 5, this.y + 5 - this.height, this.width - 10, this.height / 2 - 10
    );
    love.graphics.rectangle('line', this.x + 5, this.y + 5 - this.height / 2, this.width - 10, this.height / 2 - 10
    );
    /** Handle */
    love.graphics.line(this.x + this.width - 10, this.y - this.height / 2, this.x + this.width - 5, this.y - this.height / 2);
    /** Bouncing box */
    if(environment.showBouncingBoxes) {
      this.draw_bouncing_box();
    }
    if(environment.showInteractionRadius) {
      this.draw_interaction_box();
    }
    /** Reset */
    love.graphics.setColor(color);
  }
  private draw_mask() {
    love.graphics.setColor(0, 0, 0, .5);
    /** Draw */
    love.graphics.rectangle('fill', this.x, this.y - this.height, this.width, this.height);
  }
}