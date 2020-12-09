import { StaticObject } from "../classes/static-object";
import { BouncingBoxConstraints } from "../types/boucing-box";

export interface IRoom {
  constraints : BouncingBoxConstraints;
  update(dt : number) : void;
  draw() : void;
  readonly static_objects : StaticObject[];
}