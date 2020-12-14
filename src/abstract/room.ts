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
import { environment } from "../config/environment";
import { InteractiveObject } from "../classes/interactive_object";
import { GameObject } from "../classes/game-object";
import { LightSource } from "../classes/lightsource";
import { getDistance } from "love.physics";

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
    y1 : 0.23 * this.window_height,
    y2 : 0.92 * this.window_height,
    x1 : 0.2 * this.window_width,
    x2 : 0.8 * this.window_width
  }
  protected abstract readonly daytime : boolean;
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
  private _game_objects : GameObject[] = [];
  public get game_objects() {
    return this._game_objects;
  }
  private light_sources : { [key: string] : LightSource } = { };
  public player_y : number = 0;
  constructor(protected readonly window_width : number, protected readonly window_height : number) {
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
    /** Testing light */
    this.add_scene_lightsource(
      'test',
      { x: 250, y : 250, size: 250, color: [ 1, 0, 0 ] }
    );
    this.add_scene_lightsource(
      'test2',
      { x: this.window_width - 150, y: this.window_height - 150, size: 250, color: [ 1, 0, 0 ] }
    );
  }
  get room_width() {
    return this.constraints.x2 - this.constraints.x1;
  }
  get room_height() {
    return this.constraints.y2 - this.constraints.y1;
  }
  update(dt : number) { }
  draw() {
    this.draw_floor();
    this.draw_carper();
    this.draw_room_outline();
  }
  draw_lightmask() {
    if(this.daytime) {
      return;
    }
    const dark_color : [ number, number, number, number ] = [ 0, 0, 0, .65 ];
    const point_size = 4;
    const lightsource = this.light_sources['test'];
    /** config */
    love.graphics.setColor(dark_color);
    love.graphics.setPointSize(point_size);
    /** iterate */
    for(let y = 0; y < this.window_width; y += point_size) {
      for(let x = 0; x < this.window_height; x += point_size) {
        if(y < this.constraints.y1 || y > this.constraints.y2 || x < this.constraints.x1 || x > this.constraints.x2) {
          love.graphics.setColor(dark_color);
        } else {
          const dist_x = Math.abs(x - lightsource.x);
          const dist_y = Math.abs(y - lightsource.y);
          const dist = Math.sqrt(Math.pow(dist_x, 2) + Math.pow(dist_y, 2));
          /** render */
          if(dist < lightsource.size / 2) {
            /** change color */
            love.graphics.setColor(...lightsource.color, 0.10);
          } else {
            love.graphics.setColor(dark_color);
          }
        }
        love.graphics.points(x, y);
      }
    }
  }
  protected add_scene_object(object : GameObject) {
    /** Push */
    this._game_objects.push(object);
    /** Sort */
    this._game_objects = this._game_objects.sort((a, b) => {
      if(a.y === b.y) {
        return 0;
      } else {
        return a.y > b.y ? 1 : -1
      }
    });
  }
  protected add_scene_lightsource(name: string, light: LightSource) {
    this.light_sources[name] = light;
  }
  private draw_room_outline() {
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
  private draw_carper() {
    const x_start = this.constraints.x1 + this.room_width * 0.3;
    const y_start = this.constraints.y1 + this.room_height * 0.25;
    const width = this.room_width * 0.65;
    const height = this.room_height * 0.35;
    /** base */
    love.graphics.setColor(environment.colours.carpet);
    love.graphics.rectangle('fill', x_start, y_start, width, height);
    /** outline */
    love.graphics.setLineWidth(2);
    love.graphics.setColor(environment.colours.white);
    love.graphics.rectangle('line', x_start, y_start, width, height);
    /** inner line */
    const inner_x_start = x_start + 12;
    const inner_y_start = y_start + 8;
    love.graphics.setColor(environment.colours.carpet_motive);
    love.graphics.setLineWidth(1);
    love.graphics.rectangle('line', inner_x_start, inner_y_start, width - 24, height - 16);
    /** Start rendering pattern */
    for(let i = 0; i < 5; ++i) {
      love.graphics.ellipse(
        'line', x_start + width / 2, y_start + height / 2,
        width * (0.1 * i), width * (0.05 * i)
      );
    }
    love.graphics.setColor(environment.colours.white);
  }
  private draw_floor() {
    /** Sizes */
    const x_start = this.constraints.x1;
    const y_start = this.constraints.y1;
    const tile_count_x = 4;
    const tile_size_x = this.room_width / tile_count_x;
    const tile_count_y = 35;
    const tile_size_y = this.room_height / tile_count_y;
    /** Iterate */
    love.graphics.setColor(environment.colours.floor);
    for(let y = 0; y < tile_count_y; ++y) {
      for(let x = 0; x < tile_count_x; ++x) {
        const row_offset = y % 2 == 0 ? tile_size_x / 2 : 0;
        const row_limit = y % 2 == 0 ? (x === tile_count_x - 1 ? tile_size_x : 0) : 0;
        love.graphics.polygon(
          'line',
          row_offset + x_start + (tile_size_x * x), y_start + (tile_size_y * y),
          row_offset + x_start + (tile_size_x * x) + tile_size_x - row_limit, y_start + (tile_size_y * y),
          row_offset + x_start + (tile_size_x * x) + tile_size_x - row_limit, y_start + (tile_size_y * y) + tile_size_y,
          row_offset + x_start + (tile_size_x * x), y_start + (tile_size_y * y) + tile_size_y,
        );
      }
    }
  }
}