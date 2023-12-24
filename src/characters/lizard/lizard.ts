import Phaser from "phaser";

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export default class Lizard extends Phaser.Physics.Arcade.Sprite {
  private direction = Direction.RIGHT;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    this.setScale(3);

    this.anims.play("lizard-idle");

    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE,
      this.handleTileCollision,
      this
    );
  }

  private handleTileCollision(
    go: Phaser.GameObjects.GameObject,
    tile: Phaser.Tilemaps.Tile
  ) {
    if (go !== this) {
      return;
    }

    if (go?.body?.blocked?.right || go?.body?.blocked?.left) {
      const newDirection = Phaser.Math.Between(2, 3);
      this.direction = newDirection;
    }
  }

  protected preUpdate(t: number, dt: number): void {
    super.preUpdate(t, dt);
    const speed = 100;

    switch (this.direction) {
      //   case Direction.UP:
      //     this.setVelocity(0, -speed);
      //     break;
      //   case Direction.DOWN:
      //     this.setVelocity(0, speed);
      //     break;
      case Direction.LEFT:
        this.setVelocityX(-speed);
        this.scaleX = -3;
        this.anims.play("lizard-run", true);
        break;
      case Direction.RIGHT:
        this.setVelocityX(speed);
        this.scaleX = 3;
        this.anims.play("lizard-run", true);
        break;
    }
  }
  create() {}
}
