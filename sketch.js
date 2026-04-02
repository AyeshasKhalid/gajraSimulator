let flowerImages = [];
let circleImage, bgImage, logoImage;
let gajra = [];
let maxFlowers = 15;
let clearBtn, sendBtn, homeBtn, startBtn, venmoBtn, navHomeBtn, downloadBtn, shareBtn; 
let plopSound, typeSound, dingSound; 
let appState = 0; 
let messageInput;
let gajraCount = "0"; 

// Layout Control
let isMobile = false;
let gSize, rVal, uiW, uiH;

// PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "gajrasimulator.firebaseapp.com",
  databaseURL: "https://gajrasimulator-default-rtdb.firebaseio.com",
  projectId: "gajrasimulator",
  storageBucket: "gajrasimulator.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

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
  
  checkLayout();
  
  firebase.initializeApp(firebaseConfig);
  firebase.database().ref('gajraCount').on('value', (s) => {
    if (s.val()) gajraCount = s.val().toLocaleString();
  });

  initializeUI();
}

function checkLayout() {
  isMobile = (width < 600);
  if (isMobile) {
    gSize = 300; 
    rVal = 115;  
    uiW = 260;   
    uiH = 120;   
  } else {
    gSize = 250; 
    rVal = 100;
    uiW = 400;
    uiH = 80; // Increased height to show full placeholder
  }
}

function initializeUI() {
  startBtn = createButton('Weave a Gajra for Someone You Love');
  let sW = isMobile ? 280 : 350;
  startBtn.size(sW, 50);
  startBtn.position(width/2 - sW/2, height/2 + 100);
  startBtn.mousePressed(() => { appState = 1; startBtn.hide(); });
  styleButton(startBtn);

  navHomeBtn = createButton('⌂');
  navHomeBtn.size(40, 40); 
  navHomeBtn.position(20, 20);
  navHomeBtn.mousePressed(() => { gajra = []; appState = 0; hideUI(); startBtn.show(); });
  styleButton(navHomeBtn); navHomeBtn.hide();

  clearBtn = createButton('Start over');
  clearBtn.size(120, 40);
  clearBtn.position(width - 140, 20); 
  clearBtn.mousePressed(() => { gajra = []; messageInput.value(''); });
  styleButton(clearBtn); clearBtn.hide();

  downloadBtn = createButton(isMobile ? '↓' : 'Download Image');
  let dW = isMobile ? 40 : 160;
  downloadBtn.size(dW, 40);
  downloadBtn.position(width - (dW + 20), 20);
  downloadBtn.mousePressed(() => saveCanvas('my-gajra', 'png'));
  styleButton(downloadBtn); downloadBtn.hide();

  homeBtn = createButton('Create another');
  homeBtn.size(140, 40);
  homeBtn.mousePressed(() => { gajra = []; appState = 0; hideUI(); startBtn.show(); });
  styleButton(homeBtn); homeBtn.hide();

  shareBtn = createButton('Share');
  shareBtn.size(isMobile ? 70 : 100, 40);
  shareBtn.mousePressed(() => { if (navigator.share) navigator.share({url: window.location.href}); });
  styleButton(shareBtn); shareBtn.hide();

  venmoBtn = createButton('Patron');
  venmoBtn.size(isMobile ? 70 : 100, 40);
  venmoBtn.mousePressed(() => window.open('https://venmo.com/u/ayeshakhalid3989'));
  styleButton(venmoBtn); venmoBtn.hide();

  // STYLED TEXT BOX WITH FULL PLACEHOLDER
  messageInput = createInput('');
  messageInput.attribute('placeholder', "Dear Beloved, In every flower, I have woven a thought of you....");
  messageInput.attribute('maxlength', '400');
  messageInput.size(uiW, uiH);
  
  // Custom CSS for Placeholder and Input Style
  messageInput.style('background', 'rgba(255, 255, 255, 0.05)');
  messageInput.style('color', '#fff');
  messageInput.style('border', '1px solid rgba(255, 255, 255, 0.4)');
  messageInput.style('font-family', 'Courier New');
  messageInput.style('font-size', '13px');
  messageInput.style('padding', '12px');
  messageInput.style('outline', 'none');
  
  // This helps the placeholder wrap or stay visible
  messageInput.style('white-space', 'normal'); 
  
  messageInput.input(() => { if (typeSound.isLoaded()) typeSound.play(); });
  messageInput.hide();

  sendBtn = createButton('Gift this Gajra');
  sendBtn.size(140, 40);
  sendBtn.mousePressed(() => { updateCount(); appState = 2; });
  styleButton(sendBtn); sendBtn.hide();
}

function updateCount() {
  firebase.database().ref('gajraCount').transaction(c => (c || 0) + 1);
}

