export interface IRoom {
  constraints : {
    left : number,
    right : number,
    bottom : number,
    top : number,
  }
  onEnter() : void;
  onExit() : void;
  update(dt : number) : void;
  draw() : void;
}