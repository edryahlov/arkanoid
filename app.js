/* jshint browser: true */

window.onload = function() {
    "use strict";
    
    var version = 0.1;
    document.getElementById("ver").innerHTML = '(ver. '+ String(version)+')';
    
    var canvas = document.getElementById("game");
    var context = canvas.getContext("2d");
    
    var blockHeight = 50;
    var blockWidth = 100;
    var ball = {x:100, y:160, rad:10};
    
    var url = "shape_level1.txt";
    var collision;
    
    var blockOrder = getBlockOrder(url);
    var blockCoords = new Array(0);
    
    canvas.width = blockWidth * blockOrder[0].length;
    canvas.height = 500;

    ///////////////////////////////////////
    ///////////////////////////////////////
    ///////////////////////////////////////

    
    getBlockCoords();
    drawBlocks();
    drawBall();
    checkCollision();

    if (collision) {
        context.fillStyle = "red";
        context.fillRect(blockCoords[collision].coord.x, blockCoords[collision].coord.y, blockWidth, blockHeight);
    }
    
    ///////////////////////////////////////
    ///////////////////////////////////////
    ///////////////////////////////////////

    function checkCollision() {
        for (var i=0; i<blockCoords.length; i++) {
            if (
                blockCoords[i].coord.x <= ball.x && (blockCoords[i].coord.x + blockWidth) >= ball.x &&
                blockCoords[i].coord.y <= (ball.y - ball.rad) && (blockCoords[i].coord.y + blockHeight) >= (ball.y - ball.rad)
            ) {
                //c(blockCoords[i].coord.x +' - '+ blockCoords[i].coord.y);
                collision = i; break;
            }
        }
    }

    function c(out) {console.log(out);}

    function getBlockOrder(url) {
        var stringData = $.ajax({url: url, async: false}).responseText;
        return stringData.split("\r\n");
    }
    
    function getBlockCoords() {
        for (var i=0; i<blockOrder.length; i++) {
            for (var z=0; z<blockOrder[i].length; z++) {
                var x = z * blockWidth;
                var y = i * blockHeight;
                
                blockCoords[blockCoords.length] = {
                    coord : {
                        x: x,
                        y: y
                    },
                    type : "-",
                    show : true
                };
            }
        }
    }

    function drawBlocks() {
        for (var i=0; i<blockCoords.length; i++) {
            context.fillStyle = 'rgb('+Math.floor(Math.random()*250)+','+Math.floor(Math.random()*250)+','+Math.floor(Math.random()*250)+')';
            context.fillRect(blockCoords[i].coord.x, blockCoords[i].coord.y, blockWidth, blockHeight);
        }
    }

    function drawBall(x,y,rad) {
        x = x || ball.x;
        y = y || ball.y;
        rad = rad || ball.rad;

        context.beginPath();
        context.arc(x,y,rad,0,2*Math.PI);
        context.fillStyle = "#000";
        context.fill();
    }
    
    
};

