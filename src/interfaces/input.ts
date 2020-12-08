import { KeyDefinitions } from "../types/input";

export interface InputController {
  isPressed(key : KeyDefinitions) : boolean;
}