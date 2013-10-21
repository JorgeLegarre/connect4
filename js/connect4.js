/*jslint browser:true */
/*global $: false, alert: false, confirm: false, console: false, Debug: false, opera: false, prompt: false, WSH: false */
var connect4 = {};
connect4.console = {};
connect4.graphic = {};

//execution    
$(function () {
    "use strict";
    //initialition of the game
    connect4.graphic.play.play();

    //we show a msg in console to switch to console mode
    connect4.console.ui.showActivateConsole();
});