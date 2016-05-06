define([
    'phaser', 'player', 'pool', 'bullet'
], function (Phaser, Player, Pool, Bullet) { 
    'use strict';

    function Game() {
    	console.log('Loading game module');
    }

    var map, backgroundLayer, collisionLayer, player, bulletPool, fireKey;
    
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

        	fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);

        	player = new Player(this.game);
        	bulletPool = new Pool(this.game, Bullet, 30);

        	fireKey.onDown.add(this.fireBullet, this);
        	

        	this.game.physics.arcade.gravity.y = 400;
        },

        update: function () {
        	this.game.physics.arcade.collide(player, collisionLayer);

        	player.update();
        	bulletPool.update();
        },

        fireBullet: function () {
        	bulletPool.create(player.x, player.y - player.height / 2, {dx: 6 * player.scale.x});
        }
    };

    return Game;
});