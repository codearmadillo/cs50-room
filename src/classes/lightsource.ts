export class LightSource {
  constructor(
    public readonly x : number,
    public readonly y : number,
    public readonly power : number,
    public readonly color : [ number, number, number ]
  ) { }
}