import { Room } from "../abstract/room";
import { IRoom } from "../interfaces/room";

export class FirstRoom extends Room implements IRoom {
  onEnter() {
    print('Entered room');
  }
  onExit() {
    print('Exited room');
  }
  draw() {
    super.draw();
  }
}
