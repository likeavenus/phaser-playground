import Phaser from "phaser";
import Preloader from "./Preload";
import "phaser/plugins/spine/dist/SpinePlugin";
// import './characters/alien/alien';
import Alien from "./characters/alien/alien";
import SwordContainer from "./SwordContainer";
import SpineContainer from "../containers/spineContainer";
import "../containers/spineContainer";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import { TestGame } from "./TestGame";
import { getDialog } from "./constants";
import { createLizardAnims } from "../characters/lizard/lizardAnims";
import Lizard from "../characters/lizard/lizard";

class Game extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  player!: Phaser.Physics.Arcade.Sprite;
  platforms!: Phaser.Physics.Arcade.StaticGroup;
  movingPlatform!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  stars!: Phaser.Physics.Arcade.Group;
  starsSummary = 0;
  sword!: SwordContainer;
  swordHitbox!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  spine!: SpineGameObject;
  boy!: SpineContainer;
  private animationNames: string[] = [];
  level: number = 1;
  loadNextLevel: boolean = false;
  showDialog: boolean = false;
  dialog: any;
  dialogLevel: number = 0;
  emitter = new Phaser.Events.EventEmitter();
  private backgrounds: {
    ratioX: number;
    sprite: Phaser.GameObjects.TileSprite;
  }[] = [];
  private velocityX = 10;

  constructor() {
    super("Game");
  }
  preload() {
    this.cursors = this.input.keyboard!.createCursorKeys();
    // this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
  }

  create() {
    createLizardAnims(this.anims);

    // this.cameras.main.setZoom(0.5, 0.5)
    this.dialog = getDialog(this.scene.scene);
    this.dialog.on(
      "button.click",
      (button, groupName, index, pointer, event) => {
        console.log(button.name);
        if (button.name === "X") {
          this.dialog.hide();
          this.showDialog = false;
        }
      },
      this.scene
    );

    var tween = this.tweens.add({
      targets: this.dialog,
      scaleX: 1,
      scaleY: 1,
      ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 1000,
      repeat: 0, // -1: infinity
      yoyo: false,
    });

    const { width, height } = this.scale;
    this.level === 1
      ? this.add
          .image(0, 0, "sky")
          .setOrigin(0, 0)
          .setScrollFactor(0)
          .setScale(2, 2)
      : null;

    // this.backgrounds.push(
    //   {
    //     ratioX: 0.01,
    //     sprite: this.add
    //       .tileSprite(0, 0, width, height, "mountains")
    //       .setOrigin(0, 0)
    //       .setScrollFactor(0, 0)
    //       .setDepth(0)
    //       .setScale(2, 2),
    //   },
    //   {
    //     ratioX: 0.1,
    //     sprite: this.add
    //       .tileSprite(0, 0, width, height, "middle")
    //       .setOrigin(0, 0)
    //       .setScrollFactor(0, 0)
    //       .setDepth(0)
    //       .setScale(2, 2),
    //   }
    // );
    const isFirstLevel = this.level === 1;
    // const map = this.make.tilemap({ key: isFirstLevel ? "desert" : "dungeon" });
    const map = this.make.tilemap({ key: "map" });

    // const map2 = this.make.tilemap({ key: "brick2" });
    // const tileset2 = map2.addTilesetImage(
    //   "brick2",
    //   "tiles2"
    // ) as Phaser.Tilemaps.Tileset;
    // const dungeonLayer = map2.createLayer("", tileset2);
    // dungeonLayer?.setCollisionByProperty({ collides: true });

    // const tileset = map.addTilesetImage(
    //   "dungeon_plain",
    //   "tiles"
    // ) as Phaser.Tilemaps.Tileset;
    const tileset = map.addTilesetImage(
      "forest-tileset",
      "tiles"
    ) as Phaser.Tilemaps.Tileset;
    const dungeonTileset = map.addTilesetImage(
      "brick2",
      "tiles2"
    ) as Phaser.Tilemaps.Tileset;

    tileset.setTileSize(64, 64);
    // const bgLayer = map.createLayer("background", tileset);
    const groundLayer = map.createLayer("Tile Layer 1", tileset);
    const treesLayer = map.createLayer("trees", tileset);
    const trees2Layer = map.createLayer("trees2", tileset);
    const dungeonLayer = map.createLayer("DungeonLayer", dungeonTileset);

    // const groundLayer = map.createLayer("ground", tileset);

    // console.log(this.cache.tilemap.get("bricks").data);
    // console.log("mossy: ", this.cache.tilemap.get("mossy").data);

    const debugLayer = this.add.graphics();
    groundLayer?.setCollisionByProperty({ collides: true });
    dungeonLayer?.setCollisionByProperty({ collides: true });
    // groundLayer?.renderDebug(debugLayer, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    // });

    this.physics.world.setBounds(0, 0, 5000, 5000);

    this.platforms = this.physics.add.staticGroup();
    this.platforms
      .create(200, 900, "ground")
      .refreshBody()
      .setPipeline("Light2D");
    // this.platforms.create(0, 920, 'ground').setPipeline('Light2D');
    // this.platforms.create(400, 910, 'ground').setPipeline('Light2D');

    // this.platforms.create(700, 890, 'ground').setPipeline('Light2D');
    // this.platforms.create(1100, 960, 'ground').setPipeline('Light2D');
    // this.platforms.create(1230, 960, 'ground').setPipeline('Light2D');

    // this.platforms.create(1400, 920, 'ground').setPipeline('Light2D');
    // this.platforms.create(1630, 960, 'ground').setPipeline('Light2D');

    // this.platforms.create(1900, 1020, 'ground').setPipeline('Light2D');
    // this.platforms.create(2100, 940, 'ground').setPipeline('Light2D');

    this.platforms
      .create(2700, 1000, "ground")
      .setScale(2)
      .refreshBody()
      .setPipeline("Light2D")
      .setData("");

    // this.movingPlatform = this.physics.add.image(400, 400, 'ground').setPipeline('Light2D');
    // this.movingPlatform.setImmovable(true);
    // this.movingPlatform.body.setAllowGravity(false);
    // this.movingPlatform.setVelocityX(50);

    this.stars = this.physics.add.group({
      key: "star",
      repeat: 0,
      setXY: { x: 12, y: Math.random() * 10, stepX: Math.random() * 20 },
      setScale: { x: 0.8, y: 0.8 },
      dragX: 400,
      dragY: 100,
      createCallback: (go) => {
        const angle = Math.random() * 7 * Math.PI * 2;
        go.setVelocityX(Math.sin(angle) * 500);
        go.setVelocityY(Math.cos(angle) * 500);
      },
    });

    for (const star of this.stars.getChildren()) {
      (star as Phaser.Types.Physics.Arcade.ImageWithDynamicBody).setBounceY(
        Phaser.Math.FloatBetween(0.4, 0.9)
      );
    }

    this.boy = this.add.spineContainer(
      this.level === 1 ? 190 : 2317,
      this.level === 1 ? 2100 : 240,
      "shadow",
      "idle",
      true
    );

    this.starsText = this.add
      .text(60, 30, `Stars: ${this.starsSummary}`, {
        fontSize: "24px",
        fontFamily: "Arial",
        color: "#ffffff",
      })
      .setScrollFactor(0);

    this.emitter.on("lizard-dead", ({ x, y }: { x: number; y: number }) => {
      for (let i = 0; i < 15; i++) {
        this.stars.create(x, y, "star");
      }

      this.starsText.setText(`Stars: ${this.starsSummary}`);

      console.log(this.starsText);
    });

    this.lights.enable();
    this.lights.setAmbientColor(0x808080);

    this.light = this.lights
      .addLight(this.boy.x, this.boy.y, 280)
      .setIntensity(3);

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
            this.scene.restart({ level: (this.level += 1) });
            this.loadNextLevel = false;
          },
        });
      }
    });
    // const lizard = this.physics.add.sprite(256, 500, "lizard").setScale(3.5);
    const lizards = this.physics.add.group({
      classType: Lizard,
      runChildUpdate: true,
      createCallback: (go) => {
        (go as Lizard).initEmitter(this.emitter);
        (go as Lizard).body.onCollide = true;
      },
    });

    // lizards.get(100, 2000, "lizard");
    // lizards.get(150, 200, "lizard");
    // lizards.get(150, 2500, "lizard");
    // lizards.get(300, 2500, "lizard");
    lizards.create(300, 2500, "lizard");
    lizards.create(400, 2500, "lizard");

    this.physics.add.collider(this.boy, groundLayer!, (obj1, obj2) => {
      // console.log("obj1: ", obj1);
    });
    this.physics.add.collider(this.boy, dungeonLayer!, (obj1, obj2) => {});

    this.physics.add.collider(this.stars, groundLayer!);
    this.physics.add.collider(this.stars, dungeonLayer!);

    this.physics.add.collider(lizards, groundLayer!);
    this.physics.add.collider(
      lizards,
      this.boy,
      this.attackBoy,
      undefined,
      this
    );
    this.physics.add.collider(lizards, dungeonLayer);

    this.physics.add.overlap(
      this.boy,
      this.stars,
      this.collectStar,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.boy.rightHitBox,
      lizards,
      this.punchLizard,
      undefined,
      this
    );

    const rightArm = this.boy.spine.skeleton.findBone("bone11");
    const boneSprite = this.boy.spine.findSlot("Kisty 2");
    // this.boy.spine.setColor(100, 'Kisty 2');
    this.cameras.main.startFollow(this.boy, false, 0.08, 0.09);
    // this.cameras.main.setFollowOffset(-300, 0);
    this.cameras.main.setFollowOffset(-20, 80);
    /** исправляет дрожание персонажа при передвижении (jitter bug) */
    this.physics.world.fixedStep = false;
  }
  private initializeAnimationsState(spineGO: SpineGameObject) {
    const startAnim = spineGO.getCurrentAnimation().name;

    spineGO.getAnimationList().forEach((name, idx) => {
      this.animationNames.push(name);
      if (name === startAnim) {
        this.animationIndex = idx;
      }
    });
  }
  private changeAnimation(index: number) {
    const name = this.animationNames[index];
    // this.spine.play(name, true);
    // this.animNameLabel.text = name
  }

  private attackBoy(obj1, obj2) {
    this.boy.hp -= 1;
    const sgo = obj1 as SpineContainer;

    if (obj2.x > obj1.x) {
      sgo.body.setVelocityX(-1000);
    } else {
      sgo.body.setVelocityX(1000);
    }

    sgo.body.setVelocityY(-200);
  }

  update() {
    this.starsText.setText(`Stars: ${this.starsSummary}`);

    const size = this.animationNames.length;
    const { left, right, up, space } = this.cursors;
    this.boy.update(this.cameras.main, this.cursors);

    this.light.x = this.boy.x;
    this.light.y = this.boy.y - 15;

    // if (!this.showDialog && this.boy.x + 600 >= 2700) {
    //   this.showDialog = true;
    //   console.log("run");
    //   this.dialog.show();
    //   this.dialog.popUp(1000);
    // } else if (this.showDialog && this.boy.x + 600 < 2700) {
    //   this.showDialog = false;
    // }

    // this.dialog.x = this.boy.x + 200;
    // this.dialog.y = this.boy.y;

    // this.backgrounds.forEach((item) => {
    //   item.sprite.tilePositionX = this.cameras.main.scrollX * item.ratioX;
    // });
  }
  collectStar(player, star?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {
    star!.disableBody(true, true);
    this.scene.remove(star);
    this.starsSummary += 5;
  }
  punchStar(sword, star?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {
    if (this.boy.spine.getData("attack")) {
      if (this.boy.sgo.scaleX > 0) {
        star?.setVelocityX(500);
      } else {
        star?.setVelocityX(-500);
      }
      star?.setVelocityY(-50);
    }
    // star!.disableBody(true, true);
  }

  punchLizard(
    sword,
    lizards?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  ) {
    if (this.boy.spine.getData("attack")) {
      lizards?.takeDamage(10);
      if (this.boy.sgo.scaleX > 0) {
        lizards?.setVelocityX(300);
      } else {
        lizards?.setVelocityX(-300);
      }
      lizards?.setVelocityY(-150);
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
    default: "arcade",
    arcade: {
      gravity: { y: 800 },
      // debug: true,
    },
  },
  scene: [Preloader, Game],
  plugins: {
    scene: [
      { key: "SpinePlugin", plugin: window.SpinePlugin, mapping: "spine" },
      {
        key: "rexUI",
        plugin: UIPlugin,
        mapping: "rexUI",
      },
    ],
  },
};

export const game = new Phaser.Game(config);
