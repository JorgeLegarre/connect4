/*jslint browser:true */
/*global connect4:false,alert: false, confirm: false, console: false, Debug: false, opera: false, prompt: false, WSH: false */
connect4.logic = (function () {
    "use strict";
    var getPieceID = function (isPlayer1) {
        return isPlayer1 ? connect4.config.PLAYER_1_ID : connect4.config.PLAYER_2_ID;
    };

    return {
        isExit: function (val) {
            return val.toLowerCase() === connect4.config.EXIT;
        },
        isNumber: function (x) {
            return !isNaN(x);
        },
        setPiece: function (pos, isPlayer1) {
            var i = connect4.config.Y_CORD - 1, //we start to search the first free cell begining by the down and going up
                piece = getPieceID(isPlayer1); //we obtain the piece code that we save in the cell
            while (i >= 0) {
                if (connect4.board.getValue(pos, i) === connect4.config.DEFAULT_CHAR) {
                    connect4.board.setValue(pos, i, piece);
                    return i;
                }
                i = i - 1;
            }
            return -1;
        },
        isPlayerWin: function (x, y, isPlayer1) {
            var piece = getPieceID(isPlayer1);
            return connect4.logic.count.count(x, y, piece) >= connect4.config.PIECES_IN_A_ROW_TO_WIN;
        },
        isDraw: function () {
            var draw = true,
                i;
            for (i = 1; i <= connect4.config.X_CORD; i = i + 1) {
                //getValue do the conversion to 0 to (X_CORD -1), so we have to go between 1 and X_CORD
                if (connect4.board.getValue(i, 0) === connect4.config.DEFAULT_CHAR) {
                    draw = false;
                    break;
                }
            }
            return draw;
        }
    };
}());