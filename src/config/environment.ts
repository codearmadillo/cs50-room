interface IEnvironment {
  bouncingBoxes: boolean;
  colours : { [key : string] : [number, number, number, number] };
}
export const environment : IEnvironment = {
  bouncingBoxes: true,
  colours: {
    white: [1, 1, 1, 1],
    gray_1: [235 / 255, 235 / 255, 235 / 255, 1],
    gray_2: [220 / 255, 220 / 255, 220 / 255, 1],
    gray_3: [205 / 255, 205 / 255, 205 / 255, 1]
  }
}