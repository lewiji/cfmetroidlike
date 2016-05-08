define([
    'phaser', 'enemy'
], function (Phaser, Enemy) { 
    'use strict';

    function Ripper (game, x, y, texture, key) {
    	Enemy.call(this, game, x, y, texture, key);
        this.xSpeed = -100;
        this.spawn(x, y, {
            texture: texture,
            frameName: key
        });
    }

    Ripper.prototype = Object.create(Enemy.prototype);
    Ripper.prototype.constructor = Ripper;

    Ripper.prototype.spawn = function (x, y, data) {
        Enemy.prototype.spawn.call(this, x, y, data);
        this.body.velocity.x = this.xSpeed;
        this.body.bounce.x = 1;
    };

    Ripper.prototype.update = function () {

    };

    Ripper.prototype.collideTerrain = function () {
        if (this.body.velocity.x < 0) {
            this.scale.x = 1;
        } else {
            this.scale.x = -1;
        }
    };

    return Ripper;
});