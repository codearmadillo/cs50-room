import { Joystick } from "love.joystick";
import { environment } from "../config/environment";
import { Game } from "../controllers/game-controller";
import { BouncingBoxConstraints } from "../types/boucing-box";
import { GameObject } from "./game-object";
import { StaticObject } from "./static-object";

export class Player extends StaticObject {
  /** Size */
  readonly width : number = 48;
  readonly height : number = 48;
  /** Movement speed */
  private speed : number = 250;
  /** Velocity */
  public dx : number = 0;
  public dy : number = 0;
  /** Controller */
  private readonly controller : Joystick;
  private readonly controller_deadzone : number = 0.25;
  /** Constructor */
  constructor(
    private readonly game : Game,
    x : number,
    y : number,
    private readonly controls : 'controller' | 'keyboard'
  ) {
    super();
    this._x = x;
    this._y = y;
    /** Get controller */
    this.controller = love.joystick.getJoysticks()?.[0] || null;
  }
  update(dt : number) : void {
    /** Increase velocity */
    this.movement();
    /** Check collisions */
    this.check_collisions_with_static_objects();
    /** Update position */
    this._x += this.dx * dt;
    this._y += this.dy * dt;
  }
  draw() : void {
    love.graphics.setColor(1, 1, 1, 1);
    love.graphics.rectangle(
      'fill',
      this.x, this.y,
      this.width, this.height
    );
    if(environment.showBouncingBoxes) {
      this.draw_bouncing_box([1, 0, 0, .5]);
    }
  }
  check_collisions_with_static_objects() {
    this.game.room.game_objects.filter((object) => object instanceof StaticObject).forEach((object) => {
      if(this.collides_with(object.bouncing_box)) {
        const collision = {
          x: 0,
          y: 0
        }
        /** x - left side */
        if(this.bouncing_box.x2 - this.width / 2 > object.bouncing_box.x1 && this.dx < 0) {
          this.dx = 0;
        }
        /** x - right side */
        if(this.bouncing_box.x1 + this.width / 2 < object.bouncing_box.x2 && this.dx > 0) {
          this.dx = 0;
        }
        /** y - top side */
        if(this.bouncing_box.y2 > object.bouncing_box.y1 && this.dy > 0) {
          this.dy = 0;
        }
        /** y - bottom side */
        if(this.bouncing_box.y1 < object.bouncing_box.y2 && this.dy < 0) {
          this.dy = 0;
        }
        /** break */
        return false;
      }
    });
  }
  private collides_with(constraints : BouncingBoxConstraints) : boolean {
    if(
      this.bouncing_box.x1 < constraints.x2 &&
      this.bouncing_box.x2 > constraints.x1 &&
      this.bouncing_box.y1 < constraints.y2 &&
      this.bouncing_box.y2 > constraints.y1
    ) {
      return true;
    }
    return false;
  }
  private movement() {
    /** Define input */
    const input = { up: false, down: false, left: false, right: false };
    /** Check */
    if(this.controls === 'controller' && this.controller && this.controller.isConnected()) {
      /** Get axis */
      let axis_x = this.controller.getAxis(1);
      let axis_y = this.controller.getAxis(2);
      /** Evaluate movemen tvalue */
      if(math.abs(axis_y) < this.controller_deadzone) {
        input.up = false;
        input.down = false;
      } else {
        if(1 * (axis_y / math.abs(axis_y)) < 0) {
          input.up = true;
        } else {
          input.down = true;
        }
      }
      if(math.abs(axis_x) < this.controller_deadzone) {
        input.right = false;
        input.left = false;
      } else {
        if(1 * (axis_x / math.abs(axis_x)) < 0) {
          input.left = true;
        } else {
          input.right = true;
        }
      }
    } else {
      input.up = love.keyboard.isDown('w');
      input.down = love.keyboard.isDown('s');
      input.left = love.keyboard.isDown('a');
      input.right = love.keyboard.isDown('d');
    }
    /** Change velocity on Y */
    if(input.down && input.up) {
      this.dy = 0;
    } else {
      if(input.down) {
        this.dy = this.speed;
      } else if(input.up) {
        this.dy = -this.speed;
      } else {
        this.dy = 0;
      }
    }
    /** Change velocity on X */
    if(input.left && input.right) {
      this.dx = 0;
    } else {
      if(input.right) {
        this.dx = this.speed;
      } else if (input.left) {
        this.dx = -this.speed;
      } else {
        this.dx = 0;
      }
    }
  }
}