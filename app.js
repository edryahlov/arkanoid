/* jshint browser: true */

window.onload = function() {
    "use strict";
    
    var version = 0.5;
    document.getElementById("ver").innerHTML = '(ver. '+ String(version)+')';
    
    var canvas = document.getElementById("game");
    var context = canvas.getContext("2d");
    
    var knock = new Audio('knock.mp3');
    var glass = new Audio('glass.mp3');
    var music = new Audio('music.mp3');
        music.loop = true;
        music.currentTime = 6;
        music.volume=0.7;
    
    var block = {
            height : 20,
            width : 50
    };

    var ball = {
            x : 200,
            y : 100,
            rad : 10,
            direction : {
                x : "none",
                y : "up"
            },
            speed : 1,
            step : 1
    };
    
    var url = "shape_level1.txt";
    var collision = false, collisionWithBlock, collisionWithBorderX = false, collisionWithBorderY = false;
    var tickInterval = ball.speed;
    
    var blockOrder = getBlockOrder(url);
    var blockCoords = new Array(0);
    
    var longestLine;
    for (var i=0; i<blockOrder.length-1; i++) {
        longestLine = Math.max(blockOrder[i].length,blockOrder[i+1].length);
    }
    c(longestLine);
    canvas.width = block.width * longestLine;
    canvas.height = block.height * blockOrder.length + 200;
    
    ball.x = canvas.width / 2;
    //ball.y = canvas.height - (ball.rad + 5);
    

    ///////////////////////////////////////
    ///////////////////////////////////////
    ///////////////////////////////////////

    music.play();
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
                blockCoords[i].coord.y <= ((ball.y - ball.rad) && (ball.y + ball.rad)) &&
                (blockCoords[i].coord.y + block.height) >= ((ball.y - ball.rad))
            ) {
                collision = true;
                collisionWithBlock = String(i);
                break;
            }
        }
        if (
            (ball.y + ball.rad) > canvas.height-5 || 
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
            //c(collisionWithBlock +', left: '+ blockCoords.length);
            
        }

        if (ball.direction.x === "none") {ball.direction.x = "left";}

        if (ball.direction.x === "left" && collisionWithBorderX) {
            ball.direction.x = "right";
        }
        else if (ball.direction.x === "right" && collisionWithBorderX) {
            ball.direction.x = "left";
        }

        if (!collisionWithBorderX) {
            switch (ball.direction.y) {
                case "up": ball.direction.y = "down"; break;
                case "down": ball.direction.y = "up"; break;
            }
            
        }
        
        if (collisionWithBorderX || collisionWithBorderY) {
            knock.currentTime = 0;
            knock.play();
        } else {
            glass.currentTime = 0;
            glass.play();
        }
        
        
        collision = '';
        collisionWithBlock = '';
        collisionWithBorderX = false;
        collisionWithBorderY = false;
    }

    function moveBall() {
        switch (ball.direction.x) {
            case "none": break;
            case "left": ball.x -= ball.step; break;
            case "right": ball.x += ball.step; break;
        }
        switch (ball.direction.y) {
            case "up": ball.y -= ball.step; break;
            case "down": ball.y += ball.step; break;
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
                    color : [
                        Math.floor(Math.random()*200),
                        Math.floor(Math.random()*200),
                        Math.floor(Math.random()*200)
                    ],
                    type : "-",
                    show : true
                };
            }
        }
    }

    function drawBlocks() {
        for (var i=0; i<blockCoords.length; i++) {
            //context.fillStyle = 'rgb('+Math.floor(Math.random()*250)+','+Math.floor(Math.random()*250)+','+Math.floor(Math.random()*250)+')';
            context.fillStyle = 'rgb('+blockCoords[i].color[0]+','+blockCoords[i].color[1]+','+blockCoords[i].color[2]+')';
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

