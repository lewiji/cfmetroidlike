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
            
            this.load.tilemap('test1', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('test2', 'assets/maps/test2.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('village', 'assets/maps/village.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.tilemap('inn', 'assets/maps/inn.json', null, Phaser.Tilemap.TILED_JSON);

            this.load.image('LofiScifi', 'assets/spritesheets/sci-fi-platformer-tiles-32x32-extension_0.png');
            this.load.image('sheet', 'assets/spritesheets/buildings.png');
            this.load.image('tiles_general', 'assets/spritesheets/tiles_general.png');

            this.load.atlasJSONArray('player', 'assets/spritesheets/player-0.png', 'assets/spritesheets/player.json');
            this.load.atlasJSONArray('lasers', 'assets/spritesheets/lasers.png', 'assets/spritesheets/lasers.json');
            this.load.atlasJSONArray('debug', 'assets/spritesheets/debug.png', 'assets/spritesheets/debug.json');
            this.load.atlasJSONArray('enemies', 'assets/spritesheets/enemies.png', 'assets/spritesheets/enemies.json');
            this.load.atlasJSONArray('friends', 'assets/spritesheets/friends.png', 'assets/spritesheets/friends.json');
            this.load.atlasJSONArray('backgrounds', 'assets/spritesheets/backgrounds.png', 'assets/spritesheets/backgrounds.json');
            this.load.atlasJSONArray('ui', 'assets/spritesheets/ui.png', 'assets/spritesheets/ui.json');

            this.load.json('dialog_villager1', 'assets/dialog/dialogue.dlz');
        },

        create: function () {
            this.game.state.add('game', GameState);
            this.game.state.start('game');
        }
    };

    return Preloader;
});