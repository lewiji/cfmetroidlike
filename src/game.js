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

        	bulletPool = new Pool(this.game, Bullet, 30);
        	player = new Player(this.game, bulletPool);

        	this.game.physics.arcade.gravity.y = 400;
        },

        update: function () {
        	this.game.physics.arcade.collide(player, collisionLayer);
        	this.game.physics.arcade.collide(player, exitLayer, this.exitLevel, null, this);
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

        	bulletPool.forEach(function (e) {
        		this.game.debug.body(e);
        	}, this);

        	this.game.debug.body(player);*/
        	
        },

        createMap: function (mapName, linkTo) {
        	if (mapName === undefined) {
        		mapName = 'test1';
        	}
        	if (map !== undefined) {
        		map.destroy();
        		backgroundLayer.destroy();
        		collisionLayer.destroy();
        		exitLayer.destroy();
        		enemiesLayer.destroy();
        	}
        	map = this.add.tilemap(mapName);
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
        	exitLayer.forEach(this.processExits, this, false, linkTo);

        	backgroundLayer.resizeWorld();

        	this.createEntities();   
        },

        createEntities: function () {
        	// created in draw order

        	enemiesLayer = this.game.add.group();
        	
        	this.createEnemies();
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

        processExits: function (exit, linkTo) {
			if (exit.position.x > this.game.width / 2) {
        		exit.body.offset.x = map.tileWidth / 2;
        	} else {
        		exit.body.offset.x = -map.tileWidth / 2;
        	}
        	if (exit.exitId === linkTo) {
        		player.position.setTo(exit.position.x, exit.position.y);
        	}
        },

        exitLevel: function (collider, tile) {
        	if (tile.exitTo !== undefined) {
        		this.createMap(tile.exitTo, tile.linkTo);
        		this.game.world.bringToTop(player);
        	}
        },

        collideBulletsWithTerrain: function (bullet) {
        	this.game.physics.arcade.collide(bullet, collisionLayer, bullet.processCollision, null, bullet);
        },

        collideBulletsWithEnemies: function (bullet, enemy) {
        	bullet.processCollision(bullet, enemy);
        	enemy.hit(bullet);
        }
    };

    return Game;
});