/*jslint browser:true */
/*global connect4: false, alert: false, confirm: false, console: false, Debug: false, opera: false, prompt: false, WSH: false */
connect4.config = (function () {
    "use strict";
    return {
        X_CORD: 7, //positions in X Axis
        Y_CORD: 6, //positions in Y Axis
        DEFAULT_CHAR: "-", //character to "void" cell
        PLAYER_1_ID: "G", //player1 id to know that a cells is their
        PLAYER_2_ID: "R", //player2 id to know that a cells is their
        EXIT: "exit", //word to exit the game
        PIECES_IN_A_ROW_TO_WIN: 4,
        COLOR_DEFAULT: "background: #000; color: #FFF; font-weight:bold; font-size: 5em",
        COLOR_PLAYER_1: "background: #000; color: blue; font-weight:bold; font-size: 5em",
        COLOR_PLAYER_2: "background: #000; color: red; font-weight:bold; font-size: 5em"
    };
}());