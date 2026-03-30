let flowerImages = [];
let circleImage, bgImage, logoImage;
let gajra = [];
let radius = 100;
let maxFlowers = 15;
let clearBtn, sendBtn, homeBtn, startBtn, venmoBtn; 
let plopSound, typeSound, dingSound; 
let appState = 0; 
let messageInput;
let fadeAlpha = 255; 

function preload() {
  flowerImages[0] = loadImage('flower0.PNG');
  flowerImages[1] = loadImage('flower1.PNG');
  flowerImages[2] = loadImage('flower2.PNG');
  flowerImages[3] = loadImage('flower3.PNG'); 
  circleImage = loadImage('circle.PNG');
  bgImage = loadImage('bg_image.png');
  logoImage = loadImage('logo.PNG'); 
  soundFormats('mp3', 'ogg');
  plopSound = loadSound('plop.mp3'); 
  typeSound = loadSound('typewriter.mp3');
  dingSound = loadSound('ding.mp3');
}

function setup() {
  createCanvas(600, 600);
  imageMode(CENTER);
  angleMode(DEGREES);

  typeSound.setVolume(0.1); 
  dingSound.setVolume(0.3); 
  plopSound.setVolume(0.5);

  // Start Button
  startBtn = createButton('Weave a Gajra for Someone You Love');
  startBtn.position(width / 2 - 150, height / 2 + 120);
  startBtn.size(300, 50);
  startBtn.mousePressed(() => {
    appState = 1;
    startBtn.hide();
    if (plopSound.isLoaded()) plopSound.play();
  });
  styleButton(startBtn);

  // Clear Button
  clearBtn = createButton('Start Over');
  clearBtn.position(20, 20);
  clearBtn.mousePressed(() => {
    gajra = [];
    messageInput.value('');
    messageInput.hide();
    sendBtn.hide();
  });
  styleButton(clearBtn);
  clearBtn.hide();

  // Message Input
  messageInput = createInput('');
  messageInput.attribute('maxlength', '400');
  messageInput.attribute('placeholder', 'Type your love note here...');
  messageInput.position(width / 2 - 200, height - 140);
  messageInput.size(400, 40);
  messageInput.input(() => { if (typeSound.isLoaded()) typeSound.play(); });
  messageInput.hide();

  // Finalize Button
  sendBtn = createButton('Gift this Gajra');
  sendBtn.position(width / 2 - 75, height - 80);
  sendBtn.size(150, 40);
  sendBtn.mousePressed(finalizeAndShare);
  styleButton(sendBtn);
  sendBtn.hide();

  // Home Button (Credits Page)
  homeBtn = createButton('Create Another Gajra');
  homeBtn.position(width / 2 - 100, height / 2 + 60);
  homeBtn.size(200, 40);
  homeBtn.mousePressed(() => {
    gajra = [];
    appState = 0;
    fadeAlpha = 255; 
    homeBtn.hide();
    venmoBtn.hide();
    startBtn.show();
  });
  styleButton(homeBtn);
  homeBtn.hide();

  // Support Button (No "Venmo" in text)
  venmoBtn = createButton('Support the Artist');
  venmoBtn.position(width / 2 - 80, height / 2 + 180);
  venmoBtn.size(160, 30);
  venmoBtn.mousePressed(() => {
    window.open('https://venmo.com/u/ayeshakhalid3989', '_blank'); // Update with your link
  });
  styleButton(venmoBtn);
  venmoBtn.style('font-size', '10px'); 
  venmoBtn.style('opacity', '0.6');    
  venmoBtn.hide();
}

function draw() {
  push();
  imageMode(CORNER);
  image(bgImage, 0, 0, width, height);
  pop();

  if (appState === 0) {
    drawLandingPage();
  } else if (appState === 1) {
    drawGajraPage(false); // Normal mode
    if (fadeAlpha > 0) {
      fill(20, 20, 20, fadeAlpha); 
      rect(0, 0, width, height);
      fadeAlpha -= 10;
    }
  } else if (appState === 2) {
    drawCreditsPage();
  }
}

function drawLandingPage() {
  image(logoImage, width / 2, height / 2 - 160, 200, 200);
  fill(255);
  textAlign(CENTER);
  textFont('Courier New');
  textSize(14);
  let introText = "In the quiet corners of the heart, we weave memories into form. Use this space to create a digital garland A GAJRA as a token of affection for someone dear.";
  text(introText, 50, height / 2 - 20, 500); 
}

