import Phaser from "phaser";
import Preloader from "./Preload";
import 'phaser/plugins/spine/dist/SpinePlugin';
// import './characters/alien/alien';
import Alien from "./characters/alien/alien";
import { createLizardAnims } from "./assets/lizard/anims";
import SwordContainer from "./SwordContainer";
import SpineContainer from '../containers/spineContainer';
import '../containers/spineContainer';

class Game extends Phaser.Scene {
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    player!: Phaser.Physics.Arcade.Sprite;
    platforms!: Phaser.Physics.Arcade.StaticGroup;
    movingPlatform!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    stars!: Phaser.Physics.Arcade.Group;
    sword!: SwordContainer;
    swordHitbox!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    spine!: SpineGameObject;
    boy!: SpineContainer;
    private animNameLabel!: Phaser.GameObjects.Text
    private animationNames: string[] = []
    private animationIndex = 0

    constructor() {
        super('Game');
    }
    preload() {
        this.cursors = this.input.keyboard!.createCursorKeys();
    }
    private createSpineBoy(startAnim = 'idle') {
        const spineBoy = this.add.spine(400, 400, 'spineboy', startAnim, true).setDepth(200);
        spineBoy.setScale(0.27, 0.27);

        return spineBoy
    }

    create() {
        this.input.keyboard?.on('keydown-UP', () => {
        })

        // this!.input!.keyboard!.on('keydown-SPACE', (pointer) => {
        //     this.sword.display.setVisible(true);
        //     this.tweens.add({
        //         targets: this.sword,
        //         ease: Phaser.Math.Easing,
        //         angle: 110,
        //         duration: 90,
        //         onComplete: () => {
        //             this.sword.display.setVisible(false);
        //             this.sword.setAngle(0);
        //         }
        //     })
        // }, this);

        this.physics.world.setBounds(0, 0, window.innerWidth + 300, window.innerHeight);
        const sky = this.add.image(400, 300, 'sky').setScale(2);



        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(6).refreshBody().setPipeline('Light2D');
        this.platforms.create(200, 268, 'ground').refreshBody().setPipeline('Light2D');
        this.platforms.create(0, 400, 'ground').setPipeline('Light2D');


        // this.movingPlatform = this.physics.add.image(400, 400, 'ground').setPipeline('Light2D');
        // this.movingPlatform.setImmovable(true);
        // this.movingPlatform.body.setAllowGravity(false);
        // this.movingPlatform.setVelocityX(50);

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.player.setVisible(false)

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // this.physics.add.collider(this.player, this.platforms);
        // this.physics.add.collider(this.player, this.movingPlatform);

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });
        this.stars.setDepth(301);
        for (const star of this.stars.getChildren()) {
            (star as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).setBounceY(Phaser.Math.FloatBetween(0.4, 0.9));
        }
        this.sword = new SwordContainer(this, this.player.x, this.player.y);
        this.sword.setVisible(false)

        this.boy = this.add.spineContainer(400, 150, 'shadow', 'idle', true).setDepth(200);
        // console.log(this.boy);

        this.lights.enable();
        this.lights.setAmbientColor(0x808080);

        this.light = this.lights.addLight(this.boy.x, this.boy.y, 280).setIntensity(3);

        // this.boy.spine.addListener('complete', (anim) => {
        //     // показываем последний кадр
        //     console.log('complete');

        // });
        this.boy.setScale(0.27);
        const body = this.boy.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        this.boy.setPhysicsSize(body.width * 0.65, body.height * 0.9);
        body.setDragX(1500);
        this.physics.add.existing(this.boy);


        // this.physics.add.collider(this.player, this.platforms);
        // this.physics.add.collider(this.player, this.movingPlatform);
        this.physics.add.collider(this.stars, this.platforms);
        // this.physics.add.collider(this.stars, this.movingPlatform);
        this.physics.add.collider(this.sword.physicsDisplay, this.sword);
        // this.physics.add.collider(this.spine.body, this.platforms);
        // this.physics.add.collider(this.spine.body, this.movingPlatform);
        this.physics.add.collider(this.boy, this.platforms);
        // this.physics.add.collider(this.boy, this.stars);

        // this.physics.add.collider(this.boy, this.movingPlatform);
        this.physics.add.collider(this.boy.rightHitBox, this.stars, (obj1, obj2) => {
            console.log(obj1)
        });



        // this.physics.add.overlap(this.sword.physicsDisplay, this.stars, this.punchStar, undefined, this);
        this.physics.add.overlap(this.boy.rightHitBox, this.stars, this.punchStar, undefined, this);


        // this.sword = this.physics.add.sprite(this.player.x + 20, this.player.y, 'sword').setScale(0.01, 0.01).setDepth(2);
        // this.physics.add.existing(this.sword);
        // this.sword.body.setAllowGravity(false);
        // this.sword.setOrigin(0, 1);

        // this.cameras.main.startFollow(this.spine, false, 0.04, 0.04, undefined, 200);
        // this.physics.add.overlap(this.swordHitbox, this.stars, this.punchStar, undefined, this)

        // this.initializeAnimationsState(this.spine);
        // console.log(this.spine);
        // console.log(this.boy.body);
        // this.boy.setMixByName("walk", "jump", 0.2);

        const rightArm = this.boy.spine.skeleton.findBone('bone11');
        const boneSprite = this.boy.spine.findSlot('Kisty 2');
        // this.boy.spine.setColor(100, 'Kisty 2');
        this.cameras.main.startFollow(this.boy, false, 0.008, 0.008);

    }
    private initializeAnimationsState(spineGO: SpineGameObject) {
        const startAnim = spineGO.getCurrentAnimation().name

        spineGO.getAnimationList().forEach((name, idx) => {
            this.animationNames.push(name)
            if (name === startAnim) {
                this.animationIndex = idx
            }
        })
    }
    private changeAnimation(index: number) {
        const name = this.animationNames[index];
        // this.spine.play(name, true);
        // this.animNameLabel.text = name
    }



    update() {
        const size = this.animationNames.length
        const { left, right, up, space } = this.cursors;
        this.boy.update(this.cameras.main, this.cursors);

        this.light.x = this.boy.x;
        this.light.y = this.boy.y - 15;
    }
    collectStar(player, star?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {
        // star!.disableBody(true, true);
    }
    punchStar(sword, star?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {
        if (this.boy.spine.getData('attack')) {
            star?.setVelocityX(1000);
        }
        // star!.disableBody(true, true);
    }
}

const config: Phaser.Types.Core.GameConfig = {
    // type: Phaser.CANVAS,
    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 570 },
            debug: true
        }
    },
    scene: [Preloader, Game],
    plugins: {
        scene: [
            { key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine', }
        ]
    }
};

export const game = new Phaser.Game(config);