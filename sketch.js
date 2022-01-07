

let capture;
let palette;
let state = "PHOTO";


async function getPalette() {

    capture.loadPixels();
    let quantizeArray = [];
    let cpixels = capture.pixels;

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
    console.log(palette);
}


 
function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    background(0);
    createVideoCapture();
    capture.hide();
    // getPalette();
   
}

function createVideoCapture(){
    let constraints = {
        video: {
          mandatory: {
            minWidth: 1280,
            minHeight: 720
          },
          optional: [{ maxFrameRate: 10 }]
        }
      };
      capture = createCapture(constraints, function(stream) {
        console.log(stream);
      });
    
}



function drawPalette(){
    noStroke();
    for(let i = 0; i < palette.length; i++){
        fill(palette[i][0], palette[i][1], palette[i][2]);
        rect(width/palette.length * i, 0, width/palette.length, height);
    }
}


function draw() {
    background(255);
    // image(capture, 0,0, capture.width / 2, capture.height/2);
    
    if(palette !== undefined) drawPalette();


    fill('red');
    textAlign(CENTER,CENTER);
    textSize(50);
    // Convert the acceleration into integer when
    // Device is moved along y-axis.
    text(int(pAccelerationY),windowWidth/2,windowHeight/2);
    text(int(pAccelerationX),windowWidth/2,windowHeight/2 + 50);
    text(int(pAccelerationZ),windowWidth/2,windowHeight/2 + 100);
}



function touchEnded() {
    getPalette();
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

