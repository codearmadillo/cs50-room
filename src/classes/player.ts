import { InputController } from "../interfaces/input";
import { KeyDefinitions } from "../types/input";

export class Player {
  private speed : number = 300;
  private width : number = 48;
  private height : number = 48;
  private _x : number = 0;
  private _y : number = 0;
  public get x() { return this._x; };
  public get y() { return this._y; };
  private dx : number = 0;
  private dy : number = 0;
  constructor(
    x : number,
    y : number,
    private readonly inputController : InputController
  ) {
    this._x = x;
    this._y = y;
  }
  update(dt : number) : void {
    this.movement();
    /** Update position */
    this._x += this.dx * dt;
    this._y += this.dy * dt;
  }
  draw() : void {
    love.graphics.setColor(1, 1, 1, 1);
    love.graphics.rectangle(
      'fill',
      this.x + this.width / 2, this.y + this.height / 2,
      this.width, this.height
    );
  }
  private movement() {
    /** Vertical */
    const down = this.inputController.isPressed(KeyDefinitions.PLAYER_DOWN);
    const up = this.inputController.isPressed(KeyDefinitions.PLAYER_UP);
    if(down && up) {
      this.dy = 0;
    } else {
      if(down) {
        this.dy = this.speed;
      } else if(up) {
        this.dy = -this.speed;
      } else {
        this.dy = 0;
      }
    }
    /** Horizontal */
    const left = this.inputController.isPressed(KeyDefinitions.PLAYER_LEFT);
    const right = this.inputController.isPressed(KeyDefinitions.PLAYER_RIGHT);
    if(left && right) {
      this.dx = 0;
    } else {
      if(right) {
        this.dx = this.speed;
      } else if (left) {
        this.dx = -this.speed;
      } else {
        this.dx = 0;
      }
    }
  }
}