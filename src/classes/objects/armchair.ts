import { environment } from "../../config/environment";
import { GameObject } from "../game-object";
import { SharedArmatureObject } from "./shared";

export class Armchair extends SharedArmatureObject {
  public readonly width : number = 105;
  public readonly height : number = 160;
  public readonly pillow_count = 1;
  public readonly arm_width;
  constructor(
    protected _x : number,
    protected _y : number
  ) {
    super();this.arm_width = math.max(20, math.min(30, this.width * 0.15));
  }
  draw() {
    const color = love.graphics.getColor();
    love.graphics.setColor(1, 1, 1, 1);
    /** Board */
    this.draw_arms();
    this.draw_base();
    this.draw_back();
    /** Bouncing box */
    if(environment.bouncingBoxes) {
      this.draw_bouncing_box();
    }
    /** Reset */
    love.graphics.setColor(color);
  }
}