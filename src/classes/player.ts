import { Joystick } from "love.joystick";
import { Game } from "../controllers/game-controller";

export class Player {
  private speed : number = 250;
  private width : number = 48;
  private height : number = 48;
  private _x : number = 0;
  private _y : number = 0;
  public get x() { return this._x; };
  public get y() { return this._y; };
  private dx : number = 0;
  private dy : number = 0;
  private readonly controller : Joystick;
  private readonly controller_deadzone : number = 0.25;
  constructor(
    private readonly game : Game,
    x : number,
    y : number,
    private readonly controls : 'controller' | 'keyboard'
  ) {
    this._x = x;
    this._y = y;
    /** Get controller */
    this.controller = love.joystick.getJoysticks()?.[0] || null;
  }
  update(dt : number) : void {
    /** Increase velocity */
    this.movement();
    /** X axis */
    if(this.dx !== 0) {
      if(this.collides('x')) {
        this.dx = 0;
      }
    }
    if(this.dy !== 0) {
      if(this.collides('y')) {
        this.dy = 0;
      }
    }
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
  }
  /**
   * Checks collision provided axis
   * @param axis 
   */
  private collides(axis : 'x' | 'y') : boolean {
    /** Define empty position that will be used for checking */
    let offset : number = 5;
    let position : number;
    /** Assign it */
    if(axis === 'x') {
      position = this.dx > 0 ? this.x + this.width + offset : this.x - offset;
    } else {
      position = this.dy > 0 ? this.y + this.height + offset : this.y - offset;
    }
    /** Check room boundaries */
    if(axis === 'x') {
      if(position <= this.game.room.constraints.left || position >= this.game.room.constraints.right) {
        return true;
      }
    } else {
      if(position <= this.game.room.constraints.top || position >= this.game.room.constraints.bottom) {
        return true;
      }
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