define([
    'phaser', 'enemy'
], function (Phaser, Enemy) { 
    'use strict';

    function Crawler (game, x, y, texture, key) {
    	Enemy.call(this, game, x, y, texture, key);
        this.xSpeed = -50;
        this.anchor.setTo(0.5, 1);
        this.spawn(x, y, {
            texture: texture,
            frameName: key
        });
    }

    Crawler.prototype = Object.create(Enemy.prototype);
    Crawler.prototype.constructor = Crawler;

    Crawler.prototype.spawn = function (x, y, data) {
        Enemy.prototype.spawn.call(this, x, y, data);
        this.body.velocity.x = this.xSpeed;
        //this.body.bounce.x = 1;
        this.animations.add('crawl', ['ladybug.png', 'ladybug_move.png'], 5, true, false);
        this.animations.play('crawl');
    };

    Crawler.prototype.update = function () {

    };

    Crawler.prototype.collideTerrain = function (crawler, platform) {
        if (this.body.velocity.x < 0) {
            this.scale.x = 1;
        } else {
            this.scale.x = -1;
        }
        if ((this.body.velocity.x < 0 && this.x < platform.worldX + this.width / 2 && platform.layer.data[platform.y][platform.x - 1].index < 0) ||
                (this.body.velocity.x > 0 && this.x >= platform.worldX + platform.width && platform.layer.data[platform.y][platform.x + 2].index < 0)) {
            this.body.velocity.x *= -1; 
        }
    };

    Crawler.prototype.death = function () {
        this.animations.stop('crawl');
        this.frameName = 'ladybug_fly.png';
        var deathTween = this.game.add.tween(this).to({alpha: 0}, 100, 'Linear', true, 0, 2, true);
        deathTween.onComplete.add(Enemy.prototype.death, this);
    };

    return Crawler;
});