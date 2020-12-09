import { StaticObject } from "../classes/static-object";
import { Armchair } from "../classes/objects/armchair";
import { Couch } from "../classes/objects/couch";
import { Door } from "../classes/objects/door";
import { Fireplace } from "../classes/objects/fireplace";
import { Piano } from "../classes/objects/piano";
import { SmallTable } from "../classes/objects/small-table";
import { IRoom } from "../interfaces/room";
import { BouncingBoxConstraints } from "../types/boucing-box";
import { Player } from "../classes/player";

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

export abstract class GenericRoom implements IRoom {
  public readonly constraints = {
    y1 : 0.18 * this.window_height,
    y2 : 0.9 * this.window_height,
    x1 : 0.2 * this.window_width,
    x2 : 0.8 * this.window_width
  }
  protected readonly wall_size : number = 45;
  protected readonly door_size : number = 90;
  protected readonly points : PointDefinitions = {
    inner : {
      left: [
        0.35 * this.window_width - this.door_size / 2, this.constraints.y1,
        this.constraints.x1, this.constraints.y1,
        this.constraints.x1, this.constraints.y2,
        0.5 * this.window_width - this.door_size / 2, this.constraints.y2,
      ],
      right: [
        0.35 * this.window_width + this.door_size / 2, this.constraints.y1,
        this.constraints.x2, this.constraints.y1,
        this.constraints.x2, this.constraints.y2,
        0.5 * this.window_width + this.door_size / 2, this.constraints.y2
      ]
    },
    outer : {
      left: [
        0.35 * this.window_width - this.door_size / 2, this.constraints.y1 - this.wall_size,
        this.constraints.x1 - this.wall_size, this.constraints.y1 - this.wall_size,
        this.constraints.x1 - this.wall_size, this.constraints.y2 + this.wall_size,
        0.5 * this.window_width - this.door_size / 2, this.constraints.y2 + this.wall_size
      ],
      right: [
        0.35 * this.window_width + this.door_size / 2, this.constraints.y1 - this.wall_size,
        this.constraints.x2 + this.wall_size, this.constraints.y1 - this.wall_size,
        this.constraints.x2 + this.wall_size, this.constraints.y2 + this.wall_size,
        0.5 * this.window_width + this.door_size / 2, this.constraints.y2 + this.wall_size
      ]
    }
  };
  private _static_objects : StaticObject[] = [];
  public get static_objects() {
    return this._static_objects;
  }
  constructor(protected readonly window_width : number, protected readonly window_height : number, private readonly player : Player) {
    /** Add generic static objects */
    /** Top right corner */
    this.add_scene_object(new Armchair(this.constraints.x2 - 115, this.constraints.y1 + 70));
    this.add_scene_object(new SmallTable(this.constraints.x2 - 155, this.constraints.y1 + 60));
    /** Left side */
    this.add_scene_object(new Piano(this.constraints.x1 + 10, this.constraints.y1 + 75));
    /** Bottom */
    this.add_scene_object(new Couch(this.constraints.x1 + 20, this.constraints.y2 - 135));
    this.add_scene_object(new Fireplace(this.constraints.x1 + 105, this.constraints.y2 - 15));
    /** Doors */
    this.add_scene_object(new Door(this.constraints.x1 + 50, this.constraints.y1));
    this.add_scene_object(new Door(this.constraints.x2 - 100, this.constraints.y2));
  }
  update(dt : number) { }
  draw() {
    this.draw_room();
    this.draw_doors();
    this.draw_objects();
  }
  protected add_scene_object(object : StaticObject) {
    /** Push */
    this._static_objects.push(object);
    /** Sort */
    this._static_objects = this._static_objects.sort((a, b) => {
      if(a.y === b.y) {
        return 0;
      } else {
        return a.y > b.y ? 1 : -1
      }
    });
  }
  protected remove_scene_object(index : number) {
    this._static_objects.splice(index, 1);
  }
  private draw_room() {
    love.graphics.setColor(1, 1, 1, 1);
    love.graphics.setLineWidth(1);
    love.graphics.line(
      this.constraints.x1, this.constraints.y1,
      this.constraints.x2, this.constraints.y1,
      this.constraints.x2, this.constraints.y2,
      this.constraints.x1, this.constraints.y2,
      this.constraints.x1, this.constraints.y1,
    );
  }
  private draw_doors() {

  }
  private draw_objects() {
    let isPlayerRendered : boolean = false;
    this.static_objects.forEach((object) => {
      if(object.y < this.player.y) {
        object.draw();
      } else {
        if(!isPlayerRendered) {
          this.player.draw();
          isPlayerRendered = true;
        }
        object.draw();
      }
    });
  }
}