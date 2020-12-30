import { DrawMode, Font, Text } from "love.graphics";
import { close } from "love.window";
import { environment } from "../config/environment";
import { BouncingBoxConstraints } from "../types/boucing-box";
import { Utils } from "./utils";

class Message {
  constructor(public readonly message : Text, public lines : number, public bouncing_box : BouncingBoxConstraints, public readonly callback? : () => void) {

  }
}
export class UiManager {
  private messages : Message[] = [];
  private get has_messages() {
    return this.messages.length > 0;
  }
  private get message_width() {
    return this.window_width * 0.7;
  }
  private get message_height() {
    return 250;
  }
  private get message_box() {
    const base_x = this.window_width / 2 - this.message_width / 2;
    const base_y = this.window_height / 2 - this.message_height / 2;
    return {
      x1: base_x,
      y1: base_y,
      x2: base_x + this.message_width,
      y2: base_y + this.message_height
    }
  }
  get is_message_visible() {
    return this.has_messages === true;
  }
  constructor(
    private readonly window_width : number,
    private readonly window_height : number
  ) { }
  message(message : string, closeCallback? : () => void) : void {

    return;
    let base_x = this.window_width / 2 - this.message_width / 2;
    let base_y = this.window_height / 2 - this.message_height / 2;
    let lines = 1;
    /** Calculate message offsets */
    let height = 36 + lines * (environment.fonts.interaction as Font).getHeight();
    message = message.split('').map((j, i) => {
      if(i > 0 && i % 45 === 0) {
        lines += 1;
        return `${j}\n`;
      }
      return j;
    }).join('');
    this.messages.push(
      new Message(
        love.graphics.newText(
          environment.fonts.interaction,
          message
        ),
        lines,
        {
          x1: base_x, y1: this.window_height / 2 - height / 2,
          x2: base_x + this.message_width, y2: base_y + height
        },
        closeCallback
      )
    );
  }
  mousereleased() {
    if(this.has_messages) {
      print('click');
    }
  }
  draw() {
    /** Messages */
    if(this.has_messages) {
      for(let i = 0; i < this.messages.length; ++i) {
        /** Render backdrop */
        if(i === this.messages.length - 1) {
          love.graphics.setColor(0, 0, 0, .65);
          love.graphics.rectangle('fill', 0, 0, this.window_width, this.window_height);
        }
        /** Render message window */
        ['fill', 'line'].forEach((mode) => {
          if(mode === 'fill') {
            love.graphics.setColor(0, 0, 0, 1);
          } else {
            love.graphics.setColor(1, 1, 1, 1);
          }
          love.graphics.rectangle(
            mode as DrawMode,
            this.messages[i].bouncing_box.x1, this.messages[i].bouncing_box.y1,
            this.message_width, this.messages[i].bouncing_box.y2
          )
        });
        /** Render text */
        love.graphics.setColor(1, 1, 1, 1);
        love.graphics.draw(
          this.messages[i].message,
          this.messages[i].bouncing_box.x1 + 18, this.messages[i].bouncing_box.y2 - 16
        );
      }
    }
    /** FPS */
    love.graphics.setColor(0, 1, 0, 1);
    love.graphics.print("FPS: " + tostring(love.timer.getFPS( )), 10, 10);
  }
}