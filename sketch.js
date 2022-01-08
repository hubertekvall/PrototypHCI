

let capture;
let palette;
let state = "PHOTO";
let photoButton;
let paletteButton;
let playButton;


async function getPalette() {

    let tempImage = createImage(int(capture.width/20), int(capture.height/20));
    tempImage.copy(capture, 0, 0, capture.width, capture.height, 0, 0, tempImage.width, tempImage.height);
    tempImage.loadPixels();
    let quantizeArray = [];
    let cpixels = tempImage.pixels;


    for (let i = 0; i < cpixels.length; i += 4) {
        let color = [
            cpixels[i],
            cpixels[i+1],
            cpixels[i+2]
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

    photoButton =  select("#photoMode");
    paletteButton =  select("#paletteMode");
    playButton = select("#playMode");

    toggleMode("PHOTO");
}


function removeCapture(){
    if(capture !== undefined) capture.remove();
}

function createVideoCapture(){
 
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
      capture = createCapture(constraints, function(stream) {
        console.log(stream);
      });
      capture.hide();
}



function drawPalette(){
   
    for(let i = 0; i < palette.length; i++){
        fill(palette[i][0], palette[i][1], palette[i][2]);
        rect(width/palette.length * i, 0, width/palette.length, height);
    }
}


let playData = [];


function generatePlayData(){
    for(let x = 0; x < width / 32; x++){
      
        for(let y = 0; y < height / 32; y++){
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

function drawPlay(){
    background(0);
    
    playData.forEach(element => {
        fill(element.color[0], element.color[1], element.color[2]);
        rect(element.x * 32, element.y * 32, 32, 32);
    });
}




function draw() {
    background(255);
    
    switch(state){
            case "PHOTO":
                image(capture, 0, 0, width, width * capture.height / capture.width);
            break;
            case "PALETTE":
                drawPalette();
            break;

            case "PLAY":
                drawPlay();
            break;
    }


    fill('red');
    textAlign(CENTER,CENTER);
    textSize(50);
    // Convert the acceleration into integer when
    // Device is moved along y-axis.
    // text(int(pAccelerationY),windowWidth/2,windowHeight/2);
    // text(int(pAccelerationX),windowWidth/2,windowHeight/2 + 50);
    // text(int(pAccelerationZ),windowWidth/2,windowHeight/2 + 100);
}






function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}




function toggleMode(mode){
    removeCapture();

    switch(mode){

        case "PHOTO":
            photoButton.hide();
            playButton.hide();
            paletteButton.show();
            createVideoCapture();
            break;

        case "PALETTE":
            paletteButton.hide();
            playButton.show();
            photoButton.show();
            getPalette();
        break;

        case "PLAY":
            generatePlayData();
            playButton.hide();
            photoButton.show();
            paletteButton.show();
        break;
    }

    state = mode;
}