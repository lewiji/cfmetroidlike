define([
    'phaser', 'entity'
], function (Phaser, Entity) { 
    'use strict';

    function Bullet (game) {
    	Entity.call(this, game);
    	this.game = game;

    	this.checkWorldBounds = true;
    	this.outOfBoundsKill = true;

    	this.processData({
    		texture: 'lasers',
    		frameName: 'laserBlue06.png'
    	});
    }

    Bullet.prototype = Object.create(Entity.prototype);
    Bullet.prototype.constructor = Bullet;

    Bullet.prototype.spawn = function (x, y, data) {
    	Entity.prototype.spawn.call(this, x, y, data);
    	this.revive();
    	if (data && data.dx) {
    		this.dx = data.dx;
    	}
    };

    Bullet.prototype.update = function () {
    	this.x += this.dx * 60 * this.game.time.physicsElapsed;
    };

    return Bullet;

});