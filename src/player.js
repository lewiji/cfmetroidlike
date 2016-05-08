define([
    'phaser', 'entity'
], function (Phaser, Entity) { 
    'use strict';

    var cursors, fireKey, jumpKey, invulnerableTween;
    var jumpTimer = 0;

    function Player (game, bulletPool) {
        // Extend Entity
        Entity.call(this, game);

        this.bulletPool = bulletPool;

        this.spawn(100, 100, {texture: 'player'});

        // set anchor to middle, bottom
        this.anchor.setTo(0.5, 1);

        this.addAnimations();
        this.createStateMachine();
        this.setProperties();

        // physics and camera stuff
        this.game.physics.enable(this);
        this.body.collideWorldBounds = true;
        // follow the player with lerp
        this.game.camera.follow(this, undefined, 0.1, 0.1);

        // make physics body width smaller so sprite doesn't hang off platforms
        // this means the sprite kinda phases thru wall bounds - may be a better way to handle this
        this.body.setSize(this.width * 0.5, this.height);
        this.originalBodyHeight = this.body.height;

        cursors = this.game.input.keyboard.createCursorKeys();

        fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
        fireKey.onDown.add(this.fireBullet, this);

        jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    
        return this;
    }

    // Extend Entity
    Player.prototype = Object.create(Entity.prototype);
    Player.prototype.constructor = Player;
    
    Player.prototype.update = function () {
        // default x velocity to 0 = instant stop
        this.body.velocity.x = 0;
        

        this.handleInput();
        this.handleAnimation();
    };

    Player.prototype.setProperties = function () {
        this.jumpForce = 220;
        this.runForce = 200;
    };

    var bulletDy, bulletDx;
    Player.prototype.fireBullet = function () {
        if (cursors.up.isDown) {
            bulletDy = -600;
        } else {
            bulletDy = 0;
        }

        if (this.state.movingRight) {
            bulletDx = 600;
        } else if (this.state.movingLeft) {
            bulletDx = -600;
        } else {
            if (bulletDy != 0) {
                bulletDx = 0;
            } else {
                if (this.state.facingRight) {
                    bulletDx = 600;
                } else {
                    bulletDx = -600;
                }
            }
            
        }
        this.bulletPool.create(this.x, this.y - this.height / 2, {dx: bulletDx, dy: bulletDy});
    }

    Player.prototype.handleInput = function () {
        // set states manually per control - if this gets more complicated may need a more
        // robust state machine implementation
        this.handleJumping();

        this.handleDucking();

        this.handleMoving();

        this.handleGroundState();
    };

    Player.prototype.handleJumping = function () {
        if (jumpKey.isDown) {
            if (this.state.onGround && !this.state.isJumping) {
                this.body.velocity.y = -this.jumpForce;
                this.state.isJumping = true;
                this.state.longJumpExpired = false;
                this.state.onGround = false;
            } else {
                // long press = longer jump
                if (!this.state.longJumpExpired) {
                    jumpTimer += this.game.time.physicsElapsed;
                    if (jumpTimer > 1) {
                        // long jump timer limit, reset timer and set long jump expired
                        jumpTimer = 0;
                        this.state.longJumpExpired = true;
                    } else {
                        this.body.velocity.y = -this.jumpForce;
                    }
                }                
            }
        } else {
            if (this.state.onGround) {
                if (this.state.isJumping) {
                    // we were jumping, now we're on the ground, reset state
                    jumpTimer = 0;
                    this.state.longJumpExpired = false;
                    this.state.isJumping = false;
                }                
            } else {
                // we're in the air and jump isn't pressed - disable long jump
                // (this could be tweaked for eg double jump)
                this.state.longJumpExpired = true;
            }
        }
    };

    Player.prototype.handleDucking = function () {
        if (cursors.down.isDown) {
            if (this.state.onGround) {
                if (this.state.isDucking == false) {
                    this.state.isDucking = true;
                    this.body.height = this.height * 0.55;
                }                
            } else {
                if (this.state.isDucking) {
                    this.state.isDucking = false;
                    this.body.height = this.originalBodyHeight;
                }
            }           
        } else {
            if (this.state.isDucking) {
                this.state.isDucking = false;
                this.body.height = this.originalBodyHeight;
            }
            
        }
    };

    Player.prototype.handleMoving = function () {
        if (cursors.left.isDown && !this.state.isDucking) {
            this.body.velocity.x = -this.runForce;

            this.state.movingLeft = true;
            this.state.movingRight = false;

            this.state.facingLeft = true;
            this.state.facingRight = false;
        } else if (cursors.right.isDown && !this.state.isDucking) {
            this.body.velocity.x = this.runForce;

            this.state.movingRight = true;
            this.state.movingLeft = false;
            
            this.state.facingRight = true;
            this.state.facingLeft = false;
        } else {
            this.state.movingRight = false;
            this.state.movingLeft = false;
        }
    };

    Player.prototype.handleGroundState = function () {
        if (this.body.onFloor()) {
            this.state.onGround = true;
        } else {
            this.state.onGround = false;
            this.state.isJumping = true;
        }
    };

    Player.prototype.handleAnimation = function () {
        if (this.state.onGround) {
            if (this.state.movingLeft) {
                this.animations.play('walk');
                this.scale.setTo(-1, 1);
            } else if (this.state.movingRight) {
                this.animations.play('walk');
                this.scale.setTo(1, 1);
            } else if (this.state.isDucking) {
                this.animations.play('duck');
            } else {
                this.animations.play('idle');
            }
        } else {
            this.animations.play('jump');
            if (this.state.movingLeft) {
                this.scale.setTo(-1, 1);
            } else if (this.state.movingRight) {
                this.scale.setTo(1, 1);
            } 
        }
    };

    Player.prototype.addAnimations = function () {
        this.animations.add('walk', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 30);
        this.animations.add('duck', [11]);
        this.animations.add('idle', [7]);
        this.animations.add('hurt', [13]);
        this.animations.add('jump', [14]);
    };

    Player.prototype.createStateMachine = function () {
        this.state = {
            onGround: false,
            isJumping: false,
            longJumpExpired: false,
            isDucking: false,
            movingLeft: false,
            movingRight: false,
            facingLeft: false,
            facingRight: true,
            invulnerable: false,
            hurt: false
        };
    };

    Player.prototype.hit = function (player, enemy) {
        if (this.state.invulnerable || enemy.dying) {
            return;
        }
        this.health -= enemy.damage;
        
        this.makeInvulnerable();
        
        this.animations.play('hurt');
        this.state.hurt = true;
        invulnerableTween.onComplete.addOnce(this.resetHurt, this);

        if (this.body.velocity.y < 0) {
            this.body.velocity.y = this.jumpForce;
            this.state.longJumpExpired = true;
        } else {
            this.body.velocity.y = -this.jumpForce;
        }

        
    };

    Player.prototype.makeInvulnerable = function (time) {
        if (time === undefined) {
            time = 400;
        }
        this.state.invulnerable = true;
        invulnerableTween = this.game.add.tween(this).to({alpha: 0}, 100, 'Linear', true, 0, Math.round(time / 100), true);
        invulnerableTween.onComplete.addOnce(this.resetInvulnerability, this);
    };

    Player.prototype.resetInvulnerability = function () {
        this.state.invulnerable = false;
    };

    Player.prototype.resetHurt = function () {
        this.state.hurt = false;
    };

    return Player;
});