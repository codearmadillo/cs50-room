import { GameObject } from "../classes/game-object";
import { InteractiveObject } from "../classes/interactive_object";
import { StaticObject } from "../classes/static-object";
import { BouncingBoxConstraints } from "../types/boucing-box";

export interface IRoom {
  constraints : BouncingBoxConstraints;
  readonly title : string;
  update(dt : number) : void;
  draw() : void;
  draw_lightmask() : void;
  action(item : InteractiveObject) : void;
  readonly game_objects : GameObject[];
}