import { GenericRoom } from "../../abstract/room";
import { Game } from "../../controllers/game-controller";
import { IRoom } from "../../interfaces/room";
import { InteractiveObject } from "../interactive_object";
import { Table } from "../objects/table";
import { Player } from "../player";

export class FirstRoom extends GenericRoom implements IRoom {
  protected readonly daytime : boolean = true;
  constructor(
    protected readonly window_width : number, protected readonly window_height : number, readonly title : string, protected readonly game : Game
  ) {
    super(window_width, window_height, title, game);
  }
  draw() {
    super.draw();
  }
  action(item : InteractiveObject) : void {
    print(`Action: ${item.key}`);
  }
}
