import { Room } from "../abstract/room";
import { IRoom } from "../interfaces/room";
import { Table } from "./objects/table";

export class FirstRoom extends Room implements IRoom {
  constructor(
    protected readonly window_width : number, protected readonly window_height : number
  ) {
    super(window_width, window_height);
    /** Register objects */
    this.add_scene_object(new Table(250, 250, 160, 95));
  }
  draw() {
    super.draw();
  }
}
