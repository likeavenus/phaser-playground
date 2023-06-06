import Phaser from 'phaser';

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

        this.sgo = scene.add.spine(0, 0, key, anim, loop);
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

        const IK_ruka_l = this.sgo.skeleton.findIkConstraint('IK_ruka_l');

        // this.sgo.drawDebug = true;
        this.physicsObject = scene.add.circle(250, -350, 40, undefined, 0);
        this.add(this.physicsObject);
        scene.physics.add.existing(this.physicsObject);
        this.physicsBody.setAllowGravity(false);
        this.physicsBody.setCircle(50);
        let hitboxRect = new Phaser.Geom.Rectangle(x, y, 20, 20);
        // rightArmBone.children.push(hitboxRect);
        // IK_ruka_l.bones.push(this.physicsBody as unknown as spine.Bone);

        scene.physics.add.existing(this)

        const bounds = this.sgo.getBounds()
        const width = bounds.size.x
        const height = bounds.size.y
        this.setPhysicsSize(width, height);
        this.add(this.sgo)
    }
    faceDirection(dir: 1 | -1) {
        if (this.sgo.scaleX === dir) {
            return
        }

        this.sgo.scaleX = dir
    }

    setPhysicsSize(width: number, height: number) {
        const body = this.body as Phaser.Physics.Arcade.Body
        body.setOffset(width * -0.5, -height)
        body.setSize(width, height)
    }
}


Phaser.GameObjects.GameObjectFactory.register('spineContainer', function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, key: string, anim: string, loop = false) {
    const container = new SpineContainer(this.scene, x, y, key, anim, loop)

    this.displayList.add(container)

    return container
})