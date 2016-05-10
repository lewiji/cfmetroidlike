define([
    'phaser', 'entity'
], function (Phaser, Entity) { 
    'use strict';

    function Enemy (game, x, y, texture, key) {
    	Entity.call(this, game, x, y, texture, key);

        this.kill();

    	this.game.physics.enable(this);
        this.body.immovable = true;

        this.maxHealth = 1;
        this.damage = 8;

    	this.anchor.setTo(0.5, 0.5);
    }

    Enemy.prototype = Object.create(Entity.prototype);
    Enemy.prototype.constructor = Enemy;

    Enemy.prototype.spawn = function (x, y, data) {
        if (data === undefined) {
            data = {
                health: this.maxHealth
            }
        } else {
            data.health = this.maxHealth;
        }
        this.body.setSize(this.width, this.height);
        Entity.prototype.spawn.call(this, x, y, data);

    };

    Enemy.prototype.hit = function (bullet) {
        if (this.dying) {
            return;
        }

        this.health -= 1;

        if (this.health < 1) {
            this.dying = true;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.body.allowGravity = false;
            this.body.enable = false;
            this.death();
        }
    };

    Enemy.prototype.death = function () {
        // spawn pickups here?
        this.kill();
    }

    return Enemy;
});