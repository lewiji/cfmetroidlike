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
        	this.load.tilemap('testLevel', 'assets/maps/test.json', null, Phaser.Tilemap.TILED_JSON);
            this.load.image('testTileset', 'assets/maps/sci-fi-platformer-tiles-32x32-extension_0.png');
            this.load.atlasJSONArray('player', 'assets/spritesheets/player-0.png', 'assets/spritesheets/player.json');
        },

        create: function () {
            this.game.state.add('game', GameState);
            this.game.state.start('game');
        }
    };

    return Preloader;
});