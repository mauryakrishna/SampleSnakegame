define(['app', 'jquery', 'hammer'], function(app, $, Hammer){
    app.directive('playDirective', ['playServices', '$window', '$timeout',  function(playServices, $window, $timeout){
        return {
            restrict:'EA',
            templateUrl:'./../play/board.html',
            scope: false,
            controller:'playController',
            link: function(scope, element, attrs) {
                var canvasElem = element.find('canvas');
                var canvas = canvasElem[0],
                    ctx = canvas.getContext("2d"),
                    gameOverElem = element[0].getElementsByClassName('game-start-over')[0],
                    snakeMovementInterval = 200,
                    snakeArray = [],
                    snakeInitialLength = 3,
                    height = 400,
                    width = 400,
                    squareWidth = 20,
                    /*
                    * Area of play board 400 x 400  = 160000
                    * Area of one cell on play board 20 x 20 = 400
                    * Number of cell possible with above height and width = 160000/400 = 400
                    * So at any time play must have 400 cells where one cell size may be smaller
                    * */
                    fruit = {x: -1, y: -1},
                    DIRECTIONS = {
                        LEFT: 37,
                        UP: 38,
                        RIGHT: 39,
                        DOWN: 40,
                        W: 87,
                        A: 65,
                        S: 83,
                        D: 68
                    },
                    defaultDirection = playServices.getRandomDirection(),
                    snakeInterval = null;
                /*start of resizing play area*/
                /*
                * For supporting the various small screens of smart phones
                * 370 - 17
                * 300 - 15
                * 200 - 10
                * */
                var windowWidth = $window.screen.availWidth;
                switch(true) {
                    case windowWidth<300 :/*&& windowWidth>=200*/
                        height = width = 200;
                        squareWidth = 10;
                        break;
                    case windowWidth<340 && windowWidth>=300:
                        height = width = 300;
                        squareWidth = 15;
                        break;
                    case windowWidth<430:
                        height = width = 340;
                        squareWidth = 17;
                        break;
                }
                //set canvas height and width calculated
                canvas.height = height;
                canvas.width = width;
                $(gameOverElem).height(height);
                $(gameOverElem).width(width);

                function resetSnakeParams() {
                    //clear board
                    redrawPlayBoard();
                    //reset score to zero
                    scope.resetScore();
                    scope.resetScoreFlag();
                    //do again what happens on game load
                    onLoad();
                }

                function redrawPlayBoard() {
                    ctx.clearRect(0, 0, width, height);
                }

                scope.play = function (){
                    if(scope.bSavingInProgress){
                        return;
                    }
                    //hide overlay layer
                    showHideGameStart();
                    //if its play again then reset the score and snake array length
                    if(scope.bCollision) {
                        scope.updateCollision(false);
                        resetSnakeParams();
                    }
                    //start game
                    start();
                };

                scope.togglePause = function (){
                    //clear interval to stop moving the snake hence giving the feeling of pause
                    if(snakeInterval) {
                        stopSnakeMovement();
                    }
                    else
                        start();
                };
                function stopSnakeMovement() {
                    if(snakeInterval){
                        clearInterval(snakeInterval);
                        snakeInterval = null;
                    }
                }
                function showHideGameStart() {
                    var classList = gameOverElem.classList;
                    if(!classList.contains('hide')){
                        gameOverElem.classList.add('hide');
                    }
                    else {
                        gameOverElem.classList.remove('hide');
                        //the below updation should happen automatically but not working so forced
                        scope.updateCollision(true);
                    }
                }

                function start(){
                    if(!snakeInterval)
                        snakeInterval = setInterval(moveSnake, snakeMovementInterval);
                }

                function setFruit(){
                    var x = playServices.getRandomCoordinates(height, squareWidth),
                        y = playServices.getRandomCoordinates(height, squareWidth);
                        fruit.x = x,
                        fruit.y = y;
                    //check with newly generated fruit if that is found to be on snakes body
                    if(checkCollisionWithSelf(x, y, snakeArray)){
                        setFruit();
                        return;
                    }
                    setInterval(function(){
                        ctx.fillStyle = "#FF0000";
                        ctx.fillRect(fruit.x, fruit.y, squareWidth, squareWidth);
                        setTimeout(function(){
                            ctx.clearRect(fruit.x, fruit.y, squareWidth, squareWidth);
                        }, 500)
                    }, 1000);
                }

                function setSnakeStartPosition(){
                    //for now snake start from fixed position
                    var randomXPos = playServices.getRandomCoordinates(height, squareWidth);
                    var randomYPos = playServices.getRandomCoordinates(height, squareWidth);
                    snakeArray = [];
                    //initially set snake position straight
                    for(var len = snakeInitialLength; len>0; len--) {
                        snakeArray.push(getSnakeCoordsByDirection(randomXPos, randomYPos));
                    }
                    //set the snake start direction
                    snakeArray.direction = defaultDirection;
                    drawSnake(snakeArray);
                }

                function getSnakeCoordsByDirection(firstX, firstY, snakeDirection) {
                    switch(snakeDirection){
                        case DIRECTIONS.UP:
                            firstY = (firstY-squareWidth)%height;
                            firstY = firstY<0?height-squareWidth:firstY;
                            break;
                        case DIRECTIONS.RIGHT:
                            firstX = (firstX+squareWidth)%width;

                            break;
                        case DIRECTIONS.DOWN:
                            firstY = (firstY+squareWidth)%height;

                            break;
                        case DIRECTIONS.LEFT:
                            firstX = (firstX-squareWidth)%width;
                            firstX = firstX<0?height-squareWidth:firstX;
                            break;
                    }

                    return {x:firstX, y:firstY};
                }

                function moveSnake(){

                    /*below code is to prevent collision of exactly opposite direction
                     * which happend if user press the direction button in very quick sequence,
                     * in that quick sequence snake does not move at all,
                     * and defaultDirection gets updated correctly according to button press,
                     * which becomes out of sync in what direction the snake was and hence lead to collision
                     * to avoid that new direction will always be calculated taking the snake's current direction
                     * and accordingly update the new direction.
                     * */
                    snakeArray.direction = defaultDirection;

                    //take first head cell and advance its position according to direction
                    var firstX = snakeArray[0].x,
                        firstY = snakeArray[0].y,
                        newXY = getSnakeCoordsByDirection(firstX, firstY, snakeArray.direction);

                    //check collision
                    if(checkCollisionWithSelf(newXY.x, newXY.y, snakeArray)) {
                        stopSnakeMovement(snakeInterval);
                        //game over
                        showHideGameStart();
                        //when game over push this csore to existing set of scores
                        scope.pushNewScoreToArray(scope.score);
                        return ;
                    }

                    //check if newly calculated x, y coords are fruit coords
                    if(fruit.x == newXY.x && fruit.y == newXY.y){
                        //put newly cordinated cell to head
                        snakeArray.unshift(newXY);

                        //increase score count
                        scope.updateScore();

                        //fruit has been eaten clear that fruit and create new fruit
                        ctx.clearRect(newXY.x, newXY.y, squareWidth, squareWidth);
                        //create new fruit
                        setFruit();
                    }
                    else{
                        snakeArray.unshift(newXY);
                        //take tail cell and clear its position
                        var tail = snakeArray.pop();
                        ctx.clearRect(tail.x, tail.y, squareWidth, squareWidth);
                    }
                    drawSnake(snakeArray);
                }

                function drawSnake(snakeArray){
                    var snakeLength = snakeArray.length;
                    for(var len=0; len<snakeLength; len++) {
                        var rect = snakeArray[len];
                        ctx.fillStyle = "blue";
                        ctx.fillRect(rect.x, rect.y, squareWidth, squareWidth)
                    }
                }

                function checkCollisionWithSelf(x, y, snakeArray){
                    var snakeLen = snakeArray.length,
                        len,
                        snake;
                    for(len=0; len<snakeLen; len++){
                        snake = snakeArray[len];

                        if(snake.x == x && snake.y == y){
                            //collision found
                            return true;
                        }
                    }
                    //no collision
                    return false;
                }
                function setSnakeDirection(keyCode) {
                    defaultDirection = snakeArray.direction;
                    if ( defaultDirection !== DIRECTIONS.RIGHT && (keyCode == DIRECTIONS.LEFT || keyCode == DIRECTIONS.A)) {
                        defaultDirection = DIRECTIONS.LEFT;
                    } else if (defaultDirection !== DIRECTIONS.DOWN && (keyCode == DIRECTIONS.UP || keyCode == DIRECTIONS.W)) {
                        defaultDirection = DIRECTIONS.UP;
                    } else if (defaultDirection !== DIRECTIONS.LEFT && (keyCode == DIRECTIONS.RIGHT || keyCode == DIRECTIONS.D)) {
                        defaultDirection = DIRECTIONS.RIGHT;
                    } else if (defaultDirection !== DIRECTIONS.UP && (keyCode == DIRECTIONS.DOWN || keyCode == DIRECTIONS.S)) {
                        defaultDirection = DIRECTIONS.DOWN;
                    }
                }

                function getDirection(e) {
                    var keyCode = e.keyCode;
                    setSnakeDirection(keyCode);
                    if(keyCode == 32) {
                        scope.togglePause();
                    }
                }

                function removeKeyboardEvents(){
                    $window.removeEventListener('keyup', getDirection);
                }

                function setKeyboardEvents() {
                    $window.addEventListener("keyup", getDirection);
                }

                function  onLoad() {
                    removeKeyboardEvents();
                    setKeyboardEvents();
                    setFruit();
                    setSnakeStartPosition();
                }

                /*touch event andling for snake movement control*/
                //attach event for only devices having touch support
                if ("ontouchstart" in window) {
                    var container = element[0].getElementsByClassName('canvasContainer');
                    var hm = new Hammer(container[0]);
                    hm.get('swipe').set({direction: Hammer.DIRECTION_ALL});
                    hm.on('swipe', function (event) {
                        var touchDirection;
                        switch (event.direction) {
                            case Hammer.DIRECTION_LEFT: //2
                                touchDirection = DIRECTIONS.LEFT;
                                break;
                            case Hammer.DIRECTION_RIGHT: //	4
                                touchDirection = DIRECTIONS.RIGHT;
                                break;
                            case Hammer.DIRECTION_UP: //	8
                                touchDirection = DIRECTIONS.UP;
                                break;
                            case Hammer.DIRECTION_DOWN: //16
                                touchDirection = DIRECTIONS.DOWN;
                                break;
                        }
                        setSnakeDirection(touchDirection);
                    });
                }

                $timeout(function(){
                    //for smaller devices, manage collapse menu bar
                    var $navbarCollapse = $('.navbar-collapse ', element);
                    $('li a', $navbarCollapse).on('click', function () {
                        $navbarCollapse.collapse('hide');
                    });
                }, 0);

                onLoad();
            }
        }
    }])
});