
var GRAVITY = .001;

var data = {
    frame: 0,
    asteroids: initAsteroids(10000,1000,1000)
}

var isRunning = false;
var myCanvas = document.getElementById("mainCanvas");
var frameCount = document.getElementById("divFrameCount");
var asteroidCountDiv = document.getElementById("asteroidCount");

var ctx = myCanvas.getContext("2d");
var canvasWidth = 1000;
var canvasHeight = 1000;

function onStartButtonClick() {
    isRunning = true;
}

function onStopButtonClick() {
    isRunning = false;
}

function onResetButtonClick() {
    data.frame = 0;
    let count = document.getElementById("asteroidInput").value;
    data.asteroids = initAsteroids(count,1000,1000);
    render();
}

function onAddMore() {
    console.log("ADDED MORE!")
    let count = document.getElementById("quantityToAdd").value;
    let newDots = initAsteroids(count,1000,1000);
    console.log("Before count: " + data.asteroids.length)
    console.log("About to add: " + newDots.length)
    data.asteroids = data.asteroids.concat(newDots);
    console.log("After count: " + data.asteroids.length)

}

function startUp() {
    // Do start up stuffs

    // Start the main loop
    setInterval(onFrame, 30);

}

function onFrame() {
    if(isRunning) {
        update();
        render();
        data.frame = data.frame + 1;
    }
}

function update() {

    updateForces(data.asteroids);
    updateVelocity(data.asteroids);

    data.asteroids.forEach(function(item,index,array) {


        item.xPos = item.xPos + item.xVel;
        item.yPos = item.yPos + item.yVel;
        if((item.xPos > 1000) || (item.xPos < 0)) {
            item.xVel = item.xVel * -1;
        }
        if((item.yPos > 1000) || (item.yPos < 0)) {
            item.yVel = item.yVel * -1;
        }
    });
}

function render() {
    frameCount.innerHTML = data.frame;
    asteroidCountDiv.innerHTML = data.asteroids.length;

    let canvasData = ctx.createImageData(canvasWidth, canvasHeight);
    data.asteroids.forEach(function (item,index,array) {
        let red = 255;
        let green = item.mass > 1 ? 255 : 0;
        let blue = item.mass > 10 ? 255 : 0;
        drawPixel(canvasData, Math.floor(item.xPos), Math.floor(item.yPos), red, green, blue, 255);
    })

    ctx.putImageData(canvasData, 0, 0);
}

function drawPixel (canvasData, x, y, r, g, b, a) {
    let offset = (x + y * 1000) * 4;
    canvasData.data[offset + 0] = r;
    canvasData.data[offset + 1] = g;
    canvasData.data[offset + 2] = b;
    canvasData.data[offset + 3] = a;
}

function initAsteroids(count, maxWidth, maxHeight) {
    let asteroids = [];
    for(let i=0; i<count; i++) {

        let asteroid = new Object();
        asteroid.xPos = Math.ceil(Math.random() * maxWidth);
        asteroid.yPos = Math.ceil(Math.random() * maxHeight);
        asteroid.xVel = (Math.random() * 2) - 1;
        asteroid.yVel = (Math.random() * 2) - 1;
        asteroid.xForce = 0;
        asteroid.yForce = 0;
        asteroid.mass = 1;

        // Make 1 in 10 a 'heavy' object

        if((Math.floor(Math.random() * 100) % 10) === 0) {
            asteroid.mass = 10;
        }

        // Make 1 in 1000 an 'immense' object
        if((Math.floor(Math.random() * 1000) % 1000) === 0) {
            asteroid.mass = 1000;
        }

        asteroids.push(asteroid);
    }

    return asteroids;
}

function updateForces(asteroids) {

    asteroids.forEach(function(thisAsteroid) {

        thisAsteroid.xForce = 0;
        thisAsteroid.yForce = 0;

        asteroids.forEach(function (otherAsteroid) {

            if(thisAsteroid == otherAsteroid) {
                return;
            }

            let force = calcGravity(GRAVITY,
                thisAsteroid.mass,
                otherAsteroid.mass,
                thisAsteroid.xPos,
                thisAsteroid.yPos,
                otherAsteroid.xPos,
                otherAsteroid.yPos);

            let xVec = otherAsteroid.xPos - thisAsteroid.xPos;
            let yVec = otherAsteroid.yPos - thisAsteroid.yPos;

            let vecSize = Math.sqrt((xVec * xVec) + (yVec * yVec));
            let normXVec = xVec / vecSize;
            let normYVec = yVec / vecSize;

            thisAsteroid.xForce += normXVec * force;
            thisAsteroid.yForce += normYVec * force;
        })
    })
}

function updateVelocity(asteroids) {

    asteroids.forEach(function (asteroid) {
        let xAcc = asteroid.xForce / asteroid.mass;
        let yAcc = asteroid.yForce / asteroid.mass;

        asteroid.xVel += xAcc;
        asteroid.yVel += yAcc;
    })
}

function calcGravity(gravityConstant, mass1, mass2, oneXpos, oneYpos, twoXpos, twoYpos) {

    return gravityConstant * mass1 * mass2 / Math.sqrt( Math.pow((oneXpos - twoXpos),2) + Math.pow((oneYpos - twoYpos),2));
}


