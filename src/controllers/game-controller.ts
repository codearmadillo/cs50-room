import { InteractiveObject } from "../classes/interactive_object";
import { Player } from "../classes/player";
import { FirstRoom } from "../classes/rooms/first";
import { StaticObject } from "../classes/static-object";
import { environment } from "../config/environment";
import { IRoom } from "../interfaces/room";

export class Game {
  private readonly window_width : number = 768;
  private readonly window_height : number = 768;
  public room !: IRoom;
  private player !: Player;
  constructor() { }
  load() {
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
    this.player = new Player(
      this,
      this.window_width / 2,
      this.window_height / 2 + 100,
      'keyboard'
    );
    this.room = new FirstRoom(this.window_width, this.window_height);
  }
  update(dt : number) {
    this.room.update(dt);
    this.player.update(dt);
  }
  draw() {
    /** Room and player */
    this.room.draw();
    /** Render objects and player */
    let isPlayerRendered : boolean = false;
    this.room.game_objects.forEach((object) => {
      if(object.mask_threshold < this.player.y) {
        object.draw();
      } else {
        if(!isPlayerRendered) {
          this.player.draw();
          isPlayerRendered = true;
        }
        object.draw();
      }
    });

    /** Collision detection */
    this.room.game_objects.filter((object) => object instanceof StaticObject).forEach((object) => {
      if(this.player.collides_with(object)) {
        love.graphics.setColor(1, 1, 0, 1);
        love.graphics.rectangle('fill', 25, 25, 5, 5);
      }
    });

    /** Light pass */
    // this.room.draw_lightmask();
    /** Draw action for interactive objects */
    this.room.game_objects.filter((object) => object instanceof InteractiveObject).forEach((object) => {
      // (object as InteractiveObject).draw_action_if_available(this.player);
    });
    /** FPS */
    love.graphics.setColor(0, 1, 0, 1);
    love.graphics.print("FPS: " + tostring(love.timer.getFPS( )), 10, 10)
  }
}