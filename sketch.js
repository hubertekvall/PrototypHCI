

let capture;
let palette;
let state = "PHOTO";
let photoButton;
let captureButton;
let playButton;


async function getPalette() {

    let tempImage = createImage(int(capture.width / 20), int(capture.height / 20));
    tempImage.copy(capture, 0, 0, capture.width, capture.height, 0, 0, tempImage.width, tempImage.height);
    tempImage.loadPixels();
    let quantizeArray = [];
    let cpixels = tempImage.pixels;


    for (let i = 0; i < cpixels.length; i += 4) {
        let color = [
            cpixels[i],
            cpixels[i + 1],
            cpixels[i + 2]
        ];
        quantizeArray.push(color);

    }


    let maximumColorCount = 7;
    let colorMap = MMCQ.quantize(quantizeArray, maximumColorCount);
    palette = colorMap.palette();

}


let hueAngle;
let saturationDistance;
let tintColor;
function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    background(0);
    tintColor  = color(255);



    photoButton = select("#photoButton");
    captureButton = select("#captureButton");
    
    toggleMode("PHOTO");
    captureBuffer = createGraphics(windowWidth, windowHeight);
    captureMask = createGraphics(capture.width - 50, capture - height - 50);

}


function removeCapture() {
    if (capture !== undefined) capture.remove();
}

function createVideoCapture() {

    removeCapture();

    let constraints = {
        video: {

            minWidth: 1280,
            minHeight: 720,
            maxWidth: width,
            maxHeight: height
            ,
            optional: [{ maxFrameRate: 10 }]
        }
    };
    capture = createCapture(constraints, function (stream) {
        console.log(stream);
    });
    capture.hide();
}





let playGridData = [];
let backgroundGridFill;
const columnCount = 8;
const rowCount = 8;

function getRandomPaletteColor(){
    let randColorIDX = int(Math.random() * 7);

    return color(palette[randColorIDX][0], palette[randColorIDX][1], palette[randColorIDX][2])
}


function generatePlayData() {
    playGridData = [];


    backgroundGridFill = getRandomPaletteColor();

    let rowsAvailable = rowCount;
    let y = 0;
    while (rowsAvailable > 0) {
        let rowLength = int(Math.random() * 2) + 1;
        if (rowLength > rowsAvailable) rowLength = rowsAvailable;
        rowsAvailable -= rowLength;


        let columnsAvailable = columnCount;
        let x = 0;
        while (columnsAvailable > 0) {

            let columnLength = int(Math.random() * 2) + 1;
            if (rowLength > rowsAvailable) columnLength = columnsAvailable;
            columnsAvailable -= columnLength;




            playGridData.push({

                rowLength: rowLength,
                columnLength: columnLength,
                x: x,
                y: y,
                color: getRandomPaletteColor(),
                completion: 0,
                direction: int(Math.random() * 2)
            });

            x += columnLength;
        }

        y += rowLength;

    }


    // }



}

function drawPlay() {

    let rowsHeight = height / rowCount;
    let columnWidth = width / columnCount;
    background(backgroundGridFill);
    playGridData.forEach(element => {
        fill(element.color);

        let elWidth = element.columnLength * columnWidth;
        let elHeight = element.rowLength * rowsHeight;

        element.completion = lerp(element.completion, 1, 0.05);
        if(element.direction == 0){
            rect(element.x * columnWidth, element.y * rowsHeight, elWidth , elHeight * element.completion);
        }
        else{
            rect(element.x * columnWidth, element.y * rowsHeight, elWidth * element.completion, elHeight);
        }
       
    });
}





let dMoveX;
let dMoveY;


// function mutateColors(){
//     if(palette === undefined) return;
//     palette.forEach(element => {
//         let c = color(element[0], element[1], element[2]);

//         console.log(red(c));

//         let h = hue(c);
//         let s = saturation(c);
//         let b = brightness(c);

//         colorMode(HSB);
//         if(dMoveX > 0) console.log("YEAAAHAA");
//         else if(dMoveX < 0) console.log("buuuhuuu");

//         h %= 360;
//         let nc = color(h, s, b);
//         colorMode(RGB);

//         // let interp = lerpColor(c, nc, dist(red(c), green(c), blue(c), red(nc), green(nc), blue(nc) ));
//         element[0] = red(nc);
//         element[1] = green(nc);
//         element[2] = blue(nc);
//     });
// }



function touchMoved() {
    dMoveX = (mouseX - pmouseX) / width;
    dMoveY = (pmouseY - mouseY) / height;

    colorMode(HSB);
    let angle = degrees(atan2(mouseY - width/ 2, mouseX - height/2));

    let v1 = createVector(mouseX, mouseY);
    let v2 = createVector(width/2, height/2);
    let cdist = v1.sub(v2).normalize().magSq();
    let newColor = color(angle, cdist * 100, 100);
    tintColor = lerpColor(tintColor, newColor, 0.05);
    colorMode(RGB);
    // mutateColors();
}

function touchEnded(){
    if(state === "PALETTE"){
        generatePlayData();
    }
}


let isShaking = false;



function deviceShaken() {

   if(state === "PLAY") generatePlayData();
}


function draw() {
    background(255);
    fill(255);

    switch (state) {
        case "PHOTO":
            image(capture, 0, 0, width, width * capture.height / capture.width);
            break;

        case "PLAY":
            drawPlay();
            blendMode(EXCLUSION);
            fill(tintColor);
            rect(0,0, width, height);
            blendMode(BLEND);
            break;
    }




    fill('red');
    textAlign(CENTER, CENTER);
    textSize(50);

}








function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}




function toggleMode(mode) {
    removeCapture();

    switch (mode) {

        case "PHOTO":
            photoButton.hide();
            captureButton.show();
            createVideoCapture();
            break;

        case "PLAY":
            captureButton.hide();
            photoButton.show();
            getPalette();
            tintColor = color(255, 255, 255,255);
            generatePlayData();
            break;

    }

    state = mode;
}