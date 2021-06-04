var audio, canvas, context, audioctx, analyser, oscillator, freqArr, barHeight, source, colorSelect, canvasC, contextC, grd1, grd2;
var windowWidth, windowHeight, topDiv, vol, myTime;
var bigBars = 0;
var colorStyle = 0;
var pastIndex = 900;
var WIDTH = 1024;
var HEIGHT = 350;
var INTERVAL = 128;//256;
var SAMPLES = 2048;//4096;//1024;//512;//2048; //this is the main thing to change right now
var r = 0;
var g = 0;
var b = 255;
var x = 0;
var currVol = .3;
let isPlaying = true;


function initialize() {
    canvas = document.getElementById("cnv1"); //drawing the canvas
    context = canvas.getContext("2d");
    
    audioctx = new AudioContext(); //setting up audio analyzer to get frequency info
    analyser = audioctx.createAnalyser();
    analyser.fftSize = SAMPLES;

    oscillator = audioctx.createOscillator();
    oscillator.connect(audioctx.destination);

    source = audioctx.createMediaElementSource(audio);
    source.connect(analyser);
    source.connect(audioctx.destination);

    freqArr = new Uint8Array(analyser.frequencyBinCount);

    barHeight = HEIGHT;


    /////////////////////////////////////////////////////////////////////

    canvasC = document.getElementById("circlecnv");
    contextC = canvasC.getContext("2d");

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    canvasC.width = windowWidth;
    canvasC.height = windowHeight;

    var canvasTop = document.getElementById("topcnv");
    var contextTop = canvasTop.getContext("2d");

    canvasTop.width = windowWidth;
    canvasTop.height = 75;

    contextTop.fillStyle = "rgb(" + 128 + "," + 128 + "," + 128 + ")";
    contextTop.fillRect(0, 0, windowWidth, 75);

    topDiv = document.getElementById("UI");
    topDiv.onmouseout = function () { myTime = setTimeout(mouseOutUI, 3000) }

    window.requestAnimationFrame(draw);
}

if (isPlaying) {
    
    window.requestAnimationFrame(draw);

}


let colorStyle = 0;
function drawSides() {
    //this is for the circular colors that come in from the sides of the screen
    
    grd1 = contextC.createRadialGradient(windowWidth / 2, windowHeight / 2, 800 - (bigBars * 40), windowWidth / 2, windowHeight / 2, 2400);
    if (colorStyle == 0) {
        grd1.addColorStop(1, "fuchsia");
        grd1.addColorStop(0, "black"); //ORIGINAL rgb color cycle 
    }
    else if (colorStyle == 1) {
        grd1.addColorStop(1, "red");
        grd1.addColorStop(0, "black"); //red color gradient depending on height of bar
    }
    else if (colorStyle == 2) {
        grd1.addColorStop(1, "orange");
        grd1.addColorStop(0, "black"); //orange color gradient depending on height of bar
    }
    else if (colorStyle == 3) {
        grd1.addColorStop(1, "yellow");
        grd1.addColorStop(0, "black"); //yellow color gradient depending on height of bar
    }
    else if (colorStyle == 4) {
        grd1.addColorStop(1, "LightGreen");
        grd1.addColorStop(0, "black"); //green color gradient depending on height of bar
    }
    else if (colorStyle == 5) {
        grd1.addColorStop(1, "DodgerBlue");
        grd1.addColorStop(0, "black"); //blue color gradient depending on height of bar
    }
    else {
        grd1.addColorStop(1, "fuchsia");
        grd1.addColorStop(0, "black"); //purple color gradient depending on height of bar
    }

    contextC.fillStyle = grd1;
    contextC.fillRect(0, 0, windowWidth, windowHeight);
}

function draw() {
    if (!audio.paused) {
        bigBars = 0;
        r = 0;
        g = 0;
        b = 255;
        x = 0;
        context.clearRect(0, 0, WIDTH, HEIGHT);
        analyser.getByteFrequencyData(freqArr);
        for (var i = 0; i < INTERVAL; i++) {
            if (/*i <= 50 &&*/ barHeight >= (240 /* currVol*/)) {
                bigBars++;
            }
            //max = 900; //default placeholder
            var num = i;
            barHeight = ((freqArr[num] - 128) * 2) + 2;
            if (barHeight <= 1) {
                barHeight = 2;
            }

            r = r + 10; //this is for the color spectrum
            if (r > 255) {
                r = 255;
            }
            g = g + 1;
            if (g > 255) {
                g = 255;
            }
            b = b - 2;
            if (b < 0) {
                b = 0;
            }

            if (colorStyle == 0) {
                context.fillStyle = "rgb(" + r + "," + g + "," + b + ")"; //rgb color cycle 
            }
            else if (colorStyle == 1) {
                context.fillStyle = "rgb(" + ((2 / 3) * (barHeight)) + "," + (0 * (barHeight)) + "," + (0 * (barHeight)) + ")"; //red color gradient depending on height of bar
            }
            else if (colorStyle == 2) {
                context.fillStyle = "rgb(" + (1 * (barHeight)) + "," + (.6 * (barHeight)) + "," + (0 * (barHeight)) + ")"; //orange color gradient depending on height of bar
            }
            else if (colorStyle == 3) {
                context.fillStyle = "rgb(" + (.95 * (barHeight)) + "," + (.85 * (barHeight)) + "," + (0 * (barHeight)) + ")"; //yellow color gradient depending on height of bar
            }
            else if (colorStyle == 4) {
                context.fillStyle = "rgb(" + (0 * (barHeight)) + "," + ((2 / 3) * (barHeight)) + "," + (0 * (barHeight)) + ")"; //green color gradient depending on height of bar
            }
            else if (colorStyle == 5) {
                context.fillStyle = "rgb(" + (.58 * (barHeight / 10)) + "," + (0 * (barHeight)) + "," + (1 * (barHeight)) + ")"; //blue color gradient depending on height of bar
            }
            else {
                context.fillStyle = "rgb(" + (1 * (barHeight)) + "," + (0 * (barHeight)) + "," + (1 * (barHeight)) + ")"; //purple color gradient depending on height of bar
            }

            context.fillRect(x, HEIGHT - barHeight, (WIDTH / INTERVAL) - 1, barHeight);
            x = x + (WIDTH / INTERVAL);
        }
    }

    if (bigBars >= 1) {
        drawSides();
    }
    else {
        contextC.clearRect(0, 0, windowWidth, windowHeight);
    }
    window.requestAnimationFrame(draw);
}

function mouseOverUI() {
    clearTimeout(myTime);
    UI.style.opacity = 1;
}

function mouseOutUI() {
    clearTimeout(myTime);
    UI.style.opacity = 0;
}

