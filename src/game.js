define([
    'phaser', 'player'
], function (Phaser, Player) { 
    'use strict';

    function Game() {
    	console.log('Loading game module');
    }

    var map;
    var backgroundLayer;
    var collisionLayer;
    var player;
    var cursors;
    
    Game.prototype = {
        constructor: Game,

        preload: function() {
        	
        },

        create: function () {
        	this.game.physics.startSystem(Phaser.Physics.ARCADE);

        	map = this.add.tilemap('testLevel');
        	map.addTilesetImage('LofiScifi', 'testTileset');

        	backgroundLayer = map.createLayer('background');
        	collisionLayer = map.createLayer('collision');
        	collisionLayer.visible = false;
        	map.setCollision(52, true, collisionLayer);

        	backgroundLayer.resizeWorld();

        	player = new Player(this.game);
        	

        	this.game.physics.arcade.gravity.y = 400;
        },

        update: function () {
        	this.game.physics.arcade.collide(player, collisionLayer);

        	player.update();
        }
    };

    return Game;
});