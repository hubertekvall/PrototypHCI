

let capture;
let palette;
let state = "PHOTO";


function getPalette(img) {
    img.loadPixels();
    let quantizeArray = [];
    let pixels = img.pixels;

    for (let i = 0; i < pixels.length; i += 4) {
        let color = [
            pixels[i],
            pixels[i+1],
            pixels[i+2]
        ];
        quantizeArray.push(color);
      
    }


    let maximumColorCount = 10;
    let colorMap = MMCQ.quantize(quantizeArray, maximumColorCount);
    palette = colorMap.palette();
    console.log(palette);
}


// function preload() {
//     img = loadImage('test.png');
// }
 
function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    background(0);



    capture = createCapture(VIDEO);
    capture.size(windowWidth, windowHeight);
    capture.hide();
}


function drawPalette(){
    noStroke();
    for(let i = 0; i < palette.length; i++){
        fill(palette[i][0], palette[i][1], palette[i][2]);
        rect(windowWidth/palette.length * i, 0, windowWidth/palette.length * i, windowHeight);
    }
}


function draw() {
    background(255);
    switch(state){
        case "PHOTO":
            image(capture, 0, 0, windowWidth, windowHeight );
        break;

        case "PALETTE":
            drawPalette();
        break;

    }
}


// function mousePressed() {
//     color = "BLUE";
// }

function touchEnded() {
    switch(state){
        case "PHOTO":
            getPalette(capture);
            state = "PALETTE"
        break;

        case "PALETTE":
            state = "PHOTO"
            break;
    }
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

