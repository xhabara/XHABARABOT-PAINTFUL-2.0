let mySound1, mySound2, mySound3, mySound4;
let playing = false;
let spaceBarWasPressed = false;
let shapeGenerationPaused = true;
let lines = [];
let thicknessSlider;
let lineColor;
let eraserButton;
let autonomousMode = false;
let lastPoint = null;
let currentLineIdx = 0;
let currentPosition = null;
let targetPosition = null;
let tracingSpeed = 0.1;
let currentPointIdx = 0;
let showImage = true;
let img;
let isMousePressed = false;
let soundsFrozen = false; 
let time1, time2, time3, time4;



function redrawLines() {
  for (let lineObj of lines) {
    stroke(lineObj.color);
    strokeWeight(lineObj.thickness);
    for (let i = 0; i < lineObj.points.length - 1; i++) {
      let start = lineObj.points[i];
      let end = lineObj.points[i + 1];
      line(start.x, start.y, end.x, end.y);
    }
  }
}

function handleFile(file) {
  if (file.type === "image") {
    img = loadImage(file.data, () => {
      background(400);
      fitImageToCanvas(img);
      redrawLines();
    });
  } else {
    console.log("Not an image file!");
  }
}

function fitImageToCanvas(img) {
  let aspectRatio = img.width / img.height;
  let canvasAspectRatio = width / height;

  let newWidth, newHeight;
  if (canvasAspectRatio > aspectRatio) {
    newWidth = width;
    newHeight = width / aspectRatio;
  } else {
    newWidth = height * aspectRatio;
    newHeight = height;
  }

  let x = (width - newWidth) / 2;
  let y = (height - newHeight) / 2;
  image(img, x, y, newWidth, newHeight);
}
function preload() {
  mySound1 = loadSound("RullyShabaraSampleT05.mp3");
  mySound2 = loadSound("RullyShabaraSampleR02.wav");
  mySound3 = loadSound("RullyShabaraSampleL03.mp3");
  mySound4 = loadSound("txtr.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  lineColor = color(55, 55, 55);

  let colorPicker = createInput();
  colorPicker.attribute("type", "color");
  colorPicker.position(10, 10);
  colorPicker.input(function () {
    lineColor = color(colorPicker.value());
  });

  eraserButton = createButton("Eraser");
  eraserButton.position(70, 12);
  eraserButton.mousePressed(function () {
    lineColor = color(400);
  });

  mySound1.setVolume(0);
  mySound2.setVolume(0);
  mySound3.setVolume(0);
  mySound4.setVolume(0);

  thicknessSlider = createSlider(1, 20, 5, 1);
  thicknessSlider.position(130, 15);

  strokeWeight(thicknessSlider.value());


  eraserButton.style("background-color", "#F9FCFC");
  eraserButton.style("border", "1px solid #980606");
  eraserButton.style("color", "#333333");
  eraserButton.style("padding", "4px 9px");
  eraserButton.style("font-size", "14px");
  eraserButton.style("border-radius", "15px");
  eraserButton.style("cursor", "pointer");
  eraserButton.position(70, 11);

 
  thicknessSlider.style("width", "150px");
  thicknessSlider.style("height", "8px");
  thicknessSlider.style("background-color", "#7F0B0B");
  thicknessSlider.style("border-radius", "4px");
  thicknessSlider.style("outline", "none");
  thicknessSlider.style("cursor", "pointer");
  thicknessSlider.position(140, 15);
  
 

  let autonomousButton = createButton("XHABARABOT TAKEOVER");
  autonomousButton.position(310, 12);
  autonomousButton.mousePressed(() => {
    autonomousMode = !autonomousMode;
    currentLineIdx = 0; // Reset the line index
    currentPointIdx = 0; // Reset the point index
    autonomousButton.html(
      autonomousMode ? "STOP XHABARABOT MODE" : "XHABARABOT TAKEOVER"
    );
  });

  let imageToggleButton = createButton("Hide Image");
  imageToggleButton.position(510, 12);
  imageToggleButton.mousePressed(() => {
    showImage = !showImage;
    imageToggleButton.html(showImage ? "Hide Image" : "Show Image");
  });

  let uploadButton = createFileInput(handleFile);
  uploadButton.position(600, 12);
  uploadButton.attribute("accept", "image/*");
}

function stopSounds() {
  playing = false;
  mySound1.stop();
  mySound2.stop();
  mySound3.stop();
  mySound4.stop();
}

function startSounds() {
  playing = true;
  mySound1.loop();
  mySound2.loop();
  mySound3.loop();
  mySound4.loop();
}

function keyPressed() {
  if (keyCode === 32) { // space bar
    spaceBarWasPressed = true;
    shapeGenerationPaused = !shapeGenerationPaused;
    if (spaceBarWasPressed) {
      if (!playing) {
        startSounds();
      }
    }
  } else if (keyCode === LEFT_ARROW) { // left arrow key
    lines = [];
    background(400); // Clear the canvas
  } else if (keyCode === 83) { // 'S' key
    saveCanvas("myDrawing", "png");
  } else if (keyCode === UP_ARROW) {
    soundsFrozen = !soundsFrozen; 
    if (soundsFrozen) {
     
      time1 = mySound1.currentTime();
      time2 = mySound2.currentTime();
      time3 = mySound3.currentTime();
      time4 = mySound4.currentTime();
    }
  }
    
  
}


function mouseDragged() {
  if (!shapeGenerationPaused && !autonomousMode) {
    let newLine = drawLine(pmouseX, pmouseY, mouseX, mouseY);
    lines.push(newLine);
  }
}

function drawLine(x1, y1, x2, y2) {
  let distance = dist(x1, y1, x2, y2);
  let thickness = thicknessSlider.value();
  strokeWeight(thickness);
  stroke(lineColor);
  let points = [];

  for (let i = 0; i <= distance; i++) {
    let t = i / distance;
    let x = lerp(x1, x2, t);
    let y = lerp(y1, y2, t);
    points.push(createVector(x, y));
    if (i > 0) {
      line(points[i - 1].x, points[i - 1].y, x, y);
    }
  }

  let lineObj = { points, thickness, color: lineColor };
  lines.push(lineObj); // Store the line in the lines array
  return lineObj;
}

function draw() {
  if (!showImage) {
    background(400); // Clear the background only when the image is hidden
  } else if (img && showImage) {
    image(img, 0, 0, width, height); // Show the image if it's available
  }

  redrawLines();

  if (soundsFrozen) {
    
    mySound1.jump(time1);
    mySound2.jump(time2);
    mySound3.jump(time3);
    mySound4.jump(time4);
    return; 
  }

  let drawingSpeed = 0;
  let x, y;

  if (autonomousMode) {
    x = noise(frameCount * 0.01) * width;
    y = noise(frameCount * 0.05 + 100) * height;
    if (lastPoint) {
      let newLine = drawLine(lastPoint.x, lastPoint.y, x, y);
      lines.push(newLine);
      drawingSpeed = dist(x, y, lastPoint.x, lastPoint.y);
    }
    lastPoint = { x, y };
  } else {
    lastPoint = null;
  }

  // Set the volume based on drawing speed
  let volume = map(drawingSpeed, 0, 100, 1, 12);
  mySound1.setVolume(0.01);
  mySound2.setVolume(2);
  mySound3.setVolume(1);
  mySound4.setVolume(0.2);

  // Sound parameters based on mouse position and movement
  let mouseDist = dist(pmouseX, pmouseY, mouseX, mouseY);
  let mouseSpeed = dist(mouseX, mouseY, pmouseX, pmouseY);
  mySound1.rate(map(mouseDist, 0, width + height, 0.1, 1) + noise(frameCount * 0.01) * 1 + random(0.5, 1));
  mySound2.rate(map(mouseDist, 0, width + height, 0.1, 1) + noise(frameCount * 0.05) * 1 + random(0.2, 1.2));
  mySound3.rate(map(mouseSpeed, 0, 100, 0.1, 1) + noise(frameCount * 0.1) * 0.5 + random(0.2, 1));
  mySound4.rate(map(mouseSpeed, 0, 100, 0.1, 2) + noise(frameCount * 0.2) * 2 + random(0.5, 1.5));

  let rateMod = map(drawingSpeed, 0, 1, 0.2, 1);
  mySound1.rate(mySound1.rate() + rateMod * noise(frameCount * 0.01) * random(0.5, 1));
  mySound2.rate(mySound2.rate() + rateMod * noise(frameCount * 0.05) * random(0.5, 2));
  mySound3.rate(mySound3.rate() + rateMod * noise(frameCount * 0.01) * random(0.5, 1));
  mySound4.rate(mySound4.rate() + rateMod * noise(frameCount * 0.02) * random(0.5, 2));

  if (autonomousMode) {
    if (currentLineIdx < lines.length) {
      let lineToTrace = lines[currentLineIdx];
      let points = lineToTrace.points;

      if (currentPointIdx < points.length) {
        stroke(lineToTrace.color);
        strokeWeight(lineToTrace.thickness);
        let p = points[currentPointIdx];
        point(p.x, p.y);
        currentPointIdx++;
      } else {
        currentLineIdx++;
        currentPointIdx = 0;
      }
    }
  }
}


 function drawAutonomousLines() {
  if (currentLineIdx < lines.length) {
    let lineToTrace = lines[currentLineIdx];
    let points = lineToTrace.points;

    if (currentPointIdx < points.length) {
      let p = points[currentPointIdx];
      let nextP = points[currentPointIdx + 1]; // Look ahead, my dear bot

      if (nextP) {
        stroke(lineToTrace.color);
        strokeWeight(lineToTrace.thickness);
        line(p.x, p.y, nextP.x, nextP.y);
      }
tracingSpeed = speedSlider.value();
      currentPointIdx++;
    } else {
      currentLineIdx++;
      currentPointIdx = 0;
    }
  }
}

  function mousePressed() {
    isMousePressed = true;
    if (!shapeGenerationPaused) {
      mySound4.setVolume(25);
      mySound1.setVolume(25);
      let newLine = drawLine(pmouseX, pmouseY, mouseX, mouseY);
      lines.push(newLine);
    }
  }

  function mouseReleased() {
    isMousePressed = false;
    if (!shapeGenerationPaused) {
      mySound4.setVolume(0.9);
      mySound1.setVolume(0.001);
      let newLine = drawLine(pmouseX, pmouseY, mouseX, mouseY);
      lines.push(newLine);
    }
  }

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(400);
    if (img && showImage) {
      image(img, 0, 0, width, height);
    }
    redrawLines();
  }

