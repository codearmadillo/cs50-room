import { KeyConstant } from "love.keyboard";
import { KeyDefinitions } from "../types/input";

export const KeyboardControls : {[key in keyof typeof KeyDefinitions]: KeyConstant} = {
  PLAYER_UP: 'w',
  PLAYER_DOWN: 's',
  PLAYER_LEFT: 'a',
  PLAYER_RIGHT: 'd'
}