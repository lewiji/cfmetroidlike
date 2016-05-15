define([
    'phaser', 'player'
], function (Phaser, Player) { 
    'use strict';

    var hudInstance, player;

    /**
     * Extend Phaser.Group into a HUD
     * @param {Phaser.Game} game       phaser game instance
     */
    function HUD (game) {
        // singleton
        if (hudInstance !== undefined) {
            return hudInstance;
        }

        Phaser.Group.call(this, game);
        this.game = game;
        hudInstance = this;

        this.fixedToCamera = true;

        player = Player.getInstance();

        this.healthText = this.game.add.text(0, 0, player.health, 
            {
                fontSize: 20
            }
        );
        this.add(this.healthText);

        return this;
    }

    HUD.prototype = Object.create(Phaser.Group.prototype);
    HUD.prototype.constructor = HUD;

    HUD.prototype.update = function () {
        this.healthText.setText(player.health);
    };

    return HUD;
});