// @ts-nocheck
import Phaser from "phaser";

import LizardPng from '../assets/lizard/lizard.png';
import LizardJson from '../assets/lizard/lizard.json';
import SkyPng from '../assets/bg/Sky.png';
import StarPng from '../assets/star.png';
// import PlatformPng from '../assets/platform.png';
import PlatformPng from '../assets/world/Tile-1.jpg';
import MountainsPng from '../assets/bg/Mountains.png';
import MiddlePng from '../assets/bg/Middle.png';
import ForeGroundPng from '../assets/bg/foreground.png';
// import ground1 from '../assets/bg/Ground_01.png';
// import ground2 from '../assets/bg/Ground_02.png';

import Lvl1 from '../assets/tilemap/desert.json';
import Desert from '../assets/tilemap/desert_tiles.png';
import Dungeon from '../assets/tilemap/dungeon.json';

import shadowJson from '../assets/spine/shadow.json';
import shadowAtlas from '../assets/spine/shadow.atlas';

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload() {
        this.load.image('tiles', Desert);
        this.load.tilemapTiledJSON('desert', Lvl1);
        this.load.tilemapTiledJSON('dungeon', Dungeon);

        this.load.image('sky', SkyPng);
        this.load.image('mountains', MountainsPng)
        this.load.image('middle', MiddlePng)
        this.load.image('foreground', ForeGroundPng)
        // this.load.image('ground1', ground1)


        this.load.spine('shadow', shadowJson, shadowAtlas);
        this.load.atlas('lizard', LizardPng, LizardJson);
        this.load.image('ground', PlatformPng);
        this.load.image('star', StarPng);
    }

    create() {
        this.scene.start('Game');
    }
}