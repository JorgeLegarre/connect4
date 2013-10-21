/*jslint browser:true */
/*global $: false, Peer: false, connect4:false,alert: false, confirm: false, console: false, Debug: false, opera: false, prompt: false, WSH: false */

var peerConnect = (function () {
    "use strict";

    var peer, conn,
        connectingInterval,
        KEY_PEERJS = 'bymx4jjq2949rudi',
        TEXT = "TEXT",
        MOVE = "MOVE",
        Package = function (type, id, value) {
            this.type = type;
            this.id = id;
            this.value = value;
        },
        setStatusGettingPeer = function () {
            $("#status").text("GETTING PEER...");
            $("#myId").text("GETTING PEER...");

            //we dissable all elements(not usernameButton), it's going to be even open of peer the one that activate controls if we had exit
            $("#chat input").not("#usernameButton").attr("disabled", "disabled");
        },

        setStatusConnected = function () {
            $("#status").text("CONNECTED");

            $("#idHost").attr("disabled", "disabled");
            $("#connect").attr("disabled", "disabled");
            $("#disconnect").removeAttr("disabled");

            $("#textSend").removeAttr("disabled");
            $("#send").removeAttr("disabled");

            $("#textSend").focus();

            $("#connectPanel").hide();
            $("#board").show();
        },

        setStatusDisconnected = function () {
            $("#status").text("DISCONNECTED");

            $("#idHost").removeAttr("disabled");
            $("#connect").removeAttr("disabled");
            $("#disconnect").attr("disabled", "disabled");

            $("#textSend").attr("disabled", "disabled");
            $("#textSend").val("");
            $("#send").attr("disabled", "disabled");

            $("#idHost").focus();
        },

        setStatusConnecting = function () {
            $("#status").text("CONNECTING...");

            $("#idHost").attr("disabled", "disabled");
            $("#connect").attr("disabled", "disabled");
            $("#disconnect").removeAttr("disabled");

            $("#textSend").removeAttr("disabled");
            $("#send").removeAttr("disabled");

            //we wait 10 seconds to connect, if not, we set status disconnect. 
            //Events in connection not return nothing, so it's not possible to know when the connection trial end.
            connectingInterval = setInterval(function () {
                clearInterval(connectingInterval);
                if (conn.open === false) {
                    setStatusDisconnected();
                }
            }, 10000);
        },

        setStatusError = function () {
            clearInterval(connectingInterval);
            $("#status").text("ERROR");
        },

        disconnectFromRemote = function () {
            conn.close();

            setStatusDisconnected();
        },

        setConnectionEvents = function () {
            //declaration of the events of the connection

            //onOpen - We have stablized connection
            conn.on('open', function () {
                console.log("Connection established - " + conn.peer);

                setStatusConnected();

                peer.disconnect();

            });

            //onData - We have received some information from a remote peer
            conn.on('data', function (data) {
                var name, newLine, receivedPackage, type, remoteUserName, remoteValue;

                receivedPackage = JSON.parse(data);
                type = receivedPackage.type;
                remoteUserName = receivedPackage.id;
                remoteValue = receivedPackage.value;

                switch (type) {
                case TEXT:
                    name = $("<span>").addClass("chatName").text(remoteUserName + ": ");
                    newLine = $("<div>").addClass("chatLineOther").text(remoteValue).prepend(name);

                    $("#chatText").append(newLine);

                    //posicionar scroll abajo
                    $('#chatText').scrollTop($('#chatText')[0].scrollHeight);
                    break;
                case MOVE:
                    connect4.graphic.play.setMove(Number(remoteValue));
                    break;
                }
            });

            //onClose - connection from the remote peer is close
            conn.on('close', function () {
                console.log("Connection closed - " + conn.peer);
                disconnectFromRemote();
            });

            //onError
            conn.on('error', function (err) {
                console.log('Connect ERROR');
                console.dir(err);
                alert('Connect error: ' + err.message);
            });
        },

        setPeerEvents = function () {
            //declaration of the events of the peer

            //we have connection with the server amd we obtain the id that identifies us to the world (another peers that want to connect us)
            peer.on('open', function (id) {
                console.log('Peer OPEN - My peer ID is: ' + id);
                $("#myId").text(id);

                //activate/desactivate controls over the page to be in disconnect status
                setStatusDisconnected();
            });

            //We listen to entry connections
            peer.on('connection', function (conne) {
                conn = conne;

                //we prepare the events for the connection
                setConnectionEvents();

                //we receibe connection, we are going to be player 2
                connect4.graphic.play.play(true);
                connect4.graphic.ui.showWaiting();

            });

            //we have lost peer connection
            peer.on('close', function () {
                //update id code to ---
                $("#myId").text("Lost peer connection. Refresh page to obtain a new one.");

                //we dissable all elements(not usernameButton), it's going to be even open of peer the one that activate controls if we had exit
                $("#chat input").not("#usernameButton").attr("disabled", "disabled");

            });

            //onError
            peer.on('error', function (err) {
                console.log('Peer ERROR');
                console.dir(err);
                setStatusError();
                alert('Peer error: ' + err.message);
                setStatusDisconnected();
            });
        },

        freePeer = function () {
            if (peer !== undefined && !peer.destroyed) {
                peer.destroy();
            }
        },

        getPeer = function () {
            setStatusGettingPeer();

            //Destroy any previus peer connection to clean all possibilities
            freePeer();

            /*if we set debug, etc, we see the complete trace with the ice server, etc
            var peer = new Peer({key: 'bymx4jjq2949rudi',
                                // Set highest debug level (log everything!).
                                  debug: 3,

                                  // Set a logging function:
                                  logFunction: function() {
                                    var copy = Array.prototype.slice.call(arguments).join(' ');
                                    console.log(copy);
                                  }});*/
            //creation of the local peer, we use our personal key_code obtained in the registration in peerJs.com
            peer = new Peer({
                key: KEY_PEERJS
            });

            setPeerEvents();
        },

        connectToRemote = function (remotePeerId) {
            if (remotePeerId !== "") {
                setStatusConnecting();

                if (peer.open === true) {
                    conn = peer.connect(remotePeerId, {
                        label: 'chat',
                        serialization: 'none',
                        reliable: false
                    });

                    setConnectionEvents();

                    //we that call to the remote are going to be player 1
                    connect4.graphic.play.play(true);

                } else {
                    alert("Peer connection is lost.\n" +
                        "A new peer connection is going to be renewed automatically.\n" +
                        "Please try to connect again after the new one is obtained.");
                    getPeer();
                }
            }
        },

        sendText = function (textSend) {
            var newLine, name, sendPackage;
            if (textSend !== "") {
                name = $("<span>").addClass("chatName").text("You: ");
                newLine = $("<div>").addClass("chatLineMe").text(textSend).prepend(name);

                $("#chatText").append(newLine);

                //posicionar scroll abajo
                $('#chatText').scrollTop($('#chatText')[0].scrollHeight);

                sendPackage = new Package(TEXT, $("#user").text(), textSend);

                conn.send(JSON.stringify(sendPackage));
            }
        },
        sendMove = function (xpos) {
            var sendPackage = new Package(MOVE, $("#user").text(), xpos);

            conn.send(JSON.stringify(sendPackage));
        },
        play = function () {
            /*************************************************
    LOGIC
    *************************************************/
            //we obtain a peer (identification) from the Server
            getPeer();

            //we prepare the event click over button connect
            $("#connect").click(function () {
                if ($("#idHost").val().trim() !== "") {
                    //connect our peer with a remote peer
                    var remotePeerId = $("#idHost").val();

                    connectToRemote(remotePeerId);
                }
            });

            //we prepare the event click over button connect
            $("#idHost").keypress(function (e) {
                //if is enter
                if (e.which === 13) {
                    //connect our peer with a remote peer
                    var remotePeerId = $("#idHost").val();
                    connectToRemote(remotePeerId);
                }
            });

            //declaration of the event click on button disconnect
            $("#disconnect").click(function () {
                disconnectFromRemote();
            });

            //declaration of the event click on the button send
            $("#send").click(function () {
                var textSend = $("#textSend").val().trim();
                sendText(textSend);
                $("#textSend").val("");
            });

            //we send text when press "enter" over the text box
            $("#textSend").keypress(function (e) {
                //if is enter
                if (e.which === 13) {
                    var textSend = $("#textSend").val().trim();
                    sendText(textSend);
                    $("#textSend").val("");
                }
            });

            //we close all connections if windows is close or reload
            $(window).on('unload', function () {
                freePeer();
            });
            $(window).on('beforeunload', function () {
                freePeer();
            });

            var changeUser = function () {
                localStorage.username = $("#username").val();

                location.reload();
            };

            //when login button is pressed, we save the user and reload the page
            $("#loginButton").click(function () {
                changeUser();
            });
            //if user press enter in textbox
            $("#username").keypress(function (e) {
                //if is enter
                if (e.which === 13) {
                    changeUser();
                }
            });

            //if the user want change the user, we toggle the divs chat and login
            $("#usernameButton").click(function () {
                $("#chat").toggle();
                $("#login").toggle();
            });

            //if we have not join with a username, show the login div, in other case, we show te chat window
            if (localStorage.username === undefined) {
                $("#chat").toggle();
            } else {
                $("#login").toggle();
                $(".user").text(localStorage.username);
            }

            $("#board").hide();
        };

    //PUBLIC AREA
    return {
        play: function () {
            play();
        },
        sendMove: function (xpos) {
            sendMove(xpos);
        }
    };
}());

$(peerConnect.play());