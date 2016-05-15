define([
    'phaser', 'entity'
], function (Phaser, Entity) { 
    'use strict';

    function Enemy (game, x, y, texture, key) {
    	Entity.call(this, game, x, y, texture, key);

        this.kill();
        
        this.body.immovable = true;

        this.maxHealth = 1;
        this.damage = 4;

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
        } else {
            this.game.add.tween(this).to({alpha: 0.5}, 100, 'Linear', true, 0, 0, true);
        }
    };

    Enemy.prototype.death = function () {
        // spawn pickups here?
        this.kill();
    }

    return Enemy;
});