define([
    'phaser', 'entity'
], function (Phaser, Entity) { 
    'use strict';

    function Bullet (game) {
    	Entity.call(this, game);
    	this.game = game;

    	this.game.physics.enable(this);
    	this.body.allowGravity = false;

    	this.anchor.setTo(0.5, 0.5);

    	this.kill();
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
    	this.reset(this.x, this.y);
    	Entity.prototype.spawn.call(this, x, y, data);
    	if (data && data.dx) {
    		this.body.velocity.x = data.dx;
    	}
    };

    Bullet.prototype.update = function () {
    	
    };

    Bullet.prototype.processCollision = function (entity, target) {
    	if (target.layer) {
    		entity.x = -9000;
    		entity.y = -9000;
    		entity.kill();
    		this.body.velocity.x = 0;
    	}
    };

    return Bullet;

});