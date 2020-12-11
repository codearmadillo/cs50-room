import { environment } from "../config/environment";
import { BouncingBoxConstraints } from "../types/boucing-box";
import { GameObject } from "./game-object";
import { Player } from "./player";

export abstract class InteractiveObject extends GameObject {
  public get interaction_box() : BouncingBoxConstraints {
    return {
      x1: this.x - 5,
      y1: this.y - 5,
      x2: this.x + this.width + 5,
      y2: this.y - this.width - 10
    }
  }
  /** Draws action button if required */
  draw_action_if_available(player : Player) {
    if(this.is_within_action_area(player)) {
      love.graphics.setColor(1, 1, 1, 1);
      love.graphics.circle(
        'fill',
        this.x + this.width / 2, this.y - this.height,
        16
      );
      love.graphics.setColor(0, 0, 0, 1);
      love.graphics.setFont(environment.fonts.interaction);
      love.graphics.printf(
        "A",
        this.x + this.width / 2 - 5, this.y - this.height - 10,
        16, "center"
      )
    }
  }
  draw() { }
  draw_interaction_box(color : [number, number, number, number] = [ 1, 0, 1, .2 ]) {
    love.graphics.setColor(color);
    love.graphics.polygon(
      'fill',
      this.interaction_box.x1, this.interaction_box.y1,
      this.interaction_box.x2, this.interaction_box.y1,
      this.interaction_box.x2, this.interaction_box.y2,
      this.interaction_box.x1, this.interaction_box.y2,
      this.interaction_box.x1, this.interaction_box.y1,
    )
  }
  private is_within_action_area(player : Player) : boolean {
    return true;
  }
}