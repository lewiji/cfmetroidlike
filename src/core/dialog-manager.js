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
        this.characterMemory = {};

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
        if (!this.game.cache.checkJSONKey('dialog_' + characterName)) {
            return undefined;
        }
        var dialogArray = this.game.cache.getJSON('dialog_' + characterName);
        return dialogArray;
    };

    DialogManager.prototype.initiateDialog = function (character) {
        var dialogTree = this.getDialog(character.id);
        if (this.characterMemory[character.id] !== undefined) {
            character.dialogVariables = this.characterMemory[character.id];
        }
        this.activeDialog = new Dialog(this.game, character, dialogTree, this);
    };

    DialogManager.prototype.resetDialog = function () {
        if (this.activeDialog !== undefined) {
            this.activeDialog.reset();
            this.activeDialog = undefined;
        }
    };

    return DialogManager;
});