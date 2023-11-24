export class Hwuh {
  // The size represents the percentage of the smallest edge of the screen.
  // For example, if the smallest edge is the height with a size of 1000 pixels,
  // then a size of 0.6 will result in a sprite 600 pixels high and wide.
  size: number

  x: number
  y: number
  rotation: number

  xVelocity: number
  yVelocity: number

  // Hwuhs will always bounce the same height, regardless of how fast they hit the ground.
  // This is a lazy and bad way to do things, but I want the bounce height to be the same every time
  // and simply inverting the yVelocity doesn't work due to floating point rounding errors.
  bounceStrength: number
  rotationVelocity: number

  constructor(
    size: number,
    x: number,
    y: number,
    rotation: number,
    xVelocity: number,
    yVelocity: number,
    bounceStrength: number,
    rotationVelocity: number
  ) {
    this.size = size
    this.x = x
    this.y = y
    this.rotation = rotation
    this.xVelocity = xVelocity
    this.yVelocity = yVelocity
    this.bounceStrength = bounceStrength
    this.rotationVelocity = rotationVelocity
  }
}