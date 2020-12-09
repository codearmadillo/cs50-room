import { Player } from "../classes/player";
import { FirstRoom } from "../classes/rooms/first";
import { IRoom } from "../interfaces/room";

export class Game {
  private readonly window_width : number = 768;
  private readonly window_height : number = 768;
  public room !: IRoom;
  private player !: Player;
  constructor() { }
  load() {
    /** Set window */
    love.graphics.setDefaultFilter('nearest', 'nearest');
    love.window.setMode(
      this.window_width,
      this.window_height,
      {
        fullscreen: false,
        vsync: true,
        resizable: false,
        borderless: false,
        centered: true
      }
    );
    love.graphics.setBackgroundColor(0, 0, 0, 1);
    /** Create player and room */
    this.room = new FirstRoom(this.window_width, this.window_height, this.player);
    this.player = new Player(
      this,
      this.window_width / 2,
      this.window_height / 2 + 100,
      'keyboard'
    );
  }
  update(dt : number) {
    this.room.update(dt);
    this.player.update(dt);
  }
  draw() {
    /** Room and player */
    this.room.draw();
    /** FPS */
    love.graphics.setColor(0, 1, 0, 1);
    love.graphics.print("FPS: " + tostring(love.timer.getFPS( )), 10, 10)
  }
}