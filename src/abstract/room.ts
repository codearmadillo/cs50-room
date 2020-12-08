import { GameObject } from "../classes/game-object";
import { IRoom } from "../interfaces/room";
import { BouncingBoxConstraints } from "../types/boucing-box";

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
  public readonly constraints = {
    y1 : 0.1 * this.window_height,
    y2 : 0.9 * this.window_height,
    x1 : 0.2 * this.window_width,
    x2 : 0.8 * this.window_width
  }
  protected readonly wall_size : number = 45;
  protected readonly door_size : number = 90;
  protected readonly points : PointDefinitions = {
    inner : {
      left: [
        0.5 * this.window_width - this.door_size / 2, this.constraints.y1,
        this.constraints.x1, this.constraints.y1,
        this.constraints.x1, this.constraints.y2,
        0.5 * this.window_width - this.door_size / 2, this.constraints.y2,
      ],
      right: [
        0.5 * this.window_width + this.door_size / 2, this.constraints.y1,
        this.constraints.x2, this.constraints.y1,
        this.constraints.x2, this.constraints.y2,
        0.5 * this.window_width + this.door_size / 2, this.constraints.y2
      ]
    },
    outer : {
      left: [
        0.5 * this.window_width - this.door_size / 2, this.constraints.y1 - this.wall_size,
        this.constraints.x1 - this.wall_size, this.constraints.y1 - this.wall_size,
        this.constraints.x1 - this.wall_size, this.constraints.y2 + this.wall_size,
        0.5 * this.window_width - this.door_size / 2, this.constraints.y2 + this.wall_size
      ],
      right: [
        0.5 * this.window_width + this.door_size / 2, this.constraints.y1 - this.wall_size,
        this.constraints.x2 + this.wall_size, this.constraints.y1 - this.wall_size,
        this.constraints.x2 + this.wall_size, this.constraints.y2 + this.wall_size,
        0.5 * this.window_width + this.door_size / 2, this.constraints.y2 + this.wall_size
      ]
    }
  };
  private readonly _static_objects : GameObject[] = [];
  public get static_objects() {
    return this._static_objects;
  }
  constructor(protected readonly window_width : number, protected readonly window_height : number) { }
  update(dt : number) { }
  draw() {
    this.draw_room();
    this.draw_doors();
    this.draw_objects();
  }
  protected add_scene_object(object : GameObject) {
    this._static_objects.push(object);
  }
  protected remove_scene_object(index : number) {
    this._static_objects.splice(index, 1);
  }
  private draw_room() {
    /** Set base */
    love.graphics.setColor(1, 1, 1, 1);
    love.graphics.setLineWidth(1);
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
  private draw_objects() {
    this.static_objects.forEach((object) => {
      object.draw();
    });
  }
}