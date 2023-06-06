import Phaser from "phaser";

export default class Alien extends Phaser.Physics.Matter.Image {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
    }
    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys, drawCone) {
        // const { left, right, up, down, space } = cursors;
        // // this.setAcceleration(0, 0);
        // this.applyForce(new Phaser.Math.Vector2(0, 0));

        // if (left.isDown) {
        //     // this.setAccelerationX(-600);
        //     this.applyForce(new Phaser.Math.Vector2(600, 0));

        // }
        // else if (right.isDown) {
        //     // this.setAccelerationX(600);
        //     this.applyForce(new Phaser.Math.Vector2(600, 0));
        // }

        // if (up.isDown) {
        //     // this.setAccelerationY(-600);
        //     this.applyForce(new Phaser.Math.Vector2(0, -600));
        // }
        // else if (down.isDown) {
        //     // this.setAccelerationY(600);
        //     this.applyForce(new Phaser.Math.Vector2(0, 600));
        // }

        // if (space.isDown) {
        //     drawCone(this.x, this.y);
        // }
    }
}

// Phaser.GameObjects.GameObjectFactory.register('alien', function (x, y, texture, frame) {
//     console.log(this);

//     const image = new Alien(this.matter.world, x, y, texture, frame);
//     this.displayList.add(image);

//     this.scene.physics.world.enableBody(image, Phaser.Physics.Matter.BodyBounds);
//     image.setSize(image.width * 0.35, image.height * 0.34);
//     image.scaleX = 1

//     return image;
// })

// declare global {
//     namespace Phaser.GameObjects {
//         interface GameObjectFactory {
//             alien(x: number, y: number, texture: string, frame?: string | number): Alien
//         }
//     }
// }