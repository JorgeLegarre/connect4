/*jslint browser:true */
/*global connect4:false, alert: false, confirm: false, console: false, Debug: false, opera: false, prompt: false, WSH: false */
connect4.board = (function () {
    "use strict";
    var mainBoard = [];
    return {
        setValue: function (x, y, value) {
            mainBoard[y][x] = value;
        },
        getValue: function (x, y) {
            return mainBoard[y][x];
        },
        initBoard: function () {
            var i,
                j;
            for (i = 0; i < connect4.config.Y_CORD; i = i + 1) { //for every row
                mainBoard[i] = [];
                for (j = 0; j < connect4.config.X_CORD; j = j + 1) { //for every column
                    mainBoard[i][j] = connect4.config.DEFAULT_CHAR;
                }
            }
        },
        isXinBoardLimits: function (x) {
            return (x >= 0) && (x < connect4.config.X_CORD);
        },
        isYinBoardLimits: function (y) {
            return (y >= 0) && (y < connect4.config.Y_CORD);
        },
        inBoardLimits: function (x, y) { //said if x, y are inside the limits of the mainBoard
            return this.isXinBoardLimits(x) && this.isYinBoardLimits(y);
        },
        isColumnPlenty: function (y) {
            return y === -1;
        }
    };
}());