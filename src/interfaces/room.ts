import { GameObject } from "../classes/game-object";
import { StaticObject } from "../classes/static-object";
import { BouncingBoxConstraints } from "../types/boucing-box";

export interface IRoom {
  constraints : BouncingBoxConstraints;
  update(dt : number) : void;
  draw() : void;
  draw_lightmask() : void;
  readonly game_objects : GameObject[];
}