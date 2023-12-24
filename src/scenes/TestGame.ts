// @ts-nocheck
import Phaser from "phaser";
import Preloader from "./Preload";
import "phaser/plugins/spine/dist/SpinePlugin";
// import './characters/alien/alien';
import Alien from "./characters/alien/alien";
import { createLizardAnims } from "./assets/lizard/anims";
import SwordContainer from "./SwordContainer";
import SpineContainer from "../spineTest";
import "../containers/spineContainer";

export class TestGame extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  platforms!: Phaser.Physics.Arcade.StaticGroup;
  stars!: Phaser.Physics.Arcade.Group;
  boy!: SpineContainer;
  level: number = 1;
  private backgrounds: {
    ratioX: number;
    sprite: Phaser.GameObjects.TileSprite;
  }[] = [];

  constructor() {
    super("TestGame");
  }
  preload() {
    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .image(0, 0, "sky")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setScale(2, 2);

    this.backgrounds.push(
      {
        ratioX: 0.01,
        sprite: this.add
          .tileSprite(0, 0, width, height, "mountains")
          .setOrigin(0, 0)
          .setScrollFactor(0, 0)
          .setDepth(0)
          .setScale(2, 2),
      },
      {
        ratioX: 0.1,
        sprite: this.add
          .tileSprite(0, 0, width, height, "middle")
          .setOrigin(0, 0)
          .setScrollFactor(0, 0)
          .setDepth(0)
          .setScale(2, 2),
      }
    );

    const isFirstLevel = this.level === 1;

    const map = this.make.tilemap({ key: isFirstLevel ? "desert" : "dungeon" });
    const tileset = map.addTilesetImage(
      "desert_tiles",
      "tiles"
    ) as Phaser.Tilemaps.Tileset;
    const groundLayer = map.createLayer(
      isFirstLevel ? "ground" : "Dungeon",
      tileset
    );
    groundLayer?.setCollisionByProperty({ collides: true });

    this.physics.world.setBounds(0, 0, 3600, 3600);

    this.boy = this.add.spineContainer(
      this.level === 1 ? 190 : 2317,
      this.level === 1 ? 600 : 240,
      "shadow",
      "idle",
      true
    );
    this.boy.setScale(0.27);
    // @ts-ignore

    this.boy.body.setDragX(1500);

    this.physics.add.collider(this.boy, groundLayer!);

    this.physics.world.setBounds(0, 0, 3600, 3600);
    this.cameras.main.startFollow(this.boy, false, 0.08, 0.09);
    this.cameras.main.setFollowOffset(-300, 100);

    /** исправляет дрожание персонажа при передвижении (jitter bug) */
    this.physics.world.fixedStep = false;
  }

  update() {
    const { left, right, up, space } = this.cursors;
    this.boy.update(this.cameras.main, this.cursors);
  }
}
