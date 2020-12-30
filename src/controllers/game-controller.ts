import { KeyConstant } from "love.keyboard";
import { InteractiveObject } from "../classes/interactive_object";
import { Player } from "../classes/player";
import { FirstRoom } from "../classes/rooms/first";
import { StaticObject } from "../classes/static-object";
import { UiManager } from "../classes/ui-manager";
import { environment } from "../config/environment";
import { IRoom } from "../interfaces/room";

export class Game {

  private counter : number = 0;

  private readonly window_width : number = 768;
  private readonly window_height : number = 768;
  private action_item : null | InteractiveObject = null;
  public room !: IRoom;
  private player !: Player;
  private visited : { [key : string] : number } = { };
  private get isCurrentRoomReplayed() {
    return this.visited[this.room.title] !== undefined && this.visited[this.room.title] > 1;
  }
  private uiManager !: UiManager;
  private state : 'overlay' | 'play' = 'play';
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
    this.uiManager = new UiManager(this.window_width, this.window_height);
    /** Create player and room */
    this.player = new Player(
      this,
      this.window_width / 2 + 100,
      this.window_height / 2 + 100,
      'keyboard'
    );
    this.change_room(new FirstRoom(this.window_width, this.window_height, 'first', this));
  }
  update(dt : number) {
    /** Update room */
    this.room.update(dt);
    /** Set state */
    this.state = this.uiManager.is_message_visible ? 'overlay' : 'play';
    /** Update */
    if(this.state === 'play') {
      this.player.update(dt);
      /** action items */
      this.room.game_objects.filter((object) => object instanceof InteractiveObject).forEach((object, i, a) => {
        const is_action = this.player.draw_action(object as InteractiveObject);
        if(is_action) {
          this.action_item = object as InteractiveObject;
          return false;
        }
        this.action_item = null;
      });
    } else {
      // Overlay
    }
  }
  draw() {
    /** Room and player */
    this.room.draw();
    /** Render objects and player */
    let isPlayerRendered : boolean = false;
    this.room.game_objects.forEach((object) => {
      if(object.mask_threshold < this.player.mask_threshold) {
        object.draw();
      } else {
        if(!isPlayerRendered) {
          this.player.draw();
          isPlayerRendered = true;
        }
        object.draw();
      }
    });
    /** Light pass */
    this.room.draw_lightmask();
    /** Draw helper */
    if(!this.isCurrentRoomReplayed) {
      // love.graphics.rectangle('fill', 0, 0, 50, 50);
    }
    /** Player action */
    if(this.action_item) {
      this.draw_action_indicator();
    }
    /** UI */
    this.uiManager.draw();
  }
  keypressed(key : KeyConstant) : void {
    if(key === 'space') {
      this.counter++;
      this.uiManager.message(`Message ${this.counter}`, () => {
        print('Message closed');
      });
    }
    if(key === 'f' && this.action_item) {
      this.room.action(this.action_item);
    }
  }
  mousereleased() {
    this.uiManager.mousereleased();
  }
  change_room(room : IRoom) : void {
    this.room = room;
    if(this.visited.hasOwnProperty(room.title)) {
      this.visited[room.title] += 1;
    } else {
      this.visited[room.title] = 1;
    }
  }
  private draw_action_indicator() {
    love.graphics.setColor(1, 1, 1, 1);
    love.graphics.circle(
      'fill',
      this.player.x + this.player.width / 2, this.player.y - 38,
      18, 18
    );
    love.graphics.setColor(0, 0, 0, 1);
    love.graphics.printf(
      "F",
      this.player.x + this.player.width / 2 - 8, this.player.y - 44,
      18, "center"
    )
  }
}