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
        // this.shadow = this.add.spine(250, 400, 'shadow', 'walk', true).setDepth(300).setScale(0.5, 0.5)

        // this.boy.spine.drawDebug = true;

        // this.spine.drawDebug = true;

        const startAnim = 'idle'
        // this.spine = this.createSpineBoy(startAnim);
        // this.physics.add.existing(this.spine);
        // (this.spine.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
        // this.spine.body.setBounce(0.2);
        // this.physics.add.existing(this.spine);

        this.input.keyboard?.on('keydown-UP', () => {
            // this.boy.spine.play('jump', true, true)

            // console.log('JUMP!!');

        })

        this!.input!.keyboard!.on('keydown-SPACE', (pointer) => {
            this.sword.display.setVisible(true);
            this.tweens.add({
                targets: this.sword,
                ease: Phaser.Math.Easing,
                angle: 110,
                duration: 90,
                onComplete: () => {
                    this.sword.display.setVisible(false);
                    this.sword.setAngle(0);
                }
            })
        }, this);

        this.physics.world.setBounds(0, 0, 1920, 600);
        this.add.image(400, 300, 'sky').setScale(2)
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(200, 268, 'ground').refreshBody();

        this.movingPlatform = this.physics.add.image(400, 400, 'ground');
        this.movingPlatform.setImmovable(true);
        this.movingPlatform.body.setAllowGravity(false);
        this.movingPlatform.setVelocityX(50);

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

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

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.movingPlatform);

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        for (const star of this.stars.getChildren()) {
            (star as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        }
        this.sword = new SwordContainer(this, this.player.x, this.player.y);

        this.boy = this.add.spineContainer(400, 150, 'shadow', 'idle', true).setDepth(200);

        // this.boy.spine.addListener('complete', (anim) => {
        //     // показываем последний кадр
        //     console.log('complete');

        // });
        this.boy.setScale(0.27);
        const body = this.boy.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        this.boy.setPhysicsSize(body.width * 0.65, body.height * 0.9);
        // this.boy.body.setBounce(0.09, 0.09);
        body.setDragX(1500);
        this.physics.add.existing(this.boy);


        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.movingPlatform);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.stars, this.movingPlatform);
        this.physics.add.collider(this.sword.physicsDisplay, this.sword);
        // this.physics.add.collider(this.spine.body, this.platforms);
        // this.physics.add.collider(this.spine.body, this.movingPlatform);
        this.physics.add.collider(this.boy, this.platforms);
        this.physics.add.collider(this.boy, this.movingPlatform);



        this.physics.add.overlap(this.sword.physicsDisplay, this.stars, this.punchStar, undefined, this);
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
        console.log('rightArm: ', rightArm.data);

        const boneSprite = this.boy.spine.findSlot('Kisty 2');
        this.boy.spine.setColor(100, 'Kisty 2');




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
        const IK_ruka_l = this.boy.spine.skeleton.findIkConstraint('IK_ruka_l');
        const leftArm = this.boy.spine.skeleton.findBone('bone11');
        const boneSprite = this.boy.spine.findSlot('Kisty 2');
        // this.boy.spine.skeleton.getRootBone().update()
        // console.log('leftArm: ', leftArm);


        const hitboxCoords = { x: leftArm.worldX, y: leftArm.worldY * -1 + this.game.canvas.height - 10 };
        this.boy.physicsBody.position.copy(hitboxCoords);

        if (left.isDown) {
            this.boy.body.setVelocityX(-300);
            this.boy.faceDirection(-1);
            this.boy.spine.play('walk', true, true)
        } else if (right.isDown) {
            this.boy.body.setVelocityX(300);
            this.boy.faceDirection(1);
            this.boy.spine.play('walk', true, true)
        } else if (this.boy.body.blocked.down) {
            this.boy.spine.play('idle', true, true)
        }
        // controls up
        if ((up.isDown || space.isDown) && this.boy.body.blocked.down) {
            this.boy.spine.play('jump', false, true)
            this.boy.body.setVelocityY(-600);
        }

        if (!this.boy.body.blocked.down) {
            // this.boy.spine.play('fly', false, true)
        }
        // this.sword.copyPosition({ x: this.player.x + 5, y: this.player.y + 10 });
        // this.boy.spine.play('idle', true, true);
        // this.spine.setPosition(this.player.x, this.player.y + 250);
        // if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
        //     if (this.animationIndex >= size - 1) {
        //         this.animationIndex = 0
        //     }
        //     else {
        //         ++this.animationIndex
        //     }

        //     this.changeAnimation(this.animationIndex)
        // }
        // this.spine.play('idle', true, true);

        if (left.isDown && this.boy.body.touching.down) {
            // this.player.setVelocityX(-160);
            // this.player.anims.play('left', true);
            // this.spine.play('run', true, true);
            // this.spine.setScale(-0.3, 0.3);
            // this.spine.x -= 4;
            // this.spine.body.setVelocityX(-300);
            // (this.boy.body as Phaser.Physics.Arcade.Body).setAccelerationX(100)
            // this.boy.setScale(-0.3, 0.3);
        }
        else if (right.isDown && this.boy.body.touching.down) {
            // this.player.setVelocityX(160);
            // this.player.anims.play('right', true);
            // this.spine.setScale(0.3, 0.3);
            // this.spine.play('run', true, true);
            // this.spine.x += 4;
            // this.spine.body.setVelocityX(300);
        }

        else if (up.isDown && this.boy.body.touching.down) {
        }
        else {
            // this.player.setVelocityX(0);
            // this.player.anims.play('turn');
            // this.spine.play('idle', true, true);
            // this.spine.body.setVelocityX(0);
            // this.boy.spine.play('idle', true, true);
            // this.boy.body.setVelocity(0)
        }
        // if (this.cursors.up.isDown && this.spine.body.touching.down) // если нажата клавиша вверх и объект прикоснулся к земле
        // {
        //     this.spine.body.setVelocityY(-330); // Задаем вертикальную скорость объекту
        //     // this.spine.play('jump', true, true);
        // }

        if (this.movingPlatform.x >= 500) {
            this.movingPlatform.setVelocityX(-50);
        }
        else if (this.movingPlatform.x <= 300) {
            this.movingPlatform.setVelocityX(50);
        }

        // if (this.spine.)
        // if (up.isDown) {
        //     this.boy.body.velocity.y = -200;

        // } else {
        //     this.boy.body.velocity.y = 0;
        // }

        // if (!this!.spine!.body!.touching.down) {
        // this.player.setVelocityY(-330);
        // this.spine.body.setVelocityY(-330)
        // this.spine.play('jump', true, true);
        // console.log(this!.spine!.body!.touching.down);

        // }
    }
    collectStar(player, star?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {
        // star!.disableBody(true, true);
    }
    punchStar(sword, star?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {
        star!.disableBody(true, true);
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
            gravity: { y: 520 },
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