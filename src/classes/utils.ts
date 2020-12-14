import { BouncingBoxConstraints } from "../types/boucing-box";

export class Utils {
  public static BoxBoxCollision(object1 : BouncingBoxConstraints, object2 : BouncingBoxConstraints, offset : number = 15) : boolean {
    if(
      object1.x1 - offset < object2.x2 &&
      object1.x2 + offset > object2.x1 &&
      object1.y1 - offset < object2.y2 &&
      object1.y2 + offset > object2.y1
    ) {
      return true;
    }
    return false;
  }
  public static BoxPointCollision(object : BouncingBoxConstraints, point : [ number, number ]) : boolean {
    const x = 0;
    const y = 1;
    return point[x] >= object.x1 && point[y] >= object.y1 && point[x] <= object.x2 && point[y] <= object.y2;
  }
}