import Phaser from "phaser";

export default class Ghost extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // this.anims.play('run-left');
    }

    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        const leftDown = cursors.left?.isDown;
        const rightDown = cursors.right?.isDown;
        this.anims.play('ghost-hold', true);
        this.setVelocityX(0);
        this.setFriction(0.5, 0);

        if (leftDown) {
            // this.anims.play('ghost-left', true);
            this.setVelocityX(-300)

            // this.scaleX = -1
            // this.body.offset.x = 24
        }

        if (rightDown) {
            // this.anims.play('ghost-right', true);
            this.setVelocityX(300)
        }
    }
}

Phaser.GameObjects.GameObjectFactory.register('ghost', function (x, y, texture, frame) {
    const sprite = new Ghost(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
    sprite.setSize(sprite.width * 0.5, sprite.height * 0.8);

    return sprite;
})

declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            ghost(x: number, y: number, texture: string, frame?: string | number): Ghost
        }
    }
}