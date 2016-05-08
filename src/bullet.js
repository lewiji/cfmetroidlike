define([
    'phaser', 'entity'
], function (Phaser, Entity) { 
    'use strict';

    function Bullet (game) {
    	Entity.call(this, game);

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

    	this.body.setCircle(this.height);
    }

    Bullet.prototype = Object.create(Entity.prototype);
    Bullet.prototype.constructor = Bullet;

    Bullet.prototype.spawn = function (x, y, data) {
    	Entity.prototype.spawn.call(this, x, y, data);
    	// also reset the physics body
    	if (data) {
    		if (data.dx) {
    			this.body.velocity.x = data.dx;
    		}
    		if (data.dy) {
    			this.body.velocity.y = data.dy;
    		}
    		
    	}

    	if (this.body.velocity.x > 0) {
    		//this.anchor.x = 1;
    		if (this.body.velocity.y < 0) {
    			this.rotation = -0.78;
    		} else {
    			this.rotation = 0;
    		}    		
    	} else if (this.body.velocity.x < 0) {
    		//this.anchor.x = 0;
    		if (this.body.velocity.y < 0) {
    			this.rotation = -2.356;
    		} else {
    			this.rotation = 3.14;
    		}    		
    	} else if (this.body.velocity.y < 0) {
    		this.rotation = -1.57;
    	}
    };

    Bullet.prototype.update = function () {
    	
    };

    Bullet.prototype.processCollision = function (entity, target) {
		entity.x = -9000;
		entity.y = -9000;
		entity.kill();
		this.body.velocity.x = 0;
    };

    return Bullet;

});