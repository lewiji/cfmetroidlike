define([
    'phaser', 'entity'
], function (Phaser, Entity) { 
    'use strict';

    var friendTextures = ['alienBeige.png', 'alienBlue.png', 'alienPink.png'];

    function Friend (game, x, y, texture, key) {
    	Entity.call(this, game, x, y, texture, key);

        this.kill();
        
        this.body.immovable = true;

        this.maxHealth = 1;
        this.damage = 8;
        this.body.collideWorldBounds = true;

    	this.anchor.setTo(0.5, 0.5);

        this.spawn(x, y, {
            texture: 'friends',
            frameName: Phaser.ArrayUtils.getRandomItem(friendTextures)
        });

        this.patrolling = true;
        this.moving = false;
    }

    Friend.prototype = Object.create(Entity.prototype);
    Friend.prototype.constructor = Friend;

    Friend.prototype.spawn = function (x, y, data) {
        if (data === undefined) {
            data = {
                health: this.maxHealth
            };
        } else {
            data.health = this.maxHealth;
        }
        Entity.prototype.spawn.call(this, x, y, data);
    };

    Friend.prototype.hit = function (bullet) {

    };

    var directionChance;
    Friend.prototype.update = function () {
        if (this.patrolling && !this.moving) {
            directionChance = Math.random();
            if (directionChance < 0.3) {
                this.body.velocity.x = -50;
            } else if (directionChance < 0.6) {
                this.body.velocity.x = 50;
            } else {
                this.body.velocity.x = 0;
            }

            this.moving = true;

            this.patrolTimeout = this.game.time.events.add(this.game.rnd.integerInRange(1000, 5000), Friend.prototype.resetPatrol, this);
        }

        if (!this.patrolling) {
            this.body.velocity.x = 0;
        }
    };

    Friend.prototype.resetPatrol = function () {
        if (this.alive === false) {
            return;
        }
        this.patrolling = true;
        this.body.velocity.x = 0;
        this.game.time.events.add(this.game.rnd.integerInRange(1000, 2000), function () {
            this.moving = false;
        }, this);
    };

    Friend.prototype.pauseForPlayer = function () {
        this.patrolling = false;
        if (this.patrolTimeout) {
            this.game.time.events.remove(this.patrolTimeout);
        }
        
        this.game.time.events.add(3000, Friend.prototype.resetPatrol, this);
    };

    Friend.prototype.death = function () {
        // spawn pickups here?
        this.kill();
    };

    return Friend;
});