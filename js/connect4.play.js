/*jslint browser:true */
/*global $: false, connect4: false, alert: false, confirm: false, console: false, Debug: false, opera: false, prompt: false, WSH: false */
var xpos = 3,
    isPlayer1 = true;

connect4.play = (function () {
    "use strict";
    //PRIVATE AREA
    var getColor = function () {
        return (isPlayer1 === true) ? "blobRed" : "blobBlue";
    },
        moveBlob = function (oldpos) {
            $("#head").children().eq(oldpos).toggleClass(getColor()).toggleClass("headVoid");
            $("#head").children().eq(xpos).toggleClass("headVoid").toggleClass(getColor());
        },
        setPiece = function () {
            var ypos = connect4.logic.setPiece(xpos, isPlayer1);

            $("#row" + ypos).children().eq(xpos).toggleClass("cellVoid").toggleClass(getColor());
            return ypos;
        },
        changePlayer = function () {
            $("#head").children().eq(xpos).toggleClass(getColor()).toggleClass("headVoid");
            isPlayer1 = !isPlayer1;
            xpos = 3;
            $("#head").children().eq(xpos).toggleClass("headVoid").toggleClass(getColor());
        },
        disableEvents = function () {
            $(window).unbind();
            $("#head").unbind();
        },
        showMsgEnd = function (msg) {
            $("#head").toggle();
            $("#msgVictory").toggle().children("h2").text(msg);

        },
        checkResult = function (ypos) {
            var player_desc = (isPlayer1 === true) ? connect4.config.PLAYER_1_DESC : connect4.config.PLAYER_2_DESC;
            if (connect4.logic.isPlayerWin(xpos, ypos, isPlayer1)) {
                showMsgEnd("player " + player_desc + " win!!!!");
                disableEvents();
            } else if (connect4.logic.isDraw()) {
                showMsgEnd("Drawwww!!!!");
                disableEvents();
            } else if (!connect4.board.isColumnPlenty(ypos)) {
                changePlayer();
            }
        },
        enableEvents = function () {
            //keyboard actions
            $(window).keydown(function (event) {
                var ypos,
                    moveBlobLeft = function () {
                        var oldpos = xpos;
                        if (xpos > 0) {
                            xpos = xpos - 1;
                        }

                        moveBlob(oldpos);
                    },
                    moveBlobRight = function () {
                        var oldpos = xpos;
                        if (xpos < (connect4.config.X_CORD - 1)) {
                            xpos = xpos + 1;
                        }

                        moveBlob(oldpos);
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
                var oldpos = xpos;
                //we obtain the new xpos
                xpos = Number($(this).attr("name"));
                moveBlob(oldpos);
            });

            //mouse click action
            $("#head").children().click(function () {
                var ypos;
                //if mouse is in same position as the piece (when we click, we set players piece, but we change player turn, 
                //the new player piece is initialized in half board, so its posible than mouse position and piece position not coincide, 
                //with this if avoid undesired piece setting
                if (Number($(this).attr("name")) === xpos) {
                    ypos = setPiece();
                    checkResult(ypos);
                }
            });
        };

    //PUBLIC AREA
    return {
        enableEvents: function () {
            enableEvents();
        },
        disableEvents: function () {
            disableEvents();
        },
        disableGraphicMode: function () {
            showMsgEnd("Disabled...");
            disableEvents();
        }
    };
}());

//execution    
$(function () {
    "use strict";
    //initialition of the board
    connect4.board.initBoard();

    //we enable Events
    connect4.play.enableEvents();

    console.log("Wellcome to connect 4!!!,\nif you prefer, it's possible to play in console mode writing 'connect4.activeConsole()',\nit will continue with the current game but then it's not posible to go back to graphic mode");
});