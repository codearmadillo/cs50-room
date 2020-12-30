import { data } from "love";
import { Joystick } from "love.joystick";
import { isDown } from "love.keyboard";
import { environment } from "../config/environment";
import { Game } from "../controllers/game-controller";
import { BouncingBoxConstraints } from "../types/boucing-box";
import { GameObject } from "./game-object";
import { InteractiveObject } from "./interactive_object";
import { StaticObject } from "./static-object";
import { Utils } from "./utils";

export class Player extends StaticObject {
  /** Size */
  readonly width : number = 32;
  readonly height : number = 48;
  private readonly head_width = this.width * 0.66;
  private readonly head_height = this.height * 0.35;
  private readonly body_width = this.width * 0.8;
  private readonly body_height = this.height * 0.4;
  public get mask_threshold() { return this.bouncing_box.y2 }
  /** Movement speed */
  private speed : number = 200;
  /** Simple animation */
  private animation_speed : number = 0.1;
  private leg_state : -1 | 0 | 1 = -1;
  private leg_state_n : number = 0;
  /** Velocity */
  public dx : number = 0;
  public dy : number = 0;
  /** Controller */
  private readonly controller : Joystick;
  private readonly controller_deadzone : number = 0.25;
  /** Bouncing box */
  public get bouncing_box() : BouncingBoxConstraints {
    return {
      x1: this.x + 5,
      y1: this.y + this.height - 15,
      x2: this.x + this.width - 5,
      y2: this.y + this.height + 5
    }
  }
  public get interaction_box() : BouncingBoxConstraints {
    return {
      x1: this.x - 35,
      y1: this.y - 35,
      x2: this.x + this.width + 35,
      y2: this.y + this.height + 35
    }
  }
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
    /** Animation */
    if(this.dx === 0 && this.dy === 0) {
      this.leg_state = -1;
      this.leg_state_n = 0;
    } else {
      this.leg_state_n += this.animation_speed;
      if(this.leg_state_n >= 1) {
        switch(this.leg_state) {
          case -1:
            this.leg_state = 0;
            break;
          case 0:
            this.leg_state = 1;
            break;
          case 1:
            this.leg_state = 0;
            break;
        }
        this.leg_state_n = 0;
      }
    }
  }
  draw() : void {
    /** draw body */
    this.draw_legs();
    this.draw_body();
    this.draw_head();
    /** bbox */
    if(environment.showBouncingBoxes) {
      this.draw_bouncing_box([1, 0, 0, .5]);
    }
    if(environment.showInteractionRadius) {
      this.draw_interaction_box();
    }
  }
  draw_action(object : InteractiveObject) : boolean {
    if(Utils.BoxBoxCollision(object.interaction_box, this.interaction_box)) {
      return true;
    }
    return false;
  }
  private draw_legs() {
    const draw_leg = (x : number, id : 0 | 1) => {
      /** base height */
      let height = this.height - (this.head_height + this.body_height);
      /** adjust based on current leg state */
      if(this.leg_state !== -1 && this.leg_state !== id) {
        height -= 3;
      }
      /** render */
      love.graphics.setColor(0, 0, 0, 1);
      love.graphics.rectangle(
        'fill', x, this.y + this.head_height + this.body_height, 8, height, 2
      );
      love.graphics.setColor(1, 1, 1, 1);
      love.graphics.rectangle(
        'line', x, this.y + this.head_height + this.body_height, 8, height, 2
      );
    }
    const leg_offset = (this.width - this.body_width) / 2;
    draw_leg(this.x + leg_offset + 3, 0);
    draw_leg(this.x + this.width - leg_offset - 3 - 8, 1);
  }
  private draw_body() {
    const draw = (side : 'up' | 'down') => {
      /** set color */
      if(side === 'down') {
        love.graphics.setColor(0.9, 0.9, 0.9, 1);
      } else {
        love.graphics.setColor(0.8, 0.8, 0.8, 1);
      }
      love.graphics.rectangle(
        'fill',
        this.x + (this.width - this.body_width) / 2, this.y + this.body_height,
        this.body_width, this.body_height,
        2, 2
      );
    }
    /** render */
    if(this.dy === 0 && this.dx === 0) {
      draw('down');
    } else {
      if(this.dy < 0) {
        draw('up');
      } else {
        draw('down');
      }
    }
  }
  private draw_head() {
    /** callbacks */
    const down = () => {
      love.graphics.setColor(0, 0, 0, 1);
      love.graphics.rectangle(
        'fill', this.x + (this.width - this.head_width) / 2, this.y, this.head_width, this.head_height
      );
      love.graphics.setColor(1, 1, 1, 1);
      love.graphics.rectangle(
        'line', this.x + (this.width - this.head_width) / 2, this.y, this.head_width, this.head_height
      );
      /** eyes */
      love.graphics.setPointSize(3);
      love.graphics.points(this.x + (this.width / 2) - 5, this.y + this.head_height * 0.4, this.x + (this.width / 2) + 5, this.y + this.head_height * 0.4);
      /** hair */
      love.graphics.polygon(
        'fill',
        this.x + (this.width - this.head_width) / 2, this.y + this.head_height,
        this.x + this.width - (this.width - this.head_width) / 2, this.y + this.head_height,
        this.x + this.width / 2, this.y + this.head_height + 5
      );
    }
    const up = () => {
      love.graphics.rectangle(
        'fill', this.x + (this.width - this.head_width) / 2, this.y, this.head_width, this.head_height
      );
      /** hair */
      love.graphics.polygon(
        'fill',
        this.x + (this.width - this.head_width) / 2, this.y + this.head_height,
        this.x + this.width - (this.width - this.head_width) / 2, this.y + this.head_height,
        this.x + this.width / 2, this.y + this.head_height + 5
      );
    }
    /** set color */
    love.graphics.setColor(1, 1, 1, 1);
    /** render */
    if(this.dy === 0 && this.dx === 0) {
      down();
    } else {
      if(this.dy < 0) {
        up();
      } else {
        down();
      }
    }
  }
  private draw_interaction_box(color : [number, number, number, number] = [ 1, 0, 1, .2 ]) {
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
      this._y = this.game.room.constraints.y1 - (this.bouncing_box.y2 - this.bouncing_box.y1);
    }
    if(this.bouncing_box.y2 > this.game.room.constraints.y2 && this.dy > 0) {
      this.dy = 0;
      this._y = this.game.room.constraints.y2 - this.height - 25;
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