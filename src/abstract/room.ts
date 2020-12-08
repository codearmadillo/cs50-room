import { IRoom } from "../interfaces/room";

interface PointDefinitions {
  inner : {
    left: number[];
    right: number[];
  };
  outer : {
    left: number[];
    right: number[];
  }
}

export abstract class Room implements IRoom {
  protected readonly wall_size : number = 45;
  protected readonly door_size : number = 90;
  protected readonly points : PointDefinitions = {
    inner : {
      left: [
        0.5 * this.window_width - this.door_size / 2, 0.1 * this.window_height,
        0.2 * this.window_width, 0.1 * this.window_height,
        0.2 * this.window_width, 0.5 * this.window_height,
        0.1 * this.window_width, 0.5 * this.window_height,
        0.1 * this.window_width, 0.9 * this.window_height,
        0.5 * this.window_width - this.door_size / 2, 0.9 * this.window_height
      ],
      right: [
        0.5 * this.window_width + this.door_size / 2, 0.1 * this.window_height,
        0.9 * this.window_width, 0.1 * this.window_height,
        0.9 * this.window_width, 0.9 * this.window_height,
        0.5 * this.window_width + this.door_size / 2, 0.9 * this.window_height
      ]
    },
    outer : {
      left: [
        0.5 * this.window_width - this.door_size / 2, 0.1 * this.window_height - this.wall_size,
        0.2 * this.window_width - this.wall_size, 0.1 * this.window_height - this.wall_size,
        0.2 * this.window_width - this.wall_size, 0.5 * this.window_height - this.wall_size,
        0.1 * this.window_width - this.wall_size, 0.5 * this.window_height - this.wall_size,
        0.1 * this.window_width - this.wall_size, 0.9 * this.window_height + this.wall_size,
        0.5 * this.window_width - this.door_size / 2, 0.9 * this.window_height + this.wall_size
      ],
      right: [
        0.5 * this.window_width + this.door_size / 2, 0.1 * this.window_height - this.wall_size,
        0.9 * this.window_width + this.wall_size, 0.1 * this.window_height - this.wall_size,
        0.9 * this.window_width + this.wall_size, 0.9 * this.window_height + this.wall_size,
        0.5 * this.window_width + this.door_size / 2, 0.9 * this.window_height + this.wall_size
      ]
    }
  };
  abstract onEnter() : void;
  abstract onExit() : void;
  constructor(protected readonly window_width : number, protected readonly window_height : number) { }
  update(dt : number) { }
  draw() {
    this.draw_room();
    this.draw_doors();
  }
  private draw_room() {
    /** Set base */
    love.graphics.setColor(1, 1, 1, 1);
    love.graphics.setLineWidth(2);
    /** Walls - Inner */
    love.graphics.line(this.points.inner.left as any);
    love.graphics.line(this.points.inner.right as any);
    /** Walls - Outer */
    love.graphics.line(this.points.outer.left as any);
    love.graphics.line(this.points.outer.right as any);
    /** Corners */
    (['left', 'right'] as ['left', 'right']).forEach((side : 'left' | 'right') => {
      for(let i = 0; i < this.points.inner.left.length - 1; i += 2) {
        if(this.points.inner[side][i + 1] === undefined) {
          return;
        }
        love.graphics.line(
          this.points.inner[side][i],
          this.points.inner[side][i + 1],
          this.points.outer[side][i],
          this.points.outer[side][i + 1],
        );
      }
    });
  }
  private draw_doors() {

  }
}