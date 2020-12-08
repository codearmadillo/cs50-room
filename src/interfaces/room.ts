export interface IRoom {
  onEnter() : void;
  onExit() : void;
  update(dt : number) : void;
  draw() : void;
}