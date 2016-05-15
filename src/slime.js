define([
    'phaser', 'enemy', 'player'
], function (Phaser, Enemy, Player) { 
    'use strict';

    var player;

    function Slime (game, x, y, texture, key) {
    	Enemy.call(this, game, x, y, texture, key);
        this.spawn(x, y, {
            texture: texture,
            frameName: key
        });
        this.anchor.setTo(0, 0);
        if (player === undefined) {
            player = Player.getInstance();
        }
        this.attacking = false;
    }

    Slime.prototype = Object.create(Enemy.prototype);
    Slime.prototype.constructor = Slime;

    Slime.prototype.spawn = function (x, y, data) {
        if (!data) {
            data = {};
        }
        data.animations = [
            ['idle', ['barnacle.png']],
            ['attack' ['banacle_attack.png']],
            ['dead', ['barnacle_dead.png']]
        ];
        data.defaultAnimation = 'idle';
        Enemy.prototype.spawn.call(this, x, y, data);
        this.body.allowGravity = false;
    };

    Slime.prototype.update = function () {
        if (this.attacking === false && player.x >= this.x && player.x <= this.x + this.width) {
            this.attacking = true;
            this.animations.play('attack');
            this.body.acceleration.y = 400;
        }
    };

    Slime.prototype.death = function () {
        this.animations.play('dead');
        var deathTween = this.game.add.tween(this).to({alpha: 0}, 100, 'Linear', true, 0, 2, true);
        deathTween.onComplete.add(Enemy.prototype.death, this);
    };

    return Slime;
});