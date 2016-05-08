define([
    'phaser', 'player', 'pool', 'bullet', 'ripper'
], function (Phaser, Player, Pool, Bullet, Ripper) { 
    'use strict';

    function Game() {
    	console.log('Loading game module');
    }

    var map, backgroundLayer, collisionLayer, exitLayer, player, bulletPool, enemiesLayer;
    
    Game.prototype = {
        constructor: Game,

        preload: function() {
        	
        },

        create: function () {
        	this.game.physics.startSystem(Phaser.Physics.ARCADE);

        	this.createMap();
        	this.createEntities();   	

        	this.game.physics.arcade.gravity.y = 400;
        },

        update: function () {
        	this.game.physics.arcade.collide(player, collisionLayer);
        	this.game.physics.arcade.collide(player, exitLayer, this.exitLevel);
        	this.game.physics.arcade.overlap(player, enemiesLayer, player.hit, null, player);

        	bulletPool.forEachAlive(this.collideBulletsWithTerrain, this);
        	this.game.physics.arcade.overlap(bulletPool, enemiesLayer, this.collideBulletsWithEnemies, null, this);

        	enemiesLayer.forEachAlive(this.updateEnemies, this);

        	player.update();
        	bulletPool.update();
        	

        },

        render: function () {
        	/*enemiesLayer.forEach(function (e) {
        		this.game.debug.body(e);
        	}, this);

        	this.game.debug.body(player);*/
        	
        },

        createMap: function () {
        	map = this.add.tilemap('testLevel');
        	map.addTilesetImage('LofiScifi', 'testTileset');

        	backgroundLayer = map.createLayer('background');
        	collisionLayer = map.createLayer('collision');

        	exitLayer = this.game.add.group();
        	exitLayer.enableBody = true;
        	map.createFromObjects('objects', 'exit', 'debug', 1, true, false, exitLayer);

        	exitLayer.setAll('body.moves', false);

        	collisionLayer.visible = false;
        	map.setCollision(52, true, collisionLayer);
        	map.setCollision(771, true, collisionLayer);

        	this.processMapCollisionProperties();
        	exitLayer.forEach(this.processExits, this);

        	backgroundLayer.resizeWorld();
        },

        createEntities: function () {
        	// created in draw order
        	bulletPool = new Pool(this.game, Bullet, 30);

        	enemiesLayer = this.game.add.group();
        	
        	this.createEnemies();

        	player = new Player(this.game, bulletPool);
        },

        createEnemies: function () {
        	map.createFromObjects('objects', 'ripper', 'enemies', 'bee.png', true, false, enemiesLayer, Ripper, false);
        },

        updateEnemies: function (enemy) {
        	this.game.physics.arcade.collide(enemy, collisionLayer, enemy.collideTerrain, null, enemy);
        	enemy.update();
        },

        processMapCollisionProperties: function () {
        	var d = collisionLayer.map.layers[collisionLayer.index].data;
        	var t;
        	for (var i = 0; i < d.length; i++) {
        		for (var j = 0; j < d[i].length; j++) {
        			t = d[i][j];
        			if (t.properties.passthru == 1) {
        				t.setCollision(false, false, true, false);
        			}
        		}
        	}
        },

        processExits: function (exit, x, y) {
			if (exit.position.x > this.game.width / 2) {
        		exit.body.offset.x = map.tileWidth / 2;
        	} else {
        		exit.body.offset.x = -map.tileWidth / 2;
        	}
        },

        exitLevel: function (collider, tile) {
        	if (tile.exitTo !== undefined) {

        	}
        },

        collideBulletsWithTerrain: function (bullet) {
        	this.game.physics.arcade.collide(bullet, collisionLayer, bullet.processCollision, null, bullet);
        },

        collideBulletsWithEnemies: function (bullet, enemy) {
        	console.log('collision')
        	bullet.processCollision(bullet, enemy);
        	enemy.hit(bullet);
        }
    };

    return Game;
});