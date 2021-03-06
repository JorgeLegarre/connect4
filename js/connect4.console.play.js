/*jslint browser:true */
/*global $: false, isPlayer1: false, connect4:false,alert: false, confirm: false, console: false, Debug: false, opera: false, prompt: false, WSH: false */
connect4.console.play = (function () {
    "use strict";
    var isWinOrDraw = false,
        x, // x coordinate
        y, // y coordinate
        isPlayer1, //flag to indicate if it's player1 turn "true" (or player2 turn "false"), we use the graphic mode variable
        playConsole = function () {

            //initialition of the board, its not neccesary because we initialize in graphic mode
            //connect4.board.initBoard();

            //whe continue until the game end
            while (true) {

                //print the mainBoard
                connect4.console.ui.showBoard();

                //ask player where he/she want put the piece
                x = connect4.console.ui.askPlayerPosition(isPlayer1);

                //if user have write the exit word, its the end of the game
                if ((connect4.logic.isExit(x))) {
                    break;
                }

                //(else) If the user entry is a number and is in limits continue, (else) we ask again
                if (connect4.logic.isNumber(x)) {
                    //if it's a number we forze it to be a number, and substract 1 to convert it in array index (begin in 0)
                    x = Number(x) - 1;
                    if (connect4.board.isXinBoardLimits(x)) {

                        //set the piece in the board and obtain the "y" coordenate, now we now the x and y coordenates
                        y = connect4.logic.setPiece(x, isPlayer1);

                        //if the column where the player try to put the piece is full continue,(else) we ask again
                        if (!connect4.board.isColumnPlenty(y)) {
                            //we show the Board because if the game ends(win or draw) we want to have the board refresh before the alert
                            connect4.console.ui.showBoard();

                            //if player have win, show result and exit
                            if (connect4.logic.isPlayerWin(x, y, isPlayer1)) {
                                connect4.console.ui.showWinner(isPlayer1);
                                isWinOrDraw = true;
                                break;
                            }
                            if (connect4.logic.isDraw()) {
                                connect4.console.ui.showDraw();
                                isWinOrDraw = true;
                                break;
                            }

                            //(else) the player have not win, we change the player for the next round
                            isPlayer1 = !isPlayer1;
                        }
                    }
                }
            }
            if (isWinOrDraw) {
                connect4.console.ui.sayBye();
            } else {
                console.clear();
                connect4.console.ui.showActivateConsole();
                connect4.graphic.play.activateGraphic(isPlayer1);
            }

        };

    //PUBLIC AREA
    return {
        activateConsole: function (isPlayer1FromGraphic) {
            isPlayer1 = isPlayer1FromGraphic;
            playConsole();
        }
    };
}());