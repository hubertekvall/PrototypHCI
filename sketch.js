

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


    let maximumColorCount = 5;
    let colorMap = MMCQ.quantize(quantizeArray, maximumColorCount);
    palette = colorMap.palette();

}



function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    background(0);



    photoButton = select("#photoButton");
    captureButton = select("#captureButton");
    // playButton = select("#playMode");

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



function drawPalette() {

    for (let i = 0; i < palette.length; i++) {
        fill(palette[i][0], palette[i][1], palette[i][2]);
        rect(width / palette.length * i, 0, width / palette.length, height);
    }
}


let playGridData = [];

function generatePlayData() {
    for (let x = 0; x < width / 32; x++) {

        for (let y = 0; y < height / 32; y++) {
            let idx = int(Math.random() * 5);
            playData.push({
                color: palette[idx],
                x: x,
                y: y

            });

            console.log(palette[idx]);
        }

    }
}

function drawPlay() {
    background(0);

    playData.forEach(element => {
        fill(element.color[0], element.color[1], element.color[2]);
        rect(element.x * 32, element.y * 32, 32, 32);
    });
}





let dMoveX;
let dMoveY;


function mutateColors(){
    if(palette === undefined) return;
    palette.forEach(element => {
        let c = color(element[0], element[1], element[2]);
        
        console.log(red(c));

        let h = hue(c);
        let s = saturation(c);
        let b = brightness(c);

        colorMode(HSB);
        if(dMoveX > 0) console.log("YEAAAHAA");
        else if(dMoveX < 0) console.log("buuuhuuu");

        h %= 360;
        let nc = color(h, s, b);
        colorMode(RGB);

        // let interp = lerpColor(c, nc, dist(red(c), green(c), blue(c), red(nc), green(nc), blue(nc) ));
        element[0] = red(nc);
        element[1] = green(nc);
        element[2] = blue(nc);
    });
}


function touchMoved(){
    dMoveX = (mouseX - pmouseX) / width;
    dMoveY = (pmouseY - mouseY) / height; 
   
    mutateColors();
}


let isShaking = false;



function deviceShaken(){
    isShaking = true;
}


function draw() {
    background(255);
    fill(255);

    switch (state) {
        case "PHOTO":
            image(capture, 0, 0, width , width * capture.height / capture.width );
            break;

        case "PALETTE":
            drawPalette();
            break;

        case "PLAY":
            recordShaking();
            drawPlay();
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

        case "PALETTE":
            captureButton.hide();
            photoButton.show();
            getPalette();
            break;

        // case "PLAY":
        //     generatePlayData();
        //     playButton.hide();
        //     photoButton.show();
        //     captureButton.show();
        //     break;
    }

    state = mode;
}