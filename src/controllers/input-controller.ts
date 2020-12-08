import { KeyboardControls } from "../config/keyboard-controls";
import { KeyDefinitions } from "../types/input";
import { InputController as IInputController } from '../interfaces/input';
import { KeyConstant } from "love.keyboard";

export class InputController implements IInputController {
  constructor(private readonly bindings : {[key in keyof typeof KeyDefinitions]: KeyConstant} ) { }
  isPressed(key : KeyDefinitions) : boolean {
    return love.keyboard.isDown(this.bindings[key]);
  }
}
