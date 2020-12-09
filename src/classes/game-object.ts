import { environment } from "../config/environment";

export abstract class GameObject {
  /** Position */
  protected _x : number = 0;
  protected _y : number = 0;
  public get x() { return this._x; };
  public get y() { return this._y; };
  /** Size */
  abstract readonly width : number;
  abstract readonly height : number;
  protected set_masking_color() {
    if(environment.showMasks) {
      love.graphics.setColor(0, 1, 0, .3);
    } else {
      love.graphics.setColor(0, 0, 0, 1);
    }
  }
}