function drawGajraPage(isFinal) {
  if (!isFinal) clearBtn.show();
  
  textAlign(CENTER);
  textFont('Courier New');
  textSize(13);
  
  // Quote
  fill(255);
  let mainText = "A gajra reminds us that love does not need grand gestures, sometimes it is just a handful of flowers, carefully woven together, offered with a quiet smile.";
  text(mainText, 40, 80, 520); 
  
  // ONLY show instruction if NOT final
  if (isFinal === false) {
    fill(255, 255, 0); 
    text("Tap the circle to bind your flowers to the thread.", 40, 140, 520);
  }

  image(circleImage, width / 2, height / 2, 250, 250);

  for (let f of gajra) {
    push();
    let xWiggle = map(noise(f.x, frameCount * 0.02), 0, 1, -2, 2);
    let yWiggle = map(noise(f.y, frameCount * 0.02), 0, 1, -2, 2);
    translate(f.x + xWiggle, f.y + yWiggle);
    rotate(f.rotation + (xWiggle * 2));
    image(flowerImages[f.type], 0, 0, f.size, f.size);
    pop();
  }

  if (gajra.length >= maxFlowers && !isFinal) {
    messageInput.show();
    sendBtn.show();
  } else if (!isFinal) {
    fill(255, 180);
    textSize(12);
    textAlign(CENTER);
    text(`Progress: ${gajra.length} / ${maxFlowers}`, width / 2, height - 30);
  }
}

function drawCreditsPage() {
  clearBtn.hide();
  messageInput.hide();
  sendBtn.hide();
  homeBtn.show();
  venmoBtn.show();

  fill(255);
  textAlign(CENTER);
  textFont('Courier New');
  
  textSize(28);
  text("THANK YOU", width / 2, height / 2 - 100);
  
  textSize(14);
  text("Your shared gajra has opened in a new tab.", width / 2, height / 2 - 60);
  
  textSize(12);
  let supportMsg = "If this gajra carried a bit of fragrance into your day, consider leaving a small token of support. But literally no pressure, go and enjoy.";
  text(supportMsg, width / 2 - 150, height / 2 - 20, 300);

  textSize(11);
  fill(150);
  text("Developed by Ayesha.K", width / 2, height / 2 + 140);
}

function finalizeAndShare() {
  if (dingSound.isLoaded()) dingSound.play();
  
  // FORCE A CLEAN DRAW
  push();
  imageMode(CORNER);
  image(bgImage, 0, 0, width, height);
  pop();
  
  drawGajraPage(true); // Pass 'true' to hide yellow text
  
  fill(255);
  textSize(16);
  textAlign(CENTER, TOP);
  textFont('Courier New');
  textWrap(WORD);
  text(messageInput.value(), 100, height/2 + 160, 400); 
  
  // Capture the clean canvas
  let dataURL = canvas.toDataURL('image/png');
  let newTab = window.open();
  newTab.document.write('<title>A Gift for You</title>');
  newTab.document.write('<body style="margin:0; background:#111; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh;">');
  newTab.document.write('<img src="' + dataURL + '" style="width:90%; max-width:600px; border:12px solid #fff; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">');
  newTab.document.write('<p style="font-family:Courier New, monospace; color:#fff; margin-top:20px; font-size:16px;">Hold image to save your gajra card.</p>');
  newTab.document.write('</body>');
  
  appState = 2;
}

function mousePressed() {
  if (appState === 1) {
    if (mouseY > height - 150 || (mouseX < 120 && mouseY < 80)) return; 
    if (gajra.length >= maxFlowers) return;
    let angle = atan2(mouseY - height / 2, mouseX - width / 2);
    let snapX = width / 2 + radius * cos(angle);
    let snapY = height / 2 + radius * sin(angle);
    let selectedType = (gajra.length === maxFlowers - 1) ? 3 : floor(random(3));
    gajra.push({ x: snapX, y: snapY, type: selectedType, size: random(85, 110), rotation: random(360) });
    if (plopSound.isLoaded()) plopSound.play();
  }
}

function styleButton(btn) {
  btn.style('padding', '10px');
  btn.style('background-color', 'rgba(255, 255, 255, 0.05)'); 
  btn.style('color', '#fff');
  btn.style('border', '1px solid #fff');
  btn.style('border-radius', '0px'); 
  btn.style('cursor', 'pointer');
  btn.style('font-family', 'Courier New');
  btn.style('font-size', '13px');
  btn.style('text-align', 'center');
}