

let color = "RED";
let capture;

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    background(0);

    capture = createCapture(VIDEO);
    capture.size(windowWidth, windowHeight);
   
}

function draw() {
    background(255);
    image(capture, 0,0, windowWidth, windowHeight);

}

// function mousePressed() {
//     color = "BLUE";
// }

// function mouseReleased() {
//     color = "RED";
// }



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

