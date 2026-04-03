let flowerImages = [];
let circleImage, bgImage, logoImage;
let gajra = [];
const radius = 100; 
let maxFlowers = 15;
let clearBtn, sendBtn, homeBtn, startBtn, venmoBtn, navHomeBtn, downloadBtn, shareBtn; 
let plopSound, typeSound, dingSound; 
let appState = 0; 
let messageInput;
let fadeAlpha = 255; 
let gajraCount = "0"; 
let sparkles = []; 

// Firebase Variables
let database;
let globalCountRef;

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
  
  firebase.initializeApp(firebaseConfig);
  database = firebase.database();
  globalCountRef = database.ref('gajraCount');

  globalCountRef.on('value', (snapshot) => {
    let data = snapshot.val();
    if (data !== null) {
      gajraCount = data.toLocaleString();
    } else {
      globalCountRef.set(1024); 
    }
  });

  typeSound.setVolume(0.1); 
  dingSound.setVolume(0.3); 
  plopSound.setVolume(0.5);
  
  initializeUI();
}

function initializeUI() {
  startBtn = createButton('Weave a Gajra for Someone You Love');
  startBtn.position(width/2 - 150, height/2 + 100);
  startBtn.size(300, 50);
  startBtn.mousePressed(() => { appState = 1; startBtn.hide(); if (plopSound.isLoaded()) plopSound.play(); });
  styleButton(startBtn);

  navHomeBtn = createButton('⌂');
  navHomeBtn.position(20, 20);
  navHomeBtn.size(45, 40);
  navHomeBtn.mousePressed(() => { gajra = []; appState = 0; hideSimulationUI(); startBtn.show(); });
  styleButton(navHomeBtn); navHomeBtn.hide();

  downloadBtn = createButton('Download Image');
  downloadBtn.position(width - 160, 20);
  downloadBtn.size(140, 40);
  downloadBtn.mousePressed(() => saveCanvas('my-gajra', 'png'));
  styleButton(downloadBtn); downloadBtn.hide();

  homeBtn = createButton('Create Another');
  homeBtn.position(width/2 - 80, height - 170);
  homeBtn.size(160, 40);
  homeBtn.mousePressed(() => { gajra = []; appState = 0; hideSimulationUI(); startBtn.show(); });
  styleButton(homeBtn); homeBtn.hide();

  let btnW = 120;
  let gap = 15;
  let totalW = (btnW * 2) + gap;
  let startX = width/2 - totalW/2;
  let btnY = height - 150; 

  shareBtn = createButton('Share');
  shareBtn.position(startX, btnY+30);
  shareBtn.size(btnW, 40);
  shareBtn.mousePressed(async () => {
    const canvas = document.querySelector('canvas');
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'my-gajra.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try { 
          await navigator.share({
            files: [file],
            title: 'My Gajra',
            url: window.location.href
          }); 
        } catch (e) { console.error(e); }
      } else {
        try { await navigator.share({ title: 'My Gajra', url: window.location.href }); } catch (e) { console.error(e); }
      }
    }, 'image/png');
  });
  styleButton(shareBtn); shareBtn.hide();

  venmoBtn = createButton('Patron');
  venmoBtn.position(startX + btnW + gap, btnY+30);
  venmoBtn.size(btnW, 40);
  venmoBtn.mousePressed(() => window.open('https://venmo.com/u/ayeshakhalid3989', '_blank'));
  styleButton(venmoBtn); venmoBtn.hide();

  clearBtn = createButton('Start Over');
  clearBtn.position(75, 20);
  clearBtn.size(110, 40);
  clearBtn.mousePressed(() => { gajra = []; messageInput.value(''); messageInput.hide(); sendBtn.hide(); });
  styleButton(clearBtn); clearBtn.hide();

  // REVERTED TEXTBOX
  messageInput = createInput('');
  messageInput.attribute('maxlength', '400');
  messageInput.attribute('placeholder', "Dear Beloved, In every flower, I have woven a thought of you....");
  messageInput.position(width/2 - 200, height - 180);
  messageInput.size(400, 40);
  messageInput.input(() => { if (typeSound.isLoaded()) typeSound.play(); });
  messageInput.hide();

  sendBtn = createButton('Gift this Gajra');
  sendBtn.position(width/2 - 75, height - 120);
  sendBtn.size(150, 40);
  sendBtn.mousePressed(() => { 
    triggerSparkleExplosion(width/2, height - 120); 
    updateGajraCount(true); 
    appState = 2; 
  });
  styleButton(sendBtn); sendBtn.hide();
}

