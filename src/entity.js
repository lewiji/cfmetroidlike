define([
    'phaser'
], function (Phaser) { 
    'use strict';

    function Entity (game, x, y, texture, key) {
        Phaser.Sprite.call(this, game, -9000, -9000, texture, key);
        this.game = game;
        this.game.add.existing(this);
        this.game.physics.enable(this);
        return this;
    }

    Entity.prototype = Object.create(Phaser.Sprite.prototype);
    Entity.prototype.constructor = Entity;

    Entity.prototype.spawn = function (x, y, data) {
        this.x = x;
        this.y = y;        
        this.reset(x, y);
        this.data = data;

        this.processData(data);
        this.body.setSize(this.width, this.height);
    };

    Entity.prototype.processData = function (data) {
        if (data.texture) {
            this.loadTexture(data.texture);
            if (data.frameName) {
                this.frameName = data.frameName;
            }
        }

        if (data.animations) {
            for (var i = 0; i < data.animations.length; i++) {
                this.animations.add(data.animations[i][0], data.animations[i][1], data.animations[i][2], data.animations[i][3], data.animations[i][4]);
            }
            if (data.defaultAnimation) {
                this.animations.play(data.defaultAnimation);
            }
        }

        if (data.health) {
            this.health = data.health;
        }


    };

    Entity.prototype.hit = function (entity, target) {

    };

    Entity.prototype.collideTerrain = function () {

    };

    Entity.prototype.update = function () {

    };

    return Entity;
});