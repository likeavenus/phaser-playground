import Phaser from "phaser";
import Preloader from "./Preload";
import 'phaser/plugins/spine/dist/SpinePlugin';
// import './characters/alien/alien';
import Alien from "./characters/alien/alien";
import { createLizardAnims } from "./assets/lizard/anims";
import SwordContainer from "./SwordContainer";
import SpineContainer from '../containers/spineContainer';
import '../containers/spineContainer';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { TestGame } from './TestGame';
import { getDialog } from './constants';

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
    private animationNames: string[] = []
    level: number = 1;
    loadNextLevel: boolean = false;
    showDialog: boolean = false;
    dialog: any;
    dialogLevel: number = 0;
    private backgrounds: {
        ratioX: number;
        sprite: Phaser.GameObjects.TileSprite
    }[] = [];
    private velocityX = 10;

    constructor() {
        super('Game');
    }
    preload() {
        this.cursors = this.input.keyboard!.createCursorKeys();
        // this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');

    }

    create() {
        // this.cameras.main.setZoom(0.5, 0.5)
        this.dialog = getDialog(this.scene.scene);
        this.dialog
            .on('button.click', (button, groupName, index, pointer, event) => {
                if (button.name === 'X') {
                    this.dialog.hide();
                    this.showDialog = false;
                }
            }, this.scene)
        var tween = this.tweens.add({
            targets: this.dialog,
            scaleX: 1,
            scaleY: 1,
            ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0, // -1: infinity
            yoyo: false
        });

        const { width, height } = this.scale;
        this.level === 1 ?
            this.add.image(0, 0, 'sky')
                .setOrigin(0, 0)
                .setScrollFactor(0)
                .setScale(2, 2) : null;

        this.backgrounds.push(
            {
                ratioX: 0.01,
                sprite: this.add.tileSprite(0, 0, width, height, 'mountains')
                    .setOrigin(0, 0)
                    .setScrollFactor(0, 0)
                    .setDepth(0).setScale(2, 2),
            },
            {
                ratioX: 0.1,
                sprite: this.add.tileSprite(0, 0, width, height, 'middle')
                    .setOrigin(0, 0)
                    .setScrollFactor(0, 0)
                    .setDepth(0).setScale(2, 2)
            },
        )
        const isFirstLevel = this.level === 1;
        const map = this.make.tilemap({ key: isFirstLevel ? 'desert' : 'dungeon' });
        const tileset = map.addTilesetImage('desert_tiles', 'tiles') as Phaser.Tilemaps.Tileset;
        const groundLayer = map.createLayer(isFirstLevel ? 'ground' : 'Dungeon', tileset);
        groundLayer?.setCollisionByProperty({ collides: true })

        this.physics.world.setBounds(0, 0, 3600, 3600);

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(200, 900, 'ground').refreshBody().setPipeline('Light2D');
        // this.platforms.create(0, 920, 'ground').setPipeline('Light2D');
        // this.platforms.create(400, 910, 'ground').setPipeline('Light2D');


        // this.platforms.create(700, 890, 'ground').setPipeline('Light2D');
        // this.platforms.create(1100, 960, 'ground').setPipeline('Light2D');
        // this.platforms.create(1230, 960, 'ground').setPipeline('Light2D');

        // this.platforms.create(1400, 920, 'ground').setPipeline('Light2D');
        // this.platforms.create(1630, 960, 'ground').setPipeline('Light2D');

        // this.platforms.create(1900, 1020, 'ground').setPipeline('Light2D');
        // this.platforms.create(2100, 940, 'ground').setPipeline('Light2D');


        this.platforms.create(2700, 1000, 'ground').setScale(2).refreshBody().setPipeline('Light2D').setData('');

        // this.movingPlatform = this.physics.add.image(400, 400, 'ground').setPipeline('Light2D');
        // this.movingPlatform.setImmovable(true);
        // this.movingPlatform.body.setAllowGravity(false);
        // this.movingPlatform.setVelocityX(50);


        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
            setScale: { x: 2, y: 2 }
        });

        for (const star of this.stars.getChildren()) {
            (star as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).setBounceY(Phaser.Math.FloatBetween(0.4, 0.9));
        }

        this.boy = this.add.spineContainer(this.level === 1 ? 190 : 2317, this.level === 1 ? 600 : 240, 'shadow', 'idle', true)


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


        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.boy, this.platforms, (obj1, obj2) => {
            if (this.loadNextLevel) return;

            if (obj2.data) {
                this.cameras.main.stopFollow();
                this.loadNextLevel = true;
                this.cameras.main.fadeOut(600);

                this.time.addEvent({
                    delay: 2000,
                    callback: () => {
                        this.scene.restart({ level: this.level += 1 });
                        this.loadNextLevel = false;
                    }
                })
            }
        });

        this.physics.add.collider(this.boy, groundLayer!);
        this.physics.add.collider(this.stars, groundLayer!);

        this.physics.add.overlap(this.boy.rightHitBox, this.stars, this.punchStar, undefined, this);

        const rightArm = this.boy.spine.skeleton.findBone('bone11');
        const boneSprite = this.boy.spine.findSlot('Kisty 2');
        // this.boy.spine.setColor(100, 'Kisty 2');
        this.cameras.main.startFollow(this.boy, false, 0.08, 0.09);
        this.cameras.main.setFollowOffset(-300, 0);
        /** исправляет дрожание персонажа при передвижении (jitter bug) */
        this.physics.world.fixedStep = false;

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

        if (!this.showDialog && this.boy.x + 600 >= 2700) {
            this.showDialog = true;
            console.log('run')
            this.dialog.show();
            this.dialog.popUp(1000);
        } else if (this.showDialog && this.boy.x + 600 < 2700) {
            this.showDialog = false;
        }

        this.dialog.x = this.boy.x + 200;
        this.dialog.y = this.boy.y;

        this.backgrounds.forEach((item) => {
            item.sprite.tilePositionX = this.cameras.main.scrollX * item.ratioX;
        })
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
    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 700 },
            // debug: true
        }
    },
    scene: [Preloader, Game, TestGame],
    plugins: {
        scene: [
            { key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine', },
            {
                key: 'rexUI',
                plugin: UIPlugin,
                mapping: 'rexUI'
            },
        ]
    }
};

export const game = new Phaser.Game(config);