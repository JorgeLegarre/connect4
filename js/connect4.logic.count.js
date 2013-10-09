/*jslint browser:true */
/*global connect4: false, alert: false, confirm: false, console: false, Debug: false, opera: false, prompt: false, WSH: false */
connect4.logic.count = (function () {
    "use strict";
    //said if a piece in a board is from the player that plays
    var isPlayerPiece = function (x, y, piece) {
        return connect4.board.getValue(x, y) === piece;
    },
        //countToDirection: object used as a compilation of functions that count pieces on a row
        countToDirection = {
            //countDirection: recursive function that count how many pieces in a row are in a determined axis movement
            //x --> coordenate x (numeric)
            //y --> coordenate y (numeric)
            //piece --> pieceId of a player
            //moveX --> function to move coordenate x
            //moveY --> function to move coordenate y
            countDirection: function (x, y, player, moveX, moveY) {
                //first we continue the movement, change the value of x-y acording functions moveX, moveY
                x = moveX(x);
                y = moveY(y);
                if (!connect4.board.inBoardLimits(x, y) || !isPlayerPiece(x, y, player)) {
                    return 0;
                }
                return countToDirection.countDirection(x, y, player, moveX, moveY) + 1;
            },
            //axixMovements: object that have the compilation of movements of an individual axis
            axisMovements: {
                xLeft: function (x) { //function that calculate x_coordenate to move left
                    return x - 1;
                },
                xRight: function (x) { //function that calculate x_coordenate to move right
                    return x + 1;
                },
                notMove: function (z) { //function that calculate coordenate(x or y) to not move
                    return z;
                },
                yDown: function (y) { //function that calculate y_coordenate to move down
                    return y + 1;
                },
                yUp: function (y) { //function that calculate y_coordenate to move up
                    return y - 1;
                }
            },
            //left: function that initiate the call to the recursive function to count how many pieces in a row, it configure the recursive function to count moving to the left
        left: function (x, y, player) {
                return countToDirection.countDirection(x, y, player, countToDirection.axisMovements.xLeft, countToDirection.axisMovements.notMove);
            },
            //right: function that initiate the call to the recursive function to count how many pieces in a row, it configure the recursive function to count moving to the right
            right: function (x, y, player) {
                return countToDirection.countDirection(x, y, player, countToDirection.axisMovements.xRight, countToDirection.axisMovements.notMove);
            },
            //down: function that initiate the call to the recursive function to count how many pieces in a row, it configure the recursive function to count moving to the down
            down: function (x, y, player) {
                return countToDirection.countDirection(x, y, player, countToDirection.axisMovements.notMove, countToDirection.axisMovements.yDown);
            },
            //leftUp: function that initiate the call to the recursive function to count how many pieces in a row, it configure the recursive function to count moving to the diagonal left-up
            leftUp: function (x, y, player) {
                return countToDirection.countDirection(x, y, player, countToDirection.axisMovements.xLeft, countToDirection.axisMovements.yUp);
            },
            //rightDown: function that initiate the call to the recursive function to count how many pieces in a row, it configure the recursive function to count moving to the diagonal right-Down
            rightDown: function (x, y, player) {
                return countToDirection.countDirection(x, y, player, countToDirection.axisMovements.xRight, countToDirection.axisMovements.yDown);
            },
            //rightUp: function that initiate the call to the recursive function to count how many pieces in a row, it configure the recursive function to count moving to the diagonal right-Up
            rightUp: function (x, y, player) {
                return countToDirection.countDirection(x, y, player, countToDirection.axisMovements.xRight, countToDirection.axisMovements.yUp);
            },
            //leftDown: function that initiate the call to the recursive function to count how many pieces in a row, it configure the recursive function to count moving to the diagonal Left-Down
            leftDown: function (x, y, player) {
                return countToDirection.countDirection(x, y, player, countToDirection.axisMovements.xLeft, countToDirection.axisMovements.yDown);
            }
        };
    return {
        //count how many pieces in a row have the "player" with a piece put in x-y coordenates i
        //it checks in horizontal, vertical and the two diagonals
        count: function (x, y, piece) {
            var horizontal, // number of pieces of same player in horizontal
                vertical, //  number of pieces of same player in vertical
                diagonal1, // number of pieces of same player in diagonal leftUp - rightDown
                diagonal2; //number of pieces of same player in diagonal rightUp - leftDown

            //count how many pieces of the player are in left + right + 1(the new one that player put)
            horizontal = countToDirection.left(x, y, piece) + countToDirection.right(x, y, piece) + 1;

            //count how many pieces of the player are down + 1(the new one that player put), never is going to be a piece over the curren so is not neccesary count up
            vertical = countToDirection.down(x, y, piece) + 1;

            //count how many pieces of the player are in leftUp + rightDown + 1(the new one that player put)
            diagonal1 = countToDirection.leftUp(x, y, piece) + countToDirection.rightDown(x, y, piece) + 1;

            //count how many pieces of the player are in rightUp + leftDown + 1(the new one that player put)
            diagonal2 = countToDirection.rightUp(x, y, piece) + countToDirection.leftDown(x, y, piece) + 1;

            return Math.max(horizontal, vertical, diagonal1, diagonal2);
        }
    };
}());