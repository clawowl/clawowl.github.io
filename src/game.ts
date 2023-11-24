import * as PIXI from 'pixi.js'
import { Hwuh } from './hwuh'


const app = new PIXI.Application<HTMLCanvasElement>({
  background: '#82e4ff',
  resizeTo: window
})
document.body.appendChild(app.view)

const GRAVITY = 0.2
const MIN_EDGE = app.screen.width > app.screen.height ? app.screen.height : app.screen.width

const hwuhs = [] as Hwuh[]
const hwuhSprites = [] as PIXI.Sprite[]

const onSpriteClick = (e: any) => {
  const sprite = e.target as PIXI.Sprite

  // The centerpoints of the 4 new hwuhs will lie on a circle.
  // This circle will have a radius 1/4 the length of the sprite's diagonal length.
  // What we do here is rotate this circle by the sprite's rotation, then
  // calculate where the points will end up after the rotation.
  const spritePointsCircleRadius = (sprite.width * Math.sqrt(2)) / 4
  const spritePointRotations = [
    (0.75 * Math.PI) + sprite.rotation,
    (0.25 * Math.PI) + sprite.rotation,
    (1.75 * Math.PI) + sprite.rotation,
    (1.25 * Math.PI) + sprite.rotation,
  ]

  const xPosList = [
    sprite.position.x + (spritePointsCircleRadius * Math.cos(spritePointRotations[0])),
    sprite.position.x + (spritePointsCircleRadius * Math.cos(spritePointRotations[1])),
    sprite.position.x + (spritePointsCircleRadius * Math.cos(spritePointRotations[2])),
    sprite.position.x + (spritePointsCircleRadius * Math.cos(spritePointRotations[3]))
  ]

  const yPosList = [
    sprite.position.y + (spritePointsCircleRadius * Math.sin(spritePointRotations[0])),
    sprite.position.y + (spritePointsCircleRadius * Math.sin(spritePointRotations[1])),
    sprite.position.y + (spritePointsCircleRadius * Math.sin(spritePointRotations[2])),
    sprite.position.y + (spritePointsCircleRadius * Math.sin(spritePointRotations[3]))
  ]

  sprite.destroy()
  app.stage.removeChild(sprite)

  // This is probably a terrible way to map game objects to sprites.
  // Note to self: In the future, add a "sprite" property to the objects themselves.
  const destroyedHwuhIndex = hwuhSprites.findIndex(sprite => sprite.destroyed)
  const destroyedHwuh = hwuhs[destroyedHwuhIndex]

  for (let i = 0; i < 4; i++) {
    hwuhs.push(new Hwuh(
      destroyedHwuh.size / 2,
      xPosList[i],
      yPosList[i],
      destroyedHwuh.rotation,
      destroyedHwuh.xVelocity + ((Math.random() * 4) - 2),
      destroyedHwuh.yVelocity + ((Math.random() * 4) - 2),
      destroyedHwuh.bounceStrength + (Math.random() * 3),
      destroyedHwuh.rotationVelocity
    ))

    const newHwuhSprite = PIXI.Sprite.from('../assets/headphoneDog.png')

    newHwuhSprite.anchor.set(0.5)
    newHwuhSprite.position.x = xPosList[i]
    newHwuhSprite.position.y = yPosList[i]
    newHwuhSprite.height = MIN_EDGE * (destroyedHwuh.size / 2)
    newHwuhSprite.width = MIN_EDGE * (destroyedHwuh.size / 2)

    newHwuhSprite.eventMode = 'static'
    newHwuhSprite.cursor = 'pointer'
    newHwuhSprite.on('pointerdown', onSpriteClick)

    app.stage.addChild(newHwuhSprite)
    hwuhSprites.push(newHwuhSprite)
  }

  hwuhs.splice(destroyedHwuhIndex, 1)
  hwuhSprites.splice(destroyedHwuhIndex, 1)
}

hwuhs.push(new Hwuh(
  0.8,
  app.screen.width / 2,
  app.screen.height / 2,
  0,
  Math.random() < 0.5 ? 5 : -5,
  5,
  8,
  (Math.random() * 0.05) - 0.025
))
const initialHwuhSprite = PIXI.Sprite.from('../assets/headphoneDog.png')

initialHwuhSprite.anchor.set(0.5)
initialHwuhSprite.position.x = app.screen.width / 2
initialHwuhSprite.position.y = app.screen.height / 2
initialHwuhSprite.height = MIN_EDGE * 0.8
initialHwuhSprite.width = MIN_EDGE * 0.8

initialHwuhSprite.eventMode = 'static'
initialHwuhSprite.cursor = 'pointer'
initialHwuhSprite.on('pointerdown', onSpriteClick)

app.stage.addChild(initialHwuhSprite)
hwuhSprites.push(initialHwuhSprite)

app.ticker.add((delta) => {
  for (let i = 0; i < hwuhs.length; i++) {
    const hwuh = hwuhs[i]
    const hwuhSprite = hwuhSprites[i]

    hwuh.y += hwuh.yVelocity * delta
    hwuh.yVelocity += GRAVITY * delta
    hwuh.x += hwuh.xVelocity * delta
    hwuh.rotation += hwuh.rotationVelocity * delta

    // Keep rotation measurement between 0 and 2 radians for simplicity.
    if (hwuh.rotation > Math.PI * 2) { hwuh.rotation -= Math.PI * 2 }
    else if (hwuh.rotation < 0) { hwuh.rotation += Math.PI * 2 }

    hwuhSprite.position.x = hwuh.x
    hwuhSprite.position.y = hwuh.y
    hwuhSprite.rotation = hwuh.rotation

    const bounds = hwuhSprite.getBounds()

    // There's definitely a better way to do the rotation changes upon bouncing,
    // but I'm not very good at trigonometry or physics.
    if (
      (bounds.x < 0 && hwuh.xVelocity < 0) ||
      (bounds.x + bounds.width > app.screen.width && hwuh.xVelocity > 0)
    ) {
      hwuh.xVelocity *= -1
      hwuh.rotationVelocity += (-0.025 * Math.sin(4 * hwuh.rotation))
    }

    if (bounds.height + bounds.y > app.screen.height && hwuh.yVelocity > 0) {
      hwuh.yVelocity = -hwuh.bounceStrength
      hwuh.rotationVelocity += (-0.025 * Math.sin(4 * hwuh.rotation))
    }
  }
})
