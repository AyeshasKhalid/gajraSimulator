let flowerImages = [];
let circleImage, bgImage, logoImage;
let gajra = [];
const radius = 100; // Locked at 100 as requested
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
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  angleMode(DEGREES);

  typeSound.setVolume(0.1); 
  dingSound.setVolume(0.3); 
  plopSound.setVolume(0.5);

  initializeUI();
}

function initializeUI() {
  // Start Button
  if (!startBtn) startBtn = createButton('Weave a Gajra for Someone You Love');
  startBtn.position(width / 2 - 150, height / 2 + 120);
  startBtn.size(300, 50);
  startBtn.mousePressed(() => {
    appState = 1;
    startBtn.hide();
    if (plopSound.isLoaded()) plopSound.play();
  });
  styleButton(startBtn);

  // Clear Button
  if (!clearBtn) clearBtn = createButton('Start Over');
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
  if (!messageInput) messageInput = createInput('');
  messageInput.attribute('maxlength', '400');
  messageInput.attribute('placeholder', 'Type your love note here...');
  messageInput.position(width / 2 - 175, height - 160);
  messageInput.size(350, 40);
  messageInput.input(() => { if (typeSound.isLoaded()) typeSound.play(); });
  messageInput.hide();

  // Finalize Button
  if (!sendBtn) sendBtn = createButton('Gift this Gajra');
  sendBtn.position(width / 2 - 75, height - 100);
  sendBtn.size(150, 40);
  sendBtn.mousePressed(finalizeAndShare);
  styleButton(sendBtn);
  sendBtn.hide();

  // Home Button
  if (!homeBtn) homeBtn = createButton('Create Another Gajra');
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

  // Support Button
  if (!venmoBtn) venmoBtn = createButton('Support the Artist');
  venmoBtn.position(width / 2 - 80, height / 2 + 180);
  venmoBtn.size(160, 30);
  venmoBtn.mousePressed(() => {
    window.open('https://venmo.com/u/ayeshakhalid3989', '_blank');
  });
  styleButton(venmoBtn);
  venmoBtn.style('font-size', '10px'); 
  venmoBtn.style('opacity', '0.6');    
  venmoBtn.hide();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializeUI(); 
}

function draw() {
  push();
  imageMode(CORNER);
  image(bgImage, 0, 0, width, height);
  pop();

  if (appState === 0) {
    drawLandingPage();
  } else if (appState === 1) {
    drawGajraPage(false);
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
  textSize(16);
  let introText = "In the quiet corners of the heart, we weave memories into form. Use this space to create a digital garland A GAJRA as a token of affection for someone dear.";
  text(introText, width/2 - 250, height / 2 - 20, 500); 
}

function drawGajraPage(isFinal) {
  if (!isFinal) clearBtn.show();
  textAlign(CENTER);
  textFont('Courier New');
  textSize(14);
  fill(255);
  let mainText = "A gajra reminds us that love does not need grand gestures...";
  text(mainText, width/2 - 260, 60, 520); 
  
  if (isFinal === false) {
    fill(255, 255, 0); 
    text("Tap the circle to bind your flowers to the thread.", width/2 - 260, 120, 520);
  }
  
  // Circle image is now fixed at 250px wide (matching the 100 radius + padding)
  image(circleImage, width / 2, height / 2, 250, 250);

  for (let f of gajra) {
    push();
    let xWiggle = map(noise(f.x, frameCount * 0.02), 0, 1, -2, 2);
    let yWiggle = map(noise(f.y, frameCount * 0.02), 0, 1, -2, 2);
    translate(f.x + xWiggle, f.y + yWiggle);
    rotate(f.rotation + (xWiggle * 2));
    image(flowerImages[f.type], 0, 0, 100, 100); // Flowers also fixed at 100px
    pop();
  }

  if (gajra.length >= maxFlowers && !isFinal) {
    messageInput.show();
    sendBtn.show();
  } else if (!isFinal) {
    fill(255, 180);
    textSize(12);
    text(`Progress: ${gajra.length} / ${maxFlowers}`, width / 2, height - 40);
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
  text("If this gajra carried a bit of fragrance into your day...", width / 2 - 150, height / 2 - 20, 300);
  textSize(11);
  fill(150);
  text("Developed by Ayesha.K", width / 2, height / 2 + 140);
}

function finalizeAndShare() {
  if (dingSound.isLoaded()) dingSound.play();
  push();
  imageMode(CORNER);
  image(bgImage, 0, 0, width, height);
  pop();
  drawGajraPage(true); 
  
  fill(255);
  textSize(18);
  textAlign(CENTER, TOP);
  textFont('Courier New');
  textWrap(WORD);
  text(messageInput.value(), width/2 - 200, height/2 + radius + 40, 400); 
  
  let dataURL = canvas.toDataURL('image/png');
  let currentURL = window.location.href;
  
  let newTab = window.open();
  newTab.document.write(`
    <title>A Gift for You</title>
    <style>
      body { margin:0; background:#111; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; overflow-x:hidden; padding: 20px; }
      img { width:95%; max-width:600px; border:8px solid #fff; box-shadow: 0 10px 40px rgba(0,0,0,0.8); }
      .instructions { font-family: 'Courier New', Courier, monospace; color:#fff; margin:20px 0; font-size:14px; text-align:center; }
      .btn-container { display: flex; gap: 15px; flex-wrap: wrap; justify-content: center; }
      .action-btn { padding: 12px 20px; background: rgba(255,255,255,0.05); color:white; border:1px solid white; font-family: 'Courier New'; cursor:pointer; text-transform:uppercase; }
      .action-btn.black { background: white; color: black; font-weight: bold; }
    </style>
    <body>
      <img src="${dataURL}">
      <p class="instructions">Hold image to save your gajra card.</p>
      <div class="btn-container">
        <button class="action-btn black" onclick="navigator.clipboard.writeText('${currentURL}').then(()=>alert('Copied!'))">Copy Link</button>
        <button class="action-btn" onclick="navigator.share({title:'Gajra', url:'${currentURL}'})">Share</button>
      </div>
    </body>
  `);
  appState = 2;
}

function mousePressed() {
  if (appState === 1) {
    // Check if the click is within a reasonable "binding zone" of the center circle
    let d = dist(mouseX, mouseY, width / 2, height / 2);
    
    // Only allow snapping if the click is roughly near the thread (between 60 and 140 pixels out)
    if (d > 50 && d < 150) {
      if (gajra.length >= maxFlowers) return;
      
      let angle = atan2(mouseY - height / 2, mouseX - width / 2);
      let snapX = width / 2 + radius * cos(angle);
      let snapY = height / 2 + radius * sin(angle);
      let selectedType = (gajra.length === maxFlowers - 1) ? 3 : floor(random(3));
      
      gajra.push({ x: snapX, y: snapY, type: selectedType, rotation: random(360) });
      if (plopSound.isLoaded()) plopSound.play();
    }
  }
}

function styleButton(btn) {
  btn.style('padding', '10px');
  btn.style('background-color', 'rgba(255, 255, 255, 0.05)'); 
  btn.style('color', '#fff');
  btn.style('border', '1px solid #fff');
  btn.style('font-family', 'Courier New');
  btn.style('cursor', 'pointer');
}
