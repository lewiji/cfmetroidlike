define([
    'phaser', 'dialog'
], function (Phaser, Dialog) { 
    'use strict';

    var managerInstance, player;

    /**
     * Extend Phaser.Group into a HUD
     * @param {Phaser.Game} game       phaser game instance
     */
    function DialogManager (game) {
        // singleton
        if (managerInstance !== undefined) {
            return managerInstance;
        }

        this.game = game;
        this.activeDialog;

        managerInstance = this;

        return this;
    }

    DialogManager.prototype = Object.create(Object.prototype);
    DialogManager.prototype.constructor = DialogManager;

    DialogManager.getInstance = function (game) {
        if (managerInstance === undefined) {
            managerInstance = new DialogManager(game);
        }
        return managerInstance;
    };

    DialogManager.prototype.getDialog = function (characterName) {
        var dialogArray = this.game.cache.getJSON('dialog_' + characterName);
        console.log(dialogArray);
        return dialogArray;
    };

    DialogManager.prototype.initiateDialog = function (character) {
        var dialogTree = this.getDialog(character.id);
        if (dialogTree === undefined) {
            return;
        } else {
            this.activeDialog = new Dialog(this.game, character, dialogTree);
        }
    };

    return DialogManager;
});