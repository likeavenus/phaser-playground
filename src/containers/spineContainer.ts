import Phaser from 'phaser';
import { game } from '../scenes/Game';

declare global {
    interface ISpineContainer extends Phaser.GameObjects.Container {
        readonly spine: SpineGameObject
        faceDirection(dir: 1 | -1): void;
        setPhysicsSize(width: number, height: number): void;
    }
}

export default class SpineContainer extends Phaser.GameObjects.Container implements ISpineContainer {
    private sgo: SpineGameObject;
    private physicsObject!: Phaser.GameObjects.Arc;

    get physicsBody() {
        return this.physicsObject.body as Phaser.Physics.Arcade.Body;
    }

    get spine() {
        return this.sgo;
    }

    constructor(scene: Phaser.Scene, x: number, y: number, key: string, anim: string, loop = false) {
        super(scene, x, y)

        this.sgo = scene.add.spine(0, 0, key, anim, loop).refresh();
        this.sgo.setMix('idle', 'walk', 0.1);
        this.sgo.setMix('idle', 'jump', 0.1);

        this.sgo.setMix('walk', 'fly', 0.1);
        this.sgo.setMix('walk', 'idle', 0.1);
        this.sgo.setMix('walk', 'jump', 0.1);

        this.sgo.setMix('jump', 'walk', 0.1);
        this.sgo.setMix('jump', 'idle', 0.1);
        this.sgo.setMix('jump', 'fly', 0.1);

        this.sgo.setMix('fly', 'walk', 0.1);
        this.sgo.setMix('fly', 'jump', 0.1);

        // this.sgo.drawDebug = true;
        const leftArm = this.sgo.skeleton.findBone('bone11');
        this.sgo.setInteractive

        this.physicsObject = scene.add.circle(leftArm.worldX, this.scene.game.canvas.height - leftArm.worldY, 40, undefined, 0);
        this.add(this.physicsObject);
        scene.physics.add.existing(this.physicsObject);
        this.physicsBody.setAllowGravity(false);
        this.physicsBody.setCircle(50);

        scene.physics.add.existing(this);

        const bounds = this.sgo.getBounds();
        const width = bounds.size.x;
        const height = bounds.size.y;
        this.setPhysicsSize(width, height);
        this.add(this.sgo);

        // leftArm.children.push(this.physicsBody)
    }
    faceDirection(dir: 1 | -1) {
        if (this.sgo.scaleX === dir) {
            return;
        }

        this.sgo.scaleX = dir;
    }

    setPhysicsSize(width: number, height: number) {
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setOffset(width * -0.5, -height);
        body.setSize(width, height);
    }

    update(camera: Phaser.Cameras.Scene2D.Camera) {
        const leftArm = this.sgo.skeleton.findBone('bone11');
        const hitboxCoords = {
            x: leftArm.worldX + camera.midPoint.x - this.scene.game.canvas.width / 2,
            y: leftArm.worldY * -1 + this.scene.game.canvas.height + camera.midPoint.y - this.scene.game.canvas.height / 2 - 10
        };
        this.physicsBody.position.copy(hitboxCoords);
        this.physicsBody.rotation = leftArm.data.rotation;
        console.log(this.scene.game.canvas.width);

    }
}


Phaser.GameObjects.GameObjectFactory.register('spineContainer', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, key: string, anim: string, loop = false) {
    const container = new SpineContainer(this.scene, x, y, key, anim, loop);
    this.displayList.add(container);

    return container;
})