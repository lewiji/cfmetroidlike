define([
    'phaser', 'player', 'pool', 'bullet', 'ripper', 'crawler', 'friend'
], function (Phaser, Player, Pool, Bullet, Ripper, Crawler, Friend) { 
    'use strict';

    function Game() {
    	console.log('Loading game module');
    }

    var map, backgroundTileSprite, backgroundLayer, collisionLayer, exitLayer, player, bulletPool, enemiesLayer, friendsLayer;
    
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
            this.game.physics.arcade.overlap(player, friendsLayer, player.overlapsFriend, null, player);

        	bulletPool.forEachAlive(this.collideBulletsWithTerrain, this);
        	this.game.physics.arcade.overlap(bulletPool, enemiesLayer, this.collideBulletsWithEnemies, null, this);

        	enemiesLayer.forEachAlive(this.updateEnemies, this);
            friendsLayer.forEachAlive(this.updateFriends, this);

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

        	this.game.debug.body(player);

        	exitLayer.forEach(function (e) {
        	        		this.game.debug.body(e);
        	}, this);*/
        	
        },

        createMap: function (mapName, linkTo) {
        	if (mapName === undefined) {
        		mapName = 'test1';
        	}
        	if (map !== undefined) {
        		map.destroy();
                for (var i = 0; i < this.layers.length; i++) {
                    this.layers[i].destroy();
                }
        		exitLayer.destroy();
        		enemiesLayer.destroy();
                friendsLayer.destroy();
                backgroundTileSprite.destroy();
        	}
            var mapData = this.game.cache.getTilemapData(mapName).data;
        	map = this.add.tilemap(mapName);

            for (var i = 0; i < mapData.tilesets.length; i++) {
                map.addTilesetImage(mapData.tilesets[i].name, mapData.tilesets[i].name);
            }

            this.layers = [];
            for (var i = 0; i < mapData.layers.length; i++) {
                if (mapData.layers[i].type == "tilelayer") {
                    var layer = map.createLayer(mapData.layers[i].name, undefined, undefined, undefined, true);
                    this.layers.push(layer);
                    if (i === 0) {
                        layer.resizeWorld();
                    }
                    if (mapData.layers[i].name == "collision") {
                        collisionLayer = layer;
                    }
                }
                
            }

            if (map.properties.background !== undefined) {
                backgroundTileSprite = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'backgrounds', map.properties.background);
                backgroundTileSprite.sendToBack();
            }

        	exitLayer = this.game.add.group();
        	exitLayer.enableBody = true;
        	map.createFromObjects('objects', 'exit', 'debug', 1, true, false, exitLayer);

        	exitLayer.setAll('body.moves', false);


        	collisionLayer.visible = false;
            map.setCollision(52, true, collisionLayer);
            map.setCollision(99, true, collisionLayer);
        	map.setCollision(771, true, collisionLayer);

        	this.processMapCollisionProperties();
        	exitLayer.forEach(this.processExits, this, false, linkTo);

        	this.createEntities();
            
        },

        createEntities: function () {
        	// created in draw order

        	enemiesLayer = this.game.add.group();
            friendsLayer = this.game.add.group();
        	
        	this.createEnemies();
            this.createFriends();
        },

        createEnemies: function () {
        	map.createFromObjects('objects', 'ripper', 'enemies', undefined, true, false, enemiesLayer, Ripper, false);
        	map.createFromObjects('objects', 'crawler', 'enemies', undefined, true, false, enemiesLayer, Crawler, false);
        },

        createFriends: function () {
            map.createFromObjects('objects', 'villager', 'friends', undefined, true, false, friendsLayer, Friend, false);
        },

        updateEnemies: function (enemy) {
        	this.game.physics.arcade.collide(enemy, collisionLayer, enemy.collideTerrain, null, enemy);
        	enemy.update();
        },

        updateFriends: function (friend) {
            this.game.physics.arcade.collide(friend, collisionLayer, friend.collideTerrain, null, friend);
            friend.update();
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
				exit.x += map.tileWidth / 2;
        		exit.body.offset.x = map.tileWidth / 2;
        		exit.frame = 1;
        	} else {
        		exit.x += map.tileWidth;
        		exit.body.offset.x = -map.tileWidth / 2;
        		exit.frame = 0;
        	}
        	if (exit.exitId === linkTo) {
        		player.position.setTo(exit.position.x, exit.position.y);
        	}
        },

        exitLevel: function (collider, tile) {
        	if (tile.exitTo !== undefined) {
        		this.createMap(tile.exitTo, tile.linkTo);
                this.game.world.bringToTop(bulletPool);
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