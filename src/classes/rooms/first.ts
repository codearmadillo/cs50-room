import { GenericRoom } from "../../abstract/room";
import { IRoom } from "../../interfaces/room";
import { Table } from "../objects/table";

export class FirstRoom extends GenericRoom implements IRoom {
  draw() {
    super.draw();
  }
}
