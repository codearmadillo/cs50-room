import { Player } from "./classes/player";
import { FirstRoom } from "./classes/room";
import { Game } from "./controllers/game-controller";
import { IRoom } from "./interfaces/room";

const game = new Game();

love.conf = (c) => {
  c.console = true;
};
love.load = () => {
  /** Load game */
  game.load();
}
love.update = (dt) => {
  game.update(dt);
}
love.draw = () => {
  game.draw();
}