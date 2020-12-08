import { FirstRoom } from "./classes/room";
import { IRoom } from "./interfaces/room";

let room : IRoom;

love.conf = (c) => {
  c.console = true;
};
love.load = () => {
  love.graphics.setDefaultFilter('nearest', 'nearest');
  love.window.setMode(
    768,
    768,
    {
      fullscreen: false,
      vsync: true,
      resizable: false,
      borderless: false,
      centered: true
    }
  );
  love.graphics.setBackgroundColor(0, 0, 0, 1);
  /** Create starting room */
  room = new FirstRoom(768, 768);
}
love.draw = () => {
  room.draw();
  /** FPS */
  love.graphics.setColor(0, 1, 0, 1);
  love.graphics.print("FPS: " + tostring(love.timer.getFPS( )), 10, 10)
}