function hideUI() {
  [navHomeBtn, clearBtn, downloadBtn, homeBtn, shareBtn, venmoBtn, sendBtn].forEach(b => b.hide());
  messageInput.hide();
}

function draw() {
  background(20);
  push();
  imageMode(CENTER);
  let scale = max(width / bgImage.width, height / bgImage.height);
  image(bgImage, width / 2, height / 2, bgImage.width * scale, bgImage.height * scale);
  pop();

  if (appState === 0) drawHome();
  else if (appState === 1) drawSim();
  else if (appState === 2) drawFinal();
  
  drawCounter();
}

function drawCounter() {
  let cW = 180, cH = 35;
  push();
  translate(width/2, height - (cH + 15));
  fill(255, 15); stroke(255, 40); rect(-cW/2, -cH/2, cW, cH, 2);
  noStroke(); fill(255, 180); textAlign(CENTER, CENTER); textSize(11); textFont('Courier New');
  text(`Gajra made: ${gajraCount}`, 0, 0);
  pop();
}

function drawHome() {
  image(logoImage, width/2, height/2 - 140, 225, 225);
  fill(255); textAlign(CENTER); textSize(16); textFont('Courier New');
  let txt = "In the quiet corners of the heart, \nwe weave memories into form";
  text(txt, width/2 - 160, height/2 + 20, 320);
}

function drawSim() {
  navHomeBtn.show(); clearBtn.show();
  fill(255); textAlign(CENTER); textFont('Courier New'); textSize(15);
  text("A Gajra remind's us that Love does not need \ngrand gestures", width/2 - 160, 85, 320);
  fill(255, 255, 180); textSize(13);
  text("Tap the circle to bind flower in the thread", width/2 - 160, 160, 320);

  image(circleImage, width/2, height/2 - 40, gSize, gSize);
  drawFlowers(height/2 - 40);

  if (gajra.length >= maxFlowers) {
    let boxY = height/2 + (gSize/2) - 10;
    messageInput.position(width/2 - uiW/2, boxY);
    messageInput.show();
    
    fill(255, 255, 150); textAlign(RIGHT); textSize(11); textFont('Courier New');
    text(`${messageInput.value().length}/400`, width/2 + uiW/2, boxY - 8);
    
    sendBtn.position(width/2 - 70, boxY + uiH + 20);
    sendBtn.show();
  }
}

function drawFinal() {
  hideUI(); downloadBtn.show();
  fill(255); textAlign(CENTER); textFont('Courier New'); textSize(15);
  text("A Gajra remind's us that Love does not need \ngrand gestures", width/2 - 160, 85, 320);

  let gY = height * 0.35;
  image(circleImage, width/2, gY, gSize, gSize);
  drawFlowers(gY);

  let boxY = gY + gSize/2 + 30;
  messageInput.position(width/2 - uiW/2, boxY);
  messageInput.show();
  
  fill(255, 255, 150); textAlign(RIGHT); textSize(11); textFont('Courier New');
  text(`${messageInput.value().length}/400`, width/2 + uiW/2, boxY - 8);
  
  homeBtn.position(width/2 - 70, boxY + uiH + 25);
  homeBtn.show();
  
  shareBtn.position(width/2 - (isMobile ? 75 : 105), boxY + uiH + 80);
  shareBtn.show();
  venmoBtn.position(width/2 + (isMobile ? 5 : 5), boxY + uiH + 80);
  venmoBtn.show();
}

function drawFlowers(yCenter) {
  for (let i = 0; i < gajra.length; i++) {
    let f = gajra[i];
    push();
    translate(width/2 + rVal * cos(f.angle), yCenter + rVal * sin(f.angle));
    rotate(f.rot);
    image(flowerImages[f.type], 0, 0, gSize * 0.45, gSize * 0.45);
    pop();
  }
}

function mousePressed() {
  if (appState === 1 && dist(mouseX, mouseY, width/2, height/2 - 40) < gSize/2) {
    if (gajra.length >= maxFlowers) return;
    let angle = atan2(mouseY - (height/2 - 40), mouseX - width/2);
    let type = (gajra.length === maxFlowers - 1) ? 3 : floor(random(3));
    gajra.push({ angle: angle, type: type, rot: random(360) });
    if (plopSound.isLoaded()) plopSound.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  checkLayout();
  hideUI();
  initializeUI();
}

function styleButton(btn) {
  btn.style('background', 'rgba(255, 255, 255, 0.08)'); 
  btn.style('color', '#fff'); btn.style('border', '1px solid rgba(255,255,255,0.4)');
  btn.style('font-family', 'Courier New'); btn.style('cursor', 'pointer');
}