function updateGajraCount(isIncrementing) {
  if (isIncrementing) {
    globalCountRef.transaction((currentValue) => {
      return (currentValue || 0) + 1;
    });
  }
}

function hideSimulationUI() {
  [navHomeBtn, downloadBtn, clearBtn, messageInput, sendBtn, shareBtn, homeBtn, venmoBtn].forEach(b => b.hide());
}

function draw() {
  push();
  let scale = max(width / bgImage.width, height / bgImage.height);
  image(bgImage, width / 2, height / 2, bgImage.width * scale, bgImage.height * scale);
  pop();

  if (appState === 0) drawLandingPage();
  else if (appState === 1) drawGajraPage();
  else if (appState === 2) drawCreditsPage();
  
  drawGlobalCounter();
}

function drawGlobalCounter() {
  let pulse = map(sin(frameCount * 3), -1, 1, 8, 25);
  push();
  translate(width/2, height - 30); 
  fill(255, pulse); stroke(255, 60);
  rect(-120, -15, 240, 30, 2);
  noStroke(); fill(255, 200); textFont('Courier New'); textAlign(CENTER); textSize(11);
  text(`GAJRAS MADE GLOBALLY: ${gajraCount}`, 0, 5);
  pop();
}

function drawLandingPage() {
  image(logoImage, width/2, height/2 - 160, 200, 200);
  fill(255); textAlign(CENTER); textFont('Courier New'); textSize(16);
  text("In the quiet corners of the heart, we weave memories into form...", width/2 - 250, height/2 - 20, 500); 
  updateAndDrawSparkles();
}

function drawGajraPage() {
  navHomeBtn.show(); downloadBtn.show(); clearBtn.show();
  textAlign(CENTER); textFont('Courier New'); textSize(14); fill(255);
  text("A gajra reminds us that love does not need grand gestures...", width/2 - 260, 80, 520); 
  fill(255, 255, 0); text("Tap the circle to bind your flowers to the thread.", width/2 - 260, 140, 520);
  
  image(circleImage, width/2, height/2, 250, 250);
  drawFlowers(height/2);

  if (gajra.length >= maxFlowers) {
    messageInput.show(); sendBtn.show();
    fill(255, 255, 0); textSize(10); textAlign(RIGHT);
    text(`${messageInput.value().length}/400`, width/2 + 200, height - 185);
  } else {
    fill(255, 180); textSize(12);
    text(`Progress: ${gajra.length} / ${maxFlowers}`, width/2, height - 80);
  }
  updateAndDrawSparkles();
}

function drawCreditsPage() {
  hideSimulationUI(); downloadBtn.show(); homeBtn.show(); venmoBtn.show(); shareBtn.show();
  textAlign(CENTER); textFont('Courier New'); textSize(14); fill(255);
  text("A gajra reminds us that love does not need grand gestures...", width/2 - 260, 80, 520); 

  let gY = 220; 
  image(circleImage, width/2, gY, 250, 250);
  drawFlowers(gY);

  let boxW = 500, boxH = 100;
  let boxY = gY + 180;
  fill(255, 15); stroke(255, 50); rect(width/2 - boxW/2, boxY, boxW, boxH, 10);
  
  fill(255, 255, 0); textAlign(RIGHT); textSize(10);
  text(`${messageInput.value().length}/400`, width/2 + boxW/2 - 10, boxY - 10);
  
  fill(255); textAlign(LEFT, TOP); textSize(14); 
  text(messageInput.value() || "...", width/2 - boxW/2 + 20, boxY + 20, boxW - 40, boxH - 40);
  updateAndDrawSparkles();
}

function drawFlowers(yCenter) {
  for (let i = 0; i < gajra.length; i++) {
    let f = gajra[i];
    push(); 
    let offsetX = f.
