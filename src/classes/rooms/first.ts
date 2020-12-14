import { GenericRoom } from "../../abstract/room";
import { IRoom } from "../../interfaces/room";
import { Table } from "../objects/table";
import { Player } from "../player";

export class FirstRoom extends GenericRoom implements IRoom {
  protected readonly daytime : boolean = false;
  constructor(
    protected readonly window_width : number, protected readonly window_height : number
  ) {
    super(window_width, window_height);
  }
  draw() {
    super.draw();
  }
}
