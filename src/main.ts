import { environment } from "./config/environment";
import { Game } from "./controllers/game-controller";

const game = new Game();

love.conf = (c) => {
  c.console = true;
};
love.load = () => {
  math.randomseed(os.time());
  /** Set window */
  love.graphics.setDefaultFilter('nearest', 'nearest');
  /** Load assets */
  environment.fonts.interaction = love.graphics.newFont('assets/font.ttf', 20, 'normal');
  /** Load game */
  game.load();
}
love.update = (dt) => {
  game.update(dt);
}
love.draw = () => {
  game.draw();
}