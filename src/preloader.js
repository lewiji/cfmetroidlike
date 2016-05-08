define([
    'phaser', 'game'
], function (Phaser, GameState) { 
    'use strict';

    function Preloader() {
    	console.log('Loading Preloader module');
    }
    
    Preloader.prototype = {
        constructor: Preloader,

        preload: function() {
            //show progress bar
            var bmd = this.game.add.bitmapData(400, 50);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, 960, 540);
            bmd.ctx.fillStyle = '#ffffff';
            bmd.ctx.fill();
            var progressBar = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, bmd);
            progressBar.anchor.setTo(0.5, 0.5);
            this.game.load.setPreloadSprite(progressBar);
            
        	this.load.tilemap('testLevel', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('testTileset', 'assets/maps/sci-fi-platformer-tiles-32x32-extension_0.png');
            this.load.atlasJSONArray('player', 'assets/spritesheets/player-0.png', 'assets/spritesheets/player.json');
            this.load.atlasJSONArray('lasers', 'assets/spritesheets/lasers.png', 'assets/spritesheets/lasers.json');
            this.load.atlasJSONArray('debug', 'assets/spritesheets/debug.png', 'assets/spritesheets/debug.json');
            this.load.atlasJSONArray('enemies', 'assets/spritesheets/enemies.png', 'assets/spritesheets/enemies.json');
        },

        create: function () {
            this.game.state.add('game', GameState);
            this.game.state.start('game');
        }
    };

    return Preloader;
});