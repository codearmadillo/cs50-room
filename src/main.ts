import { play } from "love.audio";
import { environment } from "./config/environment";
import { Game } from "./controllers/game-controller";

class Player {
  get width() { return 32; }
  get height() { return 32; }
  get box() {
    return {
      x1: this.x,
      y1: this.y,
      x2: this.x + this.width,
      y2: this.y + this.height
    }
  }
  get speed() { return 150; }
  public dx : number = 0;
  public dy : number = 0;
  constructor(public x : number, public y : number) { }
}
class Box {
  get width() { return 32; }
  get height() { return 32; }
  get box() {
    return {
      x1: this.x,
      y1: this.y,
      x2: this.x + this.width,
      y2: this.y + this.height
    }
  }
  constructor(public x : number, public y : number) { }
}

const game = new Game();
const player = new Player(50, 50);
const box = new Box(150, 150);

love.conf = (c) => {
  c.console = true;
};
love.load = () => {
  return;
  math.randomseed(os.time());
  /** Set window */
  love.graphics.setDefaultFilter('nearest', 'nearest');
  /** Load assets */
  environment.fonts.interaction = love.graphics.newFont('assets/font.ttf', 20, 'normal');
  /** Load game */
  game.load();
}
love.update = (dt) => {
  /** ctrls */
  if(love.keyboard.isDown('w')) {
    player.dy = -player.speed;
  } else if(love.keyboard.isDown('s')) {
    player.dy = player.speed;
  } else {
    player.dy = 0;
  }
  if(love.keyboard.isDown('a')) {
    player.dx = -player.speed;
  } else if(love.keyboard.isDown('d')) {
    player.dx = player.speed;
  } else {
    player.dx = 0;
  }
  /** calculate movement */
  let move_x = player.dx * dt;
  let move_y = player.dy * dt;
  const collision = {
    x: false,
    y: false
  }
  /** collisions */
  if(player.box.y1 < box.box.y2 && player.box.y2 > box.box.y1) {
    collision.y = true;
    if(player.box.x1 < box.box.x2 && player.box.x2 > box.box.x1) {
      if(player.box.y2 <= box.box.y2 && player.dy > 0 || player.box.y1 > box.box.y1 && player.dy < 0) {
        move_y = 0;
        player.dy = 0;
      }
    }
  }
  if(player.box.x1 < box.box.x2 && player.box.x2 > box.box.x1) {
    collision.x = true;
    if(player.box.y1 < box.box.y2 && player.box.y2 > box.box.y1) {
      if(player.box.x2 <= box.box.x2 && player.dx > 0 || player.box.x1 > box.box.x1 && player.dx < 0) {
        move_x = 0;
        player.dx = 0;
      }
    }
  }
  /** clipping on X on the right */
  if(collision.y) {
    if(move_x > 0 && player.box.x2 < box.box.x2) {
      if(player.box.x2 + move_x > box.box.x1) {
        move_x = -(player.box.x2 + move_x - box.box.x1);
      }
    } else if (move_x < 0 && player.box.x1 > box.box.x1) {
      if(player.box.x1 + move_x < box.box.x2) {
        move_x = box.box.x2 - (player.box.x1 + move_x);
      }
    }
  }
  /** clipping on Y */
  if(collision.x) {
    if(move_y > 0 && player.box.y2 < box.box.y2) {
      if(player.box.y2 + move_y > box.box.y1) {
        move_y = -(player.box.y2 + move_y - box.box.y1);
      }
    } else if(move_y < 0 && player.box.y1 > box.box.y1) {
      if(player.box.y1 + move_y < box.box.y2) {
        move_y = box.box.y2 - (player.box.y1 + move_y);
      }
    }
  }
  /** increase position */
  player.x += move_x;
  player.y += move_y;
  return;
  game.update(dt);
}
love.draw = () => {
  love.graphics.setColor(1, 1, 1, 1);
  love.graphics.rectangle('fill', player.x, player.y, player.width, player.height);
  love.graphics.setColor(1, 0, 0, 1);
  love.graphics.rectangle('fill', box.x, box.y, box.width, box.height);
  return;
  game.draw();
}