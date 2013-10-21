/*jslint browser:true */
/*global $: false, connect4: false, alert: false, confirm: false, console: false, Debug: false, opera: false, prompt: false, WSH: false */
connect4.graphic.play = (function () {
    "use strict";
    var xpos,
        isPlayer1 = true,
        //PRIVATE AREA
        setPiece = function () {
            var ypos = connect4.logic.setPiece(xpos, isPlayer1);

            connect4.graphic.ui.setPiece(ypos, xpos, isPlayer1);
            return ypos;
        },
        changePlayer = function () {
            isPlayer1 = !isPlayer1;
            xpos = 3;

            connect4.graphic.ui.changePlayer(xpos, isPlayer1);

        },
        disableEvents = function () {
            $(window).unbind();
            $("#head").children().unbind();
        },
        checkResult = function (ypos) {
            //we obtain the player text description
            var player_desc = (isPlayer1 === true) ? connect4.config.PLAYER_1_DESC : connect4.config.PLAYER_2_DESC;

            //we check if the player have win
            if (connect4.logic.isPlayerWin(xpos, ypos, isPlayer1)) {
                connect4.graphic.ui.showMsgEnd("player " + player_desc + " win!!!!");
                disableEvents();
            } else if (connect4.logic.isDraw()) { //if not, we check if it´s a draw
                connect4.graphic.ui.showMsgEnd("Drawwww!!!!");
                disableEvents();
            } else if (!connect4.board.isColumnPlenty(ypos)) { //if not, we change player to change turn
                changePlayer();
            }
        },
        enableEvents = function () {
            //keyboard actions, they are used to move the piece left, right and down
            $(window).keydown(function (event) {
                var ypos,
                    moveBlobLeft = function () {
                        if (xpos > 0) {
                            xpos = xpos - 1;
                        }

                        connect4.graphic.ui.moveBlob(xpos, isPlayer1);
                    },
                    moveBlobRight = function () {
                        if (xpos < (connect4.config.X_CORD - 1)) {
                            xpos = xpos + 1;
                        }

                        connect4.graphic.ui.moveBlob(xpos, isPlayer1);
                    };
                switch (event.which) {
                case 37: //left
                    moveBlobLeft();
                    break;
                case 39: //right
                    moveBlobRight();
                    break;
                case 13: //enter
                case 40: //down
                    ypos = setPiece();
                    checkResult(ypos);
                    break;
                }
            });

            //mouse movement action
            $("#head").children().mousemove(function () {
                //we obtain the new xpos
                xpos = Number($(this).attr("name"));

                connect4.graphic.ui.moveBlob(xpos, isPlayer1);
            });

            //mouse click action
            $("#head").children().click(function () {
                var ypos;
                //is possible that not coincide because we can left the mouse in a row and move with keyboard
                if (Number($(this).attr("name")) === xpos) {
                    ypos = setPiece();
                    checkResult(ypos);
                }
            });
        },
        initXpos = function () {
            //we calculate center of the board to use it like start point of the pieces
            xpos = Math.floor(connect4.config.X_CORD / 2);
        },
        enableGraphicMode = function (newIsPlayer1) {
            //set the player's turn
            isPlayer1 = newIsPlayer1;

            //we calculate center of the board to use it like start point of the pieces
            initXpos();

            //clean the txt from the head
            connect4.graphic.ui.cleanMsg();
            //clean and print the board according to the internal board
            connect4.graphic.ui.printBoard(xpos, isPlayer1);

            //enableEvents
            enableEvents();
        },
        disableGraphicMode = function () {
            connect4.graphic.ui.showMsgEnd("Disabled...");
            disableEvents();
        };

    //PUBLIC AREA
    return {
        activateGraphic: function (isPlayer1FromConsole) {
            enableGraphicMode(isPlayer1FromConsole);
        },
        activateConsole: function () {
            disableGraphicMode();
            connect4.console.play.activateConsole(isPlayer1);
        },
        play: function () {
            //we calculate center of the board to use it like start point of the pieces
            initXpos();

            //initialition of the internal board
            connect4.board.initBoard();

            //init of the graphic board
            connect4.graphic.ui.initGraphicBoard(xpos);

            //we enable Events
            enableEvents();
        }
    };
}());