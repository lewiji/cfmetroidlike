define([
    'phaser', 'player'
], function (Phaser, Player) { 
    'use strict';

    var stockPhrases = [
        [{"type":"Text","id":"8497082b-f512-4dac-806d-d26fd4044f73","name":"Hi!","next":null}],
        [{"type":"Text","id":"8497082b-f512-4dac-806d-d26fd4044f73","name":"Hello!","next":null}],
        [{"type":"Text","id":"8497082b-f512-4dac-806d-d26fd4044f73","name":"Welcome!","next":null}]
    ];

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

        this.character = character;

        if (this.character.dialogVariables === undefined) {
            this.character.dialogVariables = {};
            this.variables = {};
        } else {
            this.variables = this.character.dialogVariables;
        }

        this.initiateDialog();

        return this;
    }

    Dialog.prototype = Object.create(Phaser.Group.prototype);
    Dialog.prototype.constructor = Dialog;

    Dialog.prototype.initiateDialog = function (character, dialogTree) {
        if (!this.dialogTree) {
            this.dialogTree = Phaser.ArrayUtils.getRandomItem(stockPhrases);
        }

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.actionKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
        this.actionKey.onDown.add(this.handleAction, this);

        this.cursors.up.onDown.add(this.handleUp, this);
        this.cursors.down.onDown.add(this.handleDown, this);

        this.createDialogUI();

        this.traverseToRootAndProcess();

        this.game.physics.arcade.isPaused = true;        
    };

    Dialog.prototype.traverseToRootAndProcess = function () {
        var nodeIndex = 0;
        var checking = true;

        // starting from node 0, check references to it from other nodes and keep going backwards
        // until we find the root node
        while (checking === true) {
            checking = false;
            for (var i = 0; i < this.dialogTree.length; i++) {
                if (this.dialogTree[i].choices) {
                    for (var j = 0; j < this.dialogTree[i].choices.length; j++) {
                        if (this.dialogTree[i].choices[j] == this.dialogTree[nodeIndex]) {
                            checking = true;
                            nodeIndex = i;
                        }
                    }
                } else if (this.dialogTree[i].branches) {
                    for (var branch in this.dialogTree[i].branches) {
                        if( this.dialogTree[i].branches.hasOwnProperty( branch ) ) {
                            if (this.dialogTree[i].branches[branch] == this.dialogTree[nodeIndex].id) {
                                checking = true;
                                nodeIndex = i;
                            }
                        }
                    }
                } else if (this.dialogTree[i].next && this.dialogTree[i].next == this.dialogTree[nodeIndex].id) {
                    checking = true;
                    nodeIndex = i;
                }
            }
        }

        this.processChoiceNode(this.dialogTree[nodeIndex].id);
    };

    Dialog.prototype.createDialogUI = function () {
        this.dialogBox = this.game.add.sprite(this.game.camera.x + (this.game.width / 2), this.game.camera.y + (this.game.height / 2), 'ui', 'panel_brown.png');
        this.dialogBox.width *= 2; 
        this.dialogBox.anchor.setTo(0.5, 0.5);
        this.dialogBox.y -= this.height;

        this.dialogText = this.game.add.text(-this.dialogBox.width / 2, -this.dialogBox.height / 2, ' ', 
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
            this.createChoicesUI(this.choices);
        }

        return this.choices;
    };

    Dialog.prototype.createChoicesUI = function (choices) {
        // TODO reuse instead of destroy and recreate
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

    Dialog.prototype.handleAction = function () {
        if (this.choices.length === 0) {
            if (this.nextId != undefined) {
                this.processChoiceNode(this.nextId);
            } else {
                this.reset();
            }
            
        } else {
            this.processChoiceNode();
        }
    };

    Dialog.prototype.reset = function () {
        this.game.physics.arcade.isPaused = false; 
        this.actionKey.reset();
        this.actionKey.onDown.remove(Dialog.prototype.handleAction, this);
        this.cursors.up.onDown.remove(Dialog.prototype.handleUp, this);
        this.cursors.down.onDown.remove(Dialog.prototype.handleDown, this);
        this.destroy();

        if (this.character.id !== undefined) {
            this.dialogManager.characterMemory[this.character.id] = this.character.dialogVariables;
        }

        this.dialogManager.activeDialog = undefined;
    };

    Dialog.prototype.processChoiceNode = function (id) {
        if (id === undefined) {
            id = this.choices[this.choiceIndex].next;
        }
        this.nextId = undefined;
        for (var i = 0; i < this.dialogTree.length; i++) {
            if (this.dialogTree[i].id === id) {
                if (this.dialogTree[i].type == "Set") {
                // Set variables in memory and on character
                    this.variables[this.dialogTree[i].variable] = this.dialogTree[i].value;

                    this.character.dialogVariables[this.dialogTree[i].variable] = this.dialogTree[i].value;

                    this.processChoiceNode(this.dialogTree[i].next);
                    return;
                } else if (this.dialogTree[i].type == "Text") {
                // Update text and present choices if available
                    this.dialogText.setText(this.dialogTree[i].name);
                    if (this.dialogTree[i].choices) {
                        this.createChoices(this.dialogTree[i].choices);
                    } else {
                        this.choices = [];

                        if (this.choicesBox !== undefined) {
                            this.remove(this.choicesBox);
                            this.choicesBox.destroy();
                            this.cursor.destroy();
                        }

                        this.nextId = this.dialogTree[i].next;
                    }
                    return;
                } else if (this.dialogTree[i].type == "Branch") {
                // Process branching
                    if (this.variables[this.dialogTree[i].variable] === undefined) {
                        this.processChoiceNode(this.dialogTree[i].branches['_default']);
                    } else {
                        this.processChoiceNode(this.dialogTree[i].branches[this.variables[this.dialogTree[i].variable]]);
                    }
                    return;
                } else if (this.dialogTree[i].type == "Node") {
                // If it's a node, I dunno, move on if possible
                    this.processChoiceNode(this.dialogTree[i].next);
                    return;
                }
            }
        }
        // no match, end dialog
        this.reset();
    };

    Dialog.prototype.handleUp = function () {
        if (this.choices === undefined || this.choices.length === 0) {
            return;
        }
        this.choiceIndex--;
        if (this.choiceIndex < 0) {
            this.choiceIndex = this.choices.length - 1;
        }
        this.cursor.y = this.originalCursorY + (this.choiceIndex * 12);
    };

    Dialog.prototype.handleDown = function () {
        if (this.choices === undefined || this.choices.length === 0) {
            return;
        }
        this.choiceIndex++;
        if (this.choiceIndex > this.choices.length - 1) {
            this.choiceIndex = 0;
        }
        this.cursor.y = this.originalCursorY + (this.choiceIndex * 12);
    };


    return Dialog;
});