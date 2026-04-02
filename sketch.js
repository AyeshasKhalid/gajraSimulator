let flowerImages = [];
let circleImage, bgImage, logoImage;
let gajra = [];
let radius; // Calculated in setup
let maxFlowers = 15;
let clearBtn, sendBtn, homeBtn, startBtn, venmoBtn, navHomeBtn, downloadBtn, shareBtn; 
let plopSound, typeSound, dingSound; 
let appState = 0; 
let messageInput;
let gajraCount = "0"; 
let sparkles = []; 

// Dynamic Layout Variables
let gajraSize;
let uiWidth;

// Firebase Configuration (Keep your keys here)
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
  
  // RESPONSIVE LOGIC:
  // On Desktop: Size is 150px. On Mobile: Size is 40% of screen width.
  gajraSize = (width > 600) ? 150 : width * 0.45;
  radius = gajraSize * 0.4; // Flower placement radius scales with the circle
  uiWidth = min(width * 0.85, 500); // UI elements never exceed 85% of screen
  
  firebase.initializeApp(firebaseConfig);
  let database = firebase.database();
  let globalCountRef = database.ref('gajraCount');

  globalCountRef.on('value', (snapshot) => {
    let data = snapshot.val();
    if (data !== null) gajraCount = data.toLocaleString();
  });

  initializeUI();
}

function initializeUI() {
  // Center all buttons using uiWidth
  startBtn = createButton('Weave a Gajra for Someone You Love');
  startBtn.position(width/2 - (uiWidth/2), height/2 + 100);
  startBtn.size(uiWidth, 50);
  startBtn.mousePressed(() => { appState = 1; startBtn.hide(); });
  styleButton(startBtn);

  navHomeBtn = createButton('⌂');
  navHomeBtn.position(15, 15);
  navHomeBtn.size(45, 40);
  navHomeBtn.mousePressed(() => { gajra = []; appState = 0; hideSimulationUI(); startBtn.show(); });
  styleButton(navHomeBtn); navHomeBtn.hide();

  downloadBtn = createButton('Save');
  downloadBtn.position(width - 75, 15);
  downloadBtn.size(60, 40);
  downloadBtn.mousePressed(() => saveCanvas('my-gajra', 'png'));
  styleButton(downloadBtn); downloadBtn.hide();

  // Final Page Layout
  homeBtn = createButton('Create Another');
  homeBtn.position(width/2 - 80, height - 180);
  homeBtn.size(160, 40);
  homeBtn.mousePressed(() => { gajra = []; appState = 0; hideSimulationUI(); startBtn.show(); });
  styleButton(homeBtn); homeBtn.hide();

  let subBtnW = (uiWidth / 2) - 10;
  shareBtn = createButton('Share');
  shareBtn.position(width/2 - uiWidth/2, height - 130);
  shareBtn.size(subBtnW, 40);
  shareBtn.mousePressed(() => { if (navigator.share) navigator.share({title: 'Gajra', url: window.location.href}); });
  styleButton(shareBtn); shareBtn.hide();

  venmoBtn = createButton('Patron');
  venmoBtn.position(width/2 + 10, height - 130);
  venmoBtn.size(subBtnW, 40);
  venmoBtn.mousePressed(() => window.open('https://venmo.com/u/ayeshakhalid3989', '_blank'));
  styleButton(venmoBtn); venmoBtn.hide();

  messageInput = createInput('');
  messageInput.attribute('placeholder', "Dear Beloved...");
  messageInput.position(width/2 - uiWidth/2, height - 200);
  messageInput.size(uiWidth, 40);
  messageInput.hide();

  sendBtn = createButton('Gift this Gajra');
  sendBtn.position(width/2 - 75, height - 140);
  sendBtn.size(150, 40);
  sendBtn.mousePressed(() => { updateGajraCount(true); appState = 2; });
  styleButton(sendBtn); sendBtn.hide();
}

function updateGajraCount(isInc) {
  if (isInc) firebase.database().ref('gajraCount').transaction(c => (c || 0) + 1);
}

function hideSimulationUI() {
  navHomeBtn.hide(); downloadBtn.hide(); 
  messageInput.hide(); sendBtn.hide(); shareBtn.hide(); homeBtn.hide(); venmoBtn.hide();
}

function draw() {
  background(20); 
  // Background scaling
  push();
  imageMode(CENTER);
  let scale = max(width / bgImage.width, height / bgImage.height);
  image(bgImage, width / 2, height / 2, bgImage.width * scale, bgImage.height * scale);
  pop();

  if (appState === 0) drawLandingPage();
  else if (appState === 1) drawGajraPage();
  else if (appState === 2) drawCreditsPage();
  
  drawGlobalCounter();
}

function drawGlobalCounter() {
  push();
  translate(width/2, height - 30); 
  fill(255, 20); rect(-120, -15, 240, 30, 2);
  fill(255, 200); textAlign(CENTER); textSize(10);
  text(`GAJRAS MADE GLOBALLY: ${gajraCount}`, 0, 5);
  pop();
}

function drawLandingPage() {
  image(logoImage, width/2, height/2 - 100, 150, 150);
  fill(255); textAlign(CENTER); textSize(14);
  text("weaving memories into form...", width/2 - uiWidth/2, height/2, uiWidth); 
}

function drawGajraPage() {
  navHomeBtn.show(); downloadBtn.show();
  image(circleImage, width/2, height/2 - 50, gajraSize, gajraSize);
  drawFlowers(height/2 - 50);

  if (gajra.length >= maxFlowers) {
    messageInput.show(); sendBtn.show();
  }
}

function drawCreditsPage() {
  hideSimulationUI(); downloadBtn.show(); homeBtn.show(); venmoBtn.show(); shareBtn.show();
  
  let gY = height * 0.3; 
  image(circleImage, width/2, gY, gajraSize, gajraSize);
  drawFlowers(gY);

  let boxY = gY + (gajraSize/2) + 40;
  fill(255, 10); rect(width/2 - uiWidth/2, boxY, uiWidth, 80, 5);
  fill(255); textAlign(LEFT, TOP); textSize(14);
  text(messageInput.value(), width/2 - uiWidth/2 + 10, boxY + 10, uiWidth - 20);
}

function drawFlowers(yCenter) {
  for (let i = 0; i < gajra.length; i++) {
    let f = gajra[i];
    push(); 
    // Re-calculating snap positions based on current gajraSize
    let x = width/2 + radius * cos(f.angle);
    let y = yCenter + radius * sin(f.angle);
    translate(x, y); 
    rotate(f.rotation);
    image(flowerImages[f.type], 0, 0, gajraSize * 0.6, gajraSize * 0.6); 
    pop();
  }
}

function mousePressed() {
  if (appState === 1 && dist(mouseX, mouseY, width / 2, height / 2 - 50) < gajraSize/2) {
    if (gajra.length >= maxFlowers) return;
    let angle = atan2(mouseY - (height / 2 - 50), mouseX - width / 2);
    let selectedType = (gajra.length === maxFlowers - 1) ? 3 : floor(random(3));
    gajra.push({ angle: angle, type: selectedType, rotation: random(360) });
    if (plopSound.isLoaded()) plopSound.play();
  }
}

function styleButton(btn) {
  btn.style('background', 'rgba(255, 255, 255, 0.1)'); 
  btn.style('color', '#fff'); btn.style('border', '1px solid #fff');
  btn.style('font-family', 'Courier New');
}
