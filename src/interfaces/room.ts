import { GameObject } from "../classes/game-object";
import { BouncingBoxConstraints } from "../types/boucing-box";

export interface IRoom {
  constraints : BouncingBoxConstraints;
  update(dt : number) : void;
  draw() : void;
  readonly static_objects : GameObject[];
}