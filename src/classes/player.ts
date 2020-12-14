import { data } from "love";
import { Joystick } from "love.joystick";
import { environment } from "../config/environment";
import { Game } from "../controllers/game-controller";
import { BouncingBoxConstraints } from "../types/boucing-box";
import { GameObject } from "./game-object";
import { StaticObject } from "./static-object";
import { Utils } from "./utils";

export class Player extends StaticObject {
  /** Size */
  readonly width : number = 26;
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
    /** Room collisions */
    this.room_collision();
    /** Check collisions */
    this.narrow_collision(
      this.broad_collision(),
      dt
    );
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

    /** render player */


    if(environment.showBouncingBoxes) {
      this.draw_bouncing_box([1, 0, 0, .5]);
    }
  }
  /**
   * Ensures that player does not get out of room
   */
  private room_collision() : void {
    /** horizontal */
    if(this.bouncing_box.x1 < this.game.room.constraints.x1 && this.dx < 0) {
      this.dx = 0;
      this._x = this.game.room.constraints.x1;
    }
    if(this.bouncing_box.x2 > this.game.room.constraints.x2 && this.dx > 0) {
      this.dx = 0;
      this._x = this.game.room.constraints.x2 - this.width;
    }
    /** vertical */
    if(this.bouncing_box.y1 < this.game.room.constraints.y1 && this.dy < 0) {
      this.dy = 0;
      this._y = this.game.room.constraints.y1;
    }
    if(this.bouncing_box.y2 > this.game.room.constraints.y2 && this.dy > 0) {
      this.dy = 0;
      this._y = this.game.room.constraints.y2 - this.height;
    }
  }
  /**
   * Returns an array of objects which are possibly colided
   */
  private broad_collision() : StaticObject[] {
    return this.game.room.game_objects
      .filter((o) => {
        if(o instanceof StaticObject) {
          return Utils.BoxBoxCollision(this.bouncing_box, o.bouncing_box);
        }
        return false;
      });
  }
  /**
   * Sets player speed to 0 if pixel collision on axis is detected
   */
  private narrow_collision(objects : StaticObject[], dt : number) : void {
    objects.forEach((object) => {
      if(this.dx !== 0) {
        const delta = this.dx * dt;
        [ this.bouncing_box.x1 + delta, this.bouncing_box.x2 + delta ].forEach((x, iX) => {
          [ this.bouncing_box.y1, this.bouncing_box.y2 ].forEach((y, iY) => {
            if(Utils.BoxPointCollision(object.bouncing_box, [ x, y ])) {
              if(iX === 0 && this.dx < 0) {
                this.dx = 0;
                return false;
              } else if (iX === 1 && this.dx > 0) {
                this.dx = 0;
                return false;
              }
            }
          });
        });
      }
      /** vertical */
      if(this.dy !== 0) {
        const delta = this.dy * dt;
        [ this.bouncing_box.y1 + delta, this.bouncing_box.y2 + delta ].forEach((y, iY) => {
          [ this.bouncing_box.x1, this.bouncing_box.x2 ].forEach((x, iX) => {
            if(Utils.BoxPointCollision(object.bouncing_box, [ x, y ])) {
              if(iY === 0 && this.dy < 0) {
                this.dy = 0;
                return false;
              } else if (iY === 1 && this.dy > 0) {
                this.dy = 0;
                return false;
              }
            }
          });
        });
      }
    });
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