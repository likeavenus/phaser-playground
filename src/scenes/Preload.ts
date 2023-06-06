import Phaser from "phaser";

import AlienPng from './assets/alien/alien2.png';
import RedPng from './assets/alien/red.png';
import LizardPng from '../assets/lizard/lizard.png';
import LizardJson from '../assets/lizard/lizard.json';
import WarriorPng from '../assets/human/run.png';
import WarriorJson from '../assets/human/run.json';
import SkyPng from '../assets/sky.png';
import StarPng from '../assets/star.png';
import PlatformPng from '../assets/platform.png';
import dude from '../assets/dude.png';
import sword from '../assets/sword.png';
import spineJson from '../assets/spine/spineboy.json';
import spineAtlas from '../assets/spine/spineboy.atlas';
import shadowJson from '../assets/spine/shadow.json';
import shadowAtlas from '../assets/spine/shadow.atlas';




const SPINEBOY_KEY = 'spineboy'

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload() {
        this.load.spine('shadow', shadowJson, shadowAtlas);
        this.load.atlas('warrior', WarriorPng, WarriorJson);
        this.load.spine(SPINEBOY_KEY, spineJson, spineAtlas);
        // this.load.image('alien', AlienPng);
        // this.load.image('red', RedPng);
        this.load.atlas('lizard', LizardPng, LizardJson);
        this.load.image('sky', SkyPng);
        this.load.image('ground', PlatformPng);
        this.load.image('star', StarPng);
        this.load.spritesheet('dude', dude, { frameWidth: 32, frameHeight: 48 });
        this.load.image('sword', sword);
    }

    create() {
        this.scene.start('Game');
    }
}