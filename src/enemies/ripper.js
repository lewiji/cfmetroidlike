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
        if (!data) {
            data = {};
        }
        data.animations = [
            ['fly', ['bee.png', 'bee_move.png'], 5, true, false]
        ];
        data.defaultAnimation = 'fly';
        Enemy.prototype.spawn.call(this, x, y, data);
        this.body.velocity.x = this.xSpeed;
        this.body.bounce.x = 1;
        this.body.allowGravity = false;
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

    Ripper.prototype.death = function () {
        this.animations.stop('fly');
        this.frameName = 'bee_dead.png';
        var deathTween = this.game.add.tween(this).to({alpha: 0}, 100, 'Linear', true, 0, 2, true);
        deathTween.onComplete.add(Enemy.prototype.death, this);
    };

    return Ripper;
});