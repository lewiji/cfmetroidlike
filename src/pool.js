define([
    'phaser'
], function (Phaser) { 
    'use strict';

    /**
     * Extend Phaser.Group into a Pool for immediate allocation for things like bullets, enemies
     * @param {Phaser.Game} game       phaser game instance
     * @param {Entity} spriteType      the entity this pool is allocated for
     * @param {Number} instances       the number of entities to initially allocate
     */
    function Pool (game, spriteType, instances) {
        Phaser.Group.call(this, game);
        this.game = game;
        this.spriteType = spriteType;
        if (instances > 0) {
            var sprite;
            for (var i = 0; i < instances; i++) {
                sprite = this.add(new spriteType(game));
            }
        }
        return this;
    }

    Pool.prototype = Object.create(Phaser.Group.prototype);
    Pool.prototype.constructor = Pool;

    Pool.prototype.create = function (x, y, data) {
        var obj = this.getFirstExists(false);
        if (!obj) {
            obj = new this.spriteType(this.game);
            this.add(obj, true);
            console.log('created new entity');
        }

        return obj.spawn(x, y, data);
    };

    Pool.prototype.update = function () {
        this.forEachAlive(function (e) {
            e.update.call(e);
        }, this);
    };

    return Pool;
});