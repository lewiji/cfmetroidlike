(function () {
    'use strict';

    requirejs.config({
        baseUrl: "src",
        
        paths: {
            phaser: '../bower_components/phaser/build/phaser.min',
            boot: 'core/boot',
            enemy: 'core/enemy',
            entity: 'core/entity',
            game: 'core/game',
            hud: 'core/hud',
            pool: 'core/pool',
            preloader: 'core/preloader',
            crawler: 'enemies/crawler',
            ripper: 'enemies/ripper',
            slime: 'enemies/slime',
            friend: 'entities/friend',
            player: 'entities/player',
            bullet: 'objects/bullet',
            'dialog-manager': 'core/dialog-manager',
            dialog: 'entities/dialog'
        },

        shim: {
            'phaser': {
                exports: 'Phaser'
            }
        }
    });
 
    require(['phaser', 'boot'], function (Phaser, Boot) {
        var game = new Boot();
        game.start();
    });
}());