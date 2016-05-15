(function () {
    'use strict';

    requirejs.config({
        baseUrl: "src",
        
        paths: {
            phaser: '../bower_components/phaser/build/phaser.min'
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