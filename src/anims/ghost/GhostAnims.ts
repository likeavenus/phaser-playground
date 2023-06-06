import Phaser from 'phaser'

export const characterAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: 'ghost-hold',
        frames: anims.generateFrameNames('ghost', {
            start: 1,
            end: 31,
            prefix: 'ghost-hold-',
            suffix: '.png',
        }),
        frameRate: 7,
    });

    anims.create({
        key: 'ghost-left',
        frames: [{ key: 'ghost', frame: 'ghost-left-0.png' }]
    });
    anims.create({
        key: 'ghost-right',
        frames: [{ key: 'ghost', frame: 'ghost-right-0.png' }]
    });
}