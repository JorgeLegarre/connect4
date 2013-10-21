/*jslint browser:true */
/*global $:false, connect4: false, alert: false, confirm: false, console: false, Debug: false, opera: false, prompt: false, WSH: false */
connect4.graphic.ui = (function () {
    "use strict";
    //PRIVATE AREA
    //show a msg in the head
    var showMsgEnd = function (msg) {
        $("#head").hide();
        $("#msgVictory").show().children("h2").text(msg);

    },
        cleanMsg = function () {
            $("#head").toggle();
            $("#msgVictory").toggle().children("h2").text(" ");
        },
        //we obtain the color class of the current player
        getColor = function (isPlayer1) {
            return (isPlayer1 === true) ? "blobRed" : "blobBlue";
        },
        //dinamic initialition of the board acording to the config sizes
        initGraphicBoard = function (xpos, isPlayer1) {
            var i, j, divRow, divCol,
                //creation of the head of the table (place where move pieces)
                createHead = function () {
                    //creation of a div for row
                    divRow = $("<div>").addClass("head").attr("id", "head");

                    //fill it with columns
                    for (i = 0; i < connect4.config.X_CORD; i = i + 1) {
                        //creation of a column
                        divCol = $("<div>").addClass("headVoid").attr("name", i);

                        divRow.append(divCol);
                    }
                    //add the head to the board
                    $("#board").append(divRow);
                },
                //creation of the body of the table
                createBody = function () {
                    for (i = 0; i < connect4.config.Y_CORD; i = i + 1) {
                        //creation of a div for row
                        divRow = $("<div>").attr("id", "row" + i);

                        for (j = 0; j < connect4.config.X_CORD; j = j + 1) {
                            //creation of a column
                            divCol = $("<div>").addClass("cellVoid");

                            //add column to the row
                            divRow.append(divCol);
                        }

                        //add the row to the board
                        $("#board").append(divRow);
                    }
                };

            //creation of the head   
            createHead();

            //we set the first player piece in xpos
            $("#head").children().eq(xpos).toggleClass("headVoid").toggleClass(getColor(isPlayer1));

            //creation of the body
            createBody();
            //width of the board is n° of columns * 80 (width of 1 column)
            $("#board").width(80 * connect4.config.X_CORD);

            //heigth of the board is n° of rows * 80 (height of 1 row) + 80 (head height)
            $("#board").height(80 * connect4.config.Y_CORD + 80);
        },
        //movement of a piece to a determined position
        moveBlob = function (xpos, isPlayer1) {
            $("#head").children().removeClass().toggleClass("headVoid");
            $("#head").children().eq(xpos).toggleClass("headVoid").toggleClass(getColor(isPlayer1));
        },
        //set a piece in a coordinate
        setPiece = function (ypos, xpos, isPlayer1) {
            $("#row" + ypos).children().eq(xpos).toggleClass("cellVoid").toggleClass(getColor(isPlayer1));
        },
        //change player in head
        changePlayer = function (xpos, isPlayer1) {
            $("#head").children().removeClass().toggleClass("headVoid");
            //we put color to the new position, we use xpos and isPlayer1
            $("#head").children().eq(xpos).toggleClass("headVoid").toggleClass(getColor(isPlayer1));
        },
        //erase the whole table and print again according to the internal board
        printBoard = function (xpos, isPlayer1) {
            var i, j, value;

            //clean the whole table
            $(".blobBlue, .blobRed ").removeClass().toggleClass("cellVoid");

            //we set the piece to the xpos
            moveBlob(xpos, isPlayer1);

            //print the board
            for (i = 0; i < connect4.config.Y_CORD; i = i + 1) {
                for (j = 0; j < connect4.config.X_CORD; j = j + 1) {
                    value = connect4.board.getValue(j, i);
                    if (value === connect4.config.PLAYER_1_ID) {
                        $("#row" + i).children().eq(j).toggleClass("cellVoid").toggleClass(getColor(true));
                    }
                    if (value === connect4.config.PLAYER_2_ID) {
                        $("#row" + i).children().eq(j).toggleClass("cellVoid").toggleClass(getColor(false));
                    }

                }
            }
        };

    //PUBLIC AREA
    return {
        moveBlob: function (xpos, isPlayer1) {
            moveBlob(xpos, isPlayer1);
        },
        setPiece: function (ypos, xpos, isPlayer1) {
            setPiece(ypos, xpos, isPlayer1);
        },
        changePlayer: function (xpos, isPlayer1) {
            changePlayer(xpos, isPlayer1);
        },
        showMsgEnd: function (msg) {
            showMsgEnd(msg);
        },
        cleanMsg: function () {
            cleanMsg();
        },
        initGraphicBoard: function (xpos, isPlayer1) {
            initGraphicBoard(xpos, isPlayer1);
        },
        printBoard: function (xpos, isPlayer1) {
            printBoard(xpos, isPlayer1);
        },
        showWaiting: function () {
            showMsgEnd("Waiting movement...");
        }
    };
}());