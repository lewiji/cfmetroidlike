define([
    'phaser', 'preloader'
], function (Phaser, PreloaderState) { 
    'use strict';

    function Boot() {
        console.log('Booting game');
    }
    
    Boot.prototype = {
        constructor: Boot,

        start: function() {
            this.game = new Phaser.Game(640, 480, Phaser.AUTO, 'gameContainer', { 
                preload: this.preload, 
                create: this.create 
            });
        },

        preload: function() {
            // multitouch?
            this.game.input.maxPointers = 1;
            // pause if window loses focus?
            this.game.stage.disableVisibilityChange = true;
            // how the game should be scaled and positioned
            this.game.stage.scale.pageAlignHorizontally = true;
            this.game.stage.smoothed = false;
            //this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.pageAlignVertically = true;
            // the element to be made fullscreen when fullscreen API is called
            this.game.scale.fullScreenTarget = document.getElementById('gameContainer');
        },
        create: function () {
            this.game.state.add('preloader', PreloaderState);
            this.game.state.start('preloader');
        }
    }

    return Boot;
});