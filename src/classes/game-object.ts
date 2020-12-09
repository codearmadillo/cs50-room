export abstract class GameObject {
  /** Position */
  protected _x : number = 0;
  protected _y : number = 0;
  public get x() { return this._x; };
  public get y() { return this._y; };
  /** Size */
  abstract readonly width : number;
  abstract readonly height : number;
}