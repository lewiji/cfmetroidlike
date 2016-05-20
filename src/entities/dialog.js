define([
    'phaser', 'player'
], function (Phaser, Player) { 
    'use strict';

    var stockPhrases = ['Hi friend!', 'Willkommen!', 'Whaddup', 'Greetings!'];

    /**
     * Extend Phaser.Group into a Dialog
     * @param {Phaser.Game} game       phaser game instance
     */
    function Dialog (game, character, dialogTree, manager) {
        // singleton

        Phaser.Group.call(this, game);
        this.game = game;

        //this.fixedToCamera = true;

       // player = Player.getInstance();

        this.dialogTree = dialogTree;

        this.dialogManager = manager;

        this.variables = {};

        this.initiateDialog(character, dialogTree);

        return this;
    }

    Dialog.prototype = Object.create(Phaser.Group.prototype);
    Dialog.prototype.constructor = Dialog;

    Dialog.prototype.initiateDialog = function (character, dialogTree) {
        if (!dialogTree) {
            return;
        }

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.actionKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.actionKey.onDown.add(this.handleAction, this);

        this.cursors.up.onDown.add(this.handleUp, this);
        this.cursors.down.onDown.add(this.handleDown, this);

        this.createDialogUI(character, dialogTree[0].name);

        if (dialogTree[0].choices) {
            this.createChoices(dialogTree[0].choices);
        }

        this.game.physics.arcade.isPaused = true;        
    };

    Dialog.prototype.createDialogUI = function (character, text) {
        this.dialogBox = this.game.add.sprite(this.game.camera.x + (this.game.width / 2), this.game.camera.y + (this.game.height / 2), 'ui', 'panel_brown.png');
        this.dialogBox.width *= 2; 
        this.dialogBox.anchor.setTo(0.5, 0.5);
        this.dialogBox.y -= this.height;

        this.dialogText = this.game.add.text(-this.dialogBox.width / 2, -this.dialogBox.height / 2, text, 
            {
                fontSize: 20,
                boundsAlignH: 'center',
                boundsAlignV: 'middle',
                wordWrap: true,
                wordWrapWidth: this.dialogBox.width
            }
        );
        this.dialogText.setTextBounds(this.dialogBox.width / 2, 0, this.dialogBox.width, this.dialogBox.height);
        this.dialogBox.addChild(this.dialogText);
        this.dialogText.width /= 2;

        this.add(this.dialogBox);
    };

    Dialog.prototype.createChoices = function (choiceIds) {
        this.choices = [];
        this.choiceIndex = 0;

        for (var i = 0; i < choiceIds.length; i++) {
            for (var j = 0; j < this.dialogTree.length; j++) {
                if (this.dialogTree[j].id == choiceIds[i]) {
                    this.choices.push(this.dialogTree[j]);
                }
            }
            if (this.choices.length == choiceIds.length) {
                break;
            }
        }

        if (this.choices.length > 0) {
            console.log(this.choices);
            this.createChoicesUI(this.choices);
        }

        return this.choices;
    };

    Dialog.prototype.createChoicesUI = function (choices) {
        if (this.choicesBox) {
            this.remove(this.choicesBox);
            this.choicesBox.destroy();
            this.cursor.destroy();
        }
        this.choicesBox = this.game.add.sprite(this.dialogBox.x + this.dialogBox.width, this.dialogBox.y + this.dialogBox.height / 2, 'ui', 'panel_brown.png');
        this.choicesBox.width *= 2; 
        this.choicesBox.anchor.setTo(0.5, 0.5);

        for (var i = 0; i < choices.length; i++) {
            var choiceText = this.game.add.text(20 + (-this.choicesBox.width / 2), (12 * i) - (this.choicesBox.height / 2), choices[i].name, 
                {
                    fontSize: 10,
                    boundsAlignV: 'middle',
                    wordWrap: true,
                    wordWrapWidth: this.choicesBox.width
                }
            );
            choiceText.setTextBounds(this.choicesBox.width / 2, 0, this.choicesBox.width, this.choicesBox.height);
            this.choicesBox.addChild(choiceText);
            choiceText.width /= 2;

            if (i === 0) {
                this.cursor = this.game.add.sprite(choiceText.x + this.choicesBox.width / 6, -choiceText.height / 2, 'debug', 1);
                this.originalCursorY = this.cursor.y;
                this.choicesBox.addChild(this.cursor);
            }
        }

        this.add(this.choicesBox);
    };

    Dialog.prototype.updateDialogText = function () {

    };

    Dialog.prototype.handleAction = function () {
        if (this.choices.length === 0) {
            this.game.physics.arcade.isPaused = false; 
            this.actionKey.reset();
            this.actionKey.onDown.remove(Dialog.prototype.handleAction, this);
            this.cursors.up.onDown.remove(Dialog.prototype.handleUp, this);
            this.cursors.down.onDown.remove(Dialog.prototype.handleDown, this);
            this.destroy();
            this.dialogManager.resetDialog();
        } else {
            this.processChoiceNode();
        }
    };

    Dialog.prototype.processChoiceNode = function (id) {
        if (id === undefined) {
            id = this.choices[this.choiceIndex].next;
        }
        for (var i = 0; i < this.dialogTree.length; i++) {
            if (this.dialogTree[i].id === id) {
                if (this.dialogTree[i].type == "Set") {
                    this.variables[this.dialogTree[i].variable] = this.dialogTree[i].value;
                    this.processChoiceNode(this.dialogTree[i].next);
                    break;
                } else if (this.dialogTree[i].type == "Text") {
                    this.dialogText.setText(this.dialogTree[i].name);
                    if (this.dialogTree[i].choices) {
                        this.createChoices(this.dialogTree[i].choices);
                    } else {
                        this.choices = [];
                        this.remove(this.choicesBox);
                        this.choicesBox.destroy();
                        this.cursor.destroy();
                    }
                    break;
                } else if (this.dialogTree[i].type == "Branch") {
                    if (this.variables[this.dialogTree[i].variable] === undefined) {
                        this.processChoiceNode(this.dialogTree[i].branches['_default']);
                    } else {
                        this.processChoiceNode(this.dialogTree[i].branches[this.variables[this.dialogTree[i].variable]]);
                    }
                    break;
                }
            }
        }
    };

    Dialog.prototype.handleUp = function () {
        this.choiceIndex--;
        if (this.choiceIndex < 0) {
            this.choiceIndex = this.choices.length - 1;
        }
        this.cursor.y = this.originalCursorY + (this.choiceIndex * 12);
    };

    Dialog.prototype.handleDown = function () {
        this.choiceIndex++;
        if (this.choiceIndex > this.choices.length - 1) {
            this.choiceIndex = 0;
        }
        this.cursor.y = this.originalCursorY + (this.choiceIndex * 12);
    };


    return Dialog;
});