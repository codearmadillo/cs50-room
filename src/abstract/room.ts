import { StaticObject } from "../classes/static-object";
import { Armchair } from "../classes/objects/armchair";
import { Couch } from "../classes/objects/couch";
import { Door } from "../classes/live-objects/door";
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
import { Game } from "../controllers/game-controller";

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
    y1 : 0.20 * this.window_height,
    y2 : 0.90 * this.window_height,
    x1 : 0.2 * this.window_width,
    x2 : 0.8 * this.window_width
  }
  protected abstract readonly daytime : boolean;
  private lightmap : number[][] = [];
  private lightmap_points : {[key: number] : [number, number][]} = { }
  private lightmap_tile : number = 3;
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
  constructor(protected readonly window_width : number, protected readonly window_height : number,readonly title : string, protected readonly game : Game) {
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
    this.add_scene_object(new Door(this.constraints.x1 + 50, this.constraints.y1, 'door-enter'));
    this.add_scene_object(new Door(this.constraints.x2 - 100, this.constraints.y2, 'door-exit'));
    /** Testing light */
    this.add_scene_lightsource(
      'test',
      { x: 80, y : 80, size: 350 }
    );
    this.add_scene_lightsource(
      'test2',
      { x: 400, y: 200, size: 350 }
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
    const col_dark = [ 0, 0, 0, .7 ];
    /** Tile size */
    love.graphics.setPointSize(this.lightmap_tile);
    /** Start rendering */
    Object.keys(this.lightmap_points).forEach((p) => {
      /** Parse value */
      const value = parseFloat(p);
      /** Set color and print points */
      love.graphics.setColor(0, 0, 0, Math.min(0.9, value));
      /** And print points */
      love.graphics.points(this.lightmap_points[value]);
    });
  }
  abstract action(item : InteractiveObject) : void;;
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
    this.bake_lightsources();
  }
  private bake_lightsources() {
    /** get sources */
    const sources = Object.keys(this.light_sources).map((k) => this.light_sources[k]);
    const tiles_x = Math.ceil(this.window_width / this.lightmap_tile);
    const tiles_y = Math.ceil(this.window_height / this.lightmap_tile);
    /** clear lightmap */
    this.lightmap = [];
    /** generate empty lightmap */
    for(let y = 0; y < tiles_y; ++y) {
      this.lightmap[y] = [];
      for(let x = 0; x < tiles_x; ++x) {
        this.lightmap[y][x] = 0;
      }
    }
    /** start placing lights */
    sources.forEach((source) => {
      /** relative x and y */
      const source_x = Math.ceil((source.x) / this.lightmap_tile);
      const source_y = Math.ceil((source.y) / this.lightmap_tile);
      const source_tiles = Math.ceil(source.size / this.lightmap_tile);
      const center_x = source_x + source_tiles / 2;
      const center_y = source_y + source_tiles / 2;
      /** iterate through map */
      for(let y = 0; y < tiles_y; ++y) {
        for(let x = 0; x < tiles_x; ++x) {
          if(
            x >= source_x && x <= source_x + source_tiles &&
            y >= source_y && y <= source_y + source_tiles
          ) {
            /** calculate distance to centerpoint */
            const dist_x = x < center_x ? center_x - x : x == center_x ? 0 : x - center_x;
            const dist_y = y < center_y ? center_y - y : y == center_y ? 0 : y - center_y;
            const dist = Math.sqrt(Math.pow(dist_x, 2) + Math.pow(dist_y, 2));
            /** calculate relative distance */
            const rel_dist = dist / (source_tiles / 2);
            let val = 0;
            /** now - set current value */
            if(rel_dist >= 1) {
              val = 0;
            } else if (rel_dist <= 0.1) {
              val = 0.65;
            } else if (rel_dist <= 0.4) {
              val = 0.45;
              // 1 - parseInt((rel_dist * 10).toString(), 10) / 10;
            } else if (rel_dist <= 0.7) {
              val = 0.30;
            } else {
              val = 0.15;
            }
            /** within range of source */
            this.lightmap[y][x] = val;
          }
        }
      }
    });
    /** Categorize points */
    this.lightmap_points = { };
    this.lightmap.forEach((row, y) => {
      row.forEach((col, x) => {
        const val = 1 - col;
        if(!this.lightmap_points.hasOwnProperty(val)) {
          this.lightmap_points[val] = [];
        }
        this.lightmap_points[val].push(
          [ x * this.lightmap_tile, y * this.lightmap_tile ]
        );
      });
    });
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