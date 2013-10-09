/*jslint browser:true */
/*global connect4:false, alert: false, confirm: false, console: false, Debug: false, opera: false, prompt: false, WSH: false */
connect4.ui = (function () {
    "use strict";
    /*PRIVATE FUNCTIONS*/
    //print the head of the board, numerics 1 2 3 4 5 acording the x_axis size
    var getStyleArray = function () {
        var value,
            i,
            j,
            styleArray = [];
        //styleArray[0] --> go the string that we want to apply styles
        styleArray.push(connect4.config.COLOR_DEFAULT); //head style
        for (i = 0; i < connect4.config.Y_CORD; i = i + 1) {
            for (j = 0; j < connect4.config.X_CORD; j = j + 1) {
                value = connect4.board.getValue(j, i);
                switch (value) {
                case connect4.config.DEFAULT_CHAR:
                    styleArray.push(connect4.config.COLOR_DEFAULT);
                    break;
                case connect4.config.PLAYER_1_ID:
                    styleArray.push(connect4.config.COLOR_PLAYER_1);
                    break;
                case connect4.config.PLAYER_2_ID:
                    styleArray.push(connect4.config.COLOR_PLAYER_2);
                    break;
                }
            }
        }
        return styleArray;
    },
        getStyledHead = function () {
            var i,
                aux = "%c",
                num;
            for (i = 0; i < connect4.config.X_CORD; i = i + 1) {
                num = i + 1;
                aux += num + " ";
            }
            return aux;
        },
        getStyledBoard = function () {
            var i,
                j,
                value,
                boardString = ""; //first style for the head
            for (i = 0; i < connect4.config.Y_CORD; i = i + 1) {
                for (j = 0; j < connect4.config.X_CORD; j = j + 1) {
                    value = connect4.board.getValue(j, i);
                    boardString += "%c" + value + " ";
                }
                boardString += "\n";
            }
            return boardString;
        },
        //print the board
        printBoard = function () {
            var stringBoard,
                styleArray;
            //we obtain a string with %c before the places where is possible to change color
            stringBoard = getStyledHead() + "\n" + getStyledBoard();
            //we obtain the styleArray
            styleArray = getStyleArray();
            //we put like first element the stringBoard, this is the format that console.log.apply requires            
            styleArray.unshift(stringBoard);
            console.log.apply(console, styleArray);
        },
        //get de player description
        getPlayerDesc = function (isPlayer1) {
            return isPlayer1 ? "Player 1(" + connect4.config.PLAYER_1_ID + ")" : "Player 2(" + connect4.config.PLAYER_2_ID + ")";
        };
    /*PUBLIC FUNCTIONS*/
    return {
        showBoard: function () {
            console.clear();
            printBoard();
        },
        //ask with to a player, position where want to put a piece, or to write the exit word
        askPlayerPosition: function (isPlayer1) {
            var player_text = getPlayerDesc(isPlayer1);
            return prompt(player_text + " vilket nummer. Skriv '" + connect4.config.EXIT + "' för att sluta");
        },
        showWinner: function (isPlayer1) {
            var playerDesc = getPlayerDesc(isPlayer1);
            console.log('GRATTIS ' + playerDesc + 'har vunnit !! !! !! !');
            alert('GRATTIS ' + playerDesc + 'har vunnit !! !! !! !');
        },
        showDraw: function () {
            console.log('It´s a Draw !! !! !! !');
            alert('It´ s a Draw !! !! !! !');
        },
        sayBye: function () {
            console.log("Bye bye!!!!");
        }
    };
}());