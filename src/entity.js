define([
    'phaser'
], function (Phaser) { 
    'use strict';

    function Entity (game, x, y, texture, key) {
        Phaser.Sprite.call(this, game, -9000, -9000, texture, key);
        this.game = game;
        this.game.add.existing(this);
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
    };

    Entity.prototype.processData = function (data) {
        if (data.texture) {
            this.loadTexture(data.texture);
            if (data.frameName) {
                this.frameName = data.frameName;
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