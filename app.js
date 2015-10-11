/* jshint browser: true */

window.onload = function() {
    "use strict";
    
    var version = 0.9;
    document.getElementById("ver").innerHTML = '(ver. '+ String(version)+')';
    
    var canvas = document.getElementById("game");
    var context = canvas.getContext("2d");
    
    var knock = new Audio('knock.mp3');
        //knock.volume = 0;
    var glass = new Audio('glass.mp3');
        //glass.volume = 0;
    var music = new Audio('music.mp3');
        music.loop = true;
        music.currentTime = 6;
        music.volume=0.2;
    
    var block = {
            height : 20,
            width : 50
    };
    var ball = {
            x : 350,
            y : 400,
            rad : 10,
            direction : {
                x : "none",
                y : "up"
            },
            speed : 1,
            step : 1
    };
    
    var lvl=1;
    //var url = "shape_level"+lvl+".txt";
    var collision = false, collisionWithBlock, collisionWithBat = false, collisionWithBorderX = false, collisionWithBorderY = false;
    var tickInterval = ball.speed;
    var safeBorders = 5;
    
    var blockOrder = getBlockOrder();
    var blockCoords = new Array(0);
    
    var longestLine, mousePos;
    for (var i=0; i<blockOrder.length-1; i++) {
        longestLine = Math.max(blockOrder[i].length,blockOrder[i+1].length);
    }
    c(longestLine);
    canvas.width = block.width * longestLine;
    canvas.height = block.height * blockOrder.length + 300;
    
    var bat = {
            x : canvas.width / 2,
            y : canvas.height - 10 - block.height
    };

    ball.x = bat.x / 2;
    ball.y = bat.y - block.height - (ball.rad + 5);

    ///////////////////////////////////////
    ///////////////////////////////////////
    ///////////////////////////////////////

    music.play();
    getBlockCoords();
    
    setInterval(function(){
        context.fillStyle = "white";
        context.fillRect(0,0,canvas.width,canvas.height);
        
        drawBlocks();
        drawBat();
        drawBall();
        checkCollision();
        if (collision) {reactOnCollision();}
        if (blockCoords.length === 0) {changeLevel();}
        moveBall();
    },tickInterval);
    
    document.onmousemove = handleMouseMove;
    setInterval(getMousePosition, 10);
    
    ///////////////////////////////////////
    ///////////////////////////////////////
    ///////////////////////////////////////
    
    function changeLevel() {
        if (lvl === 6) {
            lvl++;
            blockOrder = getBlockOrder();
            document.getElementById("lvl").innerHTML = lvl;
            getBlockCoords();
        } else {
            alert("Game Over!\n\nWell done!");
            window.location = "index.html";
        }
    }
    
    function handleMouseMove(event) {
        mousePos = {x: event.pageX, y: event.pageY};
    }
    function getMousePosition() {
        if (mousePos.x >= 0 && mousePos.x <= (canvas.width - block.width * 2)) {
            bat.x = mousePos.x;
        }
    }

    function checkCollision() {
        /////////// detect block collision
        for (var i=0; i<blockCoords.length; i++) {
            if (
                blockCoords[i].coord.x <= (ball.x + ball.rad) && (blockCoords[i].coord.x + block.width) >= (ball.x - ball.rad) &&
                blockCoords[i].coord.y <= ((ball.y - ball.rad) && (ball.y + ball.rad)) &&
                (blockCoords[i].coord.y + block.height) >= ((ball.y - ball.rad))
            ) {
                collision = true;
                collisionWithBlock = String(i);
                break;
            }
        }
        /////////// detect bat collision
        if (
                bat.x <= (ball.x + ball.rad) && (bat.x + block.width * 2) >= (ball.x - ball.rad) &&
                bat.y < (ball.y + ball.rad)
            ) {
                collision = true;
                collisionWithBat = true;
        }
        /////////// detect borders collision
        if (
            (ball.y + ball.rad) > canvas.height - safeBorders || 
            (ball.y - ball.rad) <= 0 + safeBorders
        ) {
            collision = true;
            collisionWithBorderY = true;
        }
        if (
            (ball.x + ball.rad) >= canvas.width - safeBorders || 
            (ball.x - ball.rad) <= 0 + safeBorders
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
    
    function getBlockOrder() {
        //var urll = document.getElementById("lvl"+lvl).innerHTML;
        var url = "shape_level"+lvl+".txt";
        var stringData = $.ajax({url: url, cache: false, async: false}).responseText;
        return stringData.split("\r\n");
    }
    
    function getBlockCoords() {
        for (var i=0; i<blockOrder.length; i++) {
            for (var z=0; z<blockOrder[i].length; z++) {
                var x = z * block.width;
                var y = i * block.height;
                var blockType = blockOrder[i][z] || '0';
                
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
                    type : blockType
                };
            }
        }
    }

    function drawBlocks() {
        for (var i=0; i<blockCoords.length; i++) {
            if (blockCoords[i].type === '-') {
                context.fillStyle = 'rgb('+blockCoords[i].color[0]+','+blockCoords[i].color[1]+','+blockCoords[i].color[2]+')';
                context.fillRect(blockCoords[i].coord.x, blockCoords[i].coord.y, block.width, block.height);
            }
        }
    }

    function drawBall() {
        context.beginPath();
        context.arc(ball.x,ball.y,ball.rad,0,2*Math.PI);
        context.fillStyle = "#000";
        context.fill();
    }
    
    function drawBat() {
        context.fillStyle = "black";
        context.fillRect(bat.x, bat.y, block.width * 2, block.height);
    }
    
    function c(out) {console.log(out);}
};

