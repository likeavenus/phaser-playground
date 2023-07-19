import Phaser from "phaser";

// import LizardPng from 'lizard/lizard.png';
// import LizardJson from 'lizard/lizard.json';
// import SkyPng from 'bg/Sky.png';
// import StarPng from 'star.png';
// import PlatformPng from 'platform.png';
// import PlatformPng from 'world/Tile-1.jpg';
// import MountainsPng from 'bg/Mountains.png';
// import MiddlePng from 'bg/Middle.png';
// import ForeGroundPng from 'bg/foreground.png';
// import ground1 from 'bg/Ground_01.png';
// import ground2 from 'bg/Ground_02.png';

// import Lvl1 from '../../public/assets/tilemap/desert.json';
// import Desert from 'tilemap/desert_tiles.png';
// import Dungeon from '../../public/assets/tilemap/dungeon.json';

// import shadowJson from '../../public/assets/spine/shadow.json';
// import shadowAtlas from '../../public/assets/spine/shadow.atlas';

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload() {
        this.load.image('tiles', 'assets/tilemap/desert_tiles.png');
        this.load.tilemapTiledJSON('desert', 'assets/tilemap/desert.json');
        this.load.tilemapTiledJSON('dungeon', 'assets/tilemap/dungeon.json');

        this.load.image('sky', 'assets/bg/Sky.png');
        this.load.image('mountains', 'assets/bg/Mountains.png');
        this.load.image('middle', 'assets/bg/Middle.png')
        this.load.image('foreground', 'assets/bg/Foreground.png')
        // this.load.image('ground1', ground1)


        this.load.spine('shadow', 'assets/spine/shadow.json', 'assets/spine/shadow.atlas');
        this.load.atlas('lizard', 'assets/lizard/lizard.png', 'assets/lizard/lizard.json');
        this.load.image('ground', 'assets/world/Tile-1.jpg');
        this.load.image('star', 'assets/star.png');
    }

    create() {
        this.scene.start('Game');
    }
}