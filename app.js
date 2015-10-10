/* jshint browser: true */

window.onload = function() {
    "use strict";
    
    var version = 0.2;
    document.getElementById("ver").innerHTML = '(ver. '+ String(version)+')';
    
    var canvas = document.getElementById("game");
    var context = canvas.getContext("2d");
    
    var block = {
            height : 50,
            width : 100
    };
    var ball = {
            x : 400,
            y : 300,
            rad : 10,
            direction : {
                x : "none",
                y : "up"
            },
            speed : 20
    };
    
    var url = "shape_level1.txt";
    var collision = false, collisionWithBlock, collisionWithBorderX = false, collisionWithBorderY = false;
    var tickInterval = 100;
    
    var blockOrder = getBlockOrder(url);
    var blockCoords = new Array(0);
    
    canvas.width = block.width * blockOrder[0].length;
    canvas.height = 500;

    ///////////////////////////////////////
    ///////////////////////////////////////
    ///////////////////////////////////////

    
    getBlockCoords();
    
    setInterval(function(){
        context.fillStyle = "white";
        context.fillRect(0,0,canvas.width,canvas.height);
        
        drawBlocks();
        drawBall();
        checkCollision();
        if (collision) {reactOnCollision();}
        moveBall();
    },tickInterval);


    
    ///////////////////////////////////////
    ///////////////////////////////////////
    ///////////////////////////////////////

    function checkCollision() {
        for (var i=0; i<blockCoords.length; i++) {
            if (
                blockCoords[i].coord.x <= ball.x && (blockCoords[i].coord.x + block.width) >= ball.x &&
                blockCoords[i].coord.y <= (ball.y - ball.rad) && (blockCoords[i].coord.y + block.height) >= (ball.y - ball.rad)
            ) {
                collision = true;
                collisionWithBlock = i;
                break;
            }
        }
        if (
            (ball.y + ball.rad) >= canvas.height || 
            (ball.y - ball.rad) <= 0
        ) {
            collision = true;
            collisionWithBorderY = true;
        }
        if (
            (ball.x + ball.rad) >= canvas.width || 
            (ball.x - ball.rad) <= 0
        ) {
            collision = true;
            collisionWithBorderX = true;
        }
    }

    function reactOnCollision() {
        
        if (collisionWithBlock) {
            context.fillStyle = "red";
            context.fillRect(blockCoords[collisionWithBlock].coord.x, blockCoords[collisionWithBlock].coord.y, block.width, block.height);
            blockCoords.splice(collisionWithBlock,1);
        }

        if (ball.direction.x === "none") {ball.direction.x = "left";}

        if (ball.direction.x === "left" && collisionWithBorderX) {ball.direction.x = "right";}
        else if (ball.direction.x === "right" && collisionWithBorderX) {ball.direction.x = "left";}

        if (!collisionWithBorderX) {
            switch (ball.direction.y) {
                case "up": ball.direction.y = "down"; break;
                case "down": ball.direction.y = "up"; break;
            }
        }
        
        collision = '';
        collisionWithBlock = '';
        collisionWithBorderX = false;
        collisionWithBorderY = false;
    }

    function moveBall() {
        switch (ball.direction.x) {
            case "none": break;
            case "left": ball.x -= ball.rad; break;
            case "right": ball.x += ball.rad; break;
        }
        switch (ball.direction.y) {
            case "up": ball.y -= ball.speed; break;
            case "down": ball.y += ball.speed; break;
        }
    }
    
    function getBlockOrder(url) {
        var stringData = $.ajax({url: url, async: false}).responseText;
        return stringData.split("\r\n");
    }
    
    function getBlockCoords() {
        for (var i=0; i<blockOrder.length; i++) {
            for (var z=0; z<blockOrder[i].length; z++) {
                var x = z * block.width;
                var y = i * block.height;
                
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
            //context.fillStyle = 'rgb('+Math.floor(Math.random()*250)+','+Math.floor(Math.random()*250)+','+Math.floor(Math.random()*250)+')';
            context.fillStyle = "black";
            context.fillRect(blockCoords[i].coord.x, blockCoords[i].coord.y, block.width, block.height);
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
    
    function c(out) {console.log(out);}
};

