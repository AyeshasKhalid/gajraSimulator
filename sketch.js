let flowerImages = [];
let circleImage, bgImage, logoImage;
let gajra = [];
const radius = 100; 
let maxFlowers = 15;
let clearBtn, sendBtn, homeBtn, startBtn, venmoBtn, navHomeBtn, downloadBtn; 
let plopSound, typeSound, dingSound; 
let appState = 0; 
let messageInput;
let fadeAlpha = 255; 
let gajraCount = "1,024"; 
let sparkles = []; 

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
  updateGajraCount(false); 
}

async function updateGajraCount(isIncrementing) {
  let mode = isIncrementing ? 'hit' : 'get';
  const url = `https://api.counterapi.dev/v1/ayesha-gajra-studio-2026/global-count/${mode}`;
  
  // 1. If the user just gifted a gajra, increment the number locally immediately
  // This makes the UI feel "live" even if the internet is slow.
  if (isIncrementing) {
    let current = parseInt(gajraCount.replace(/,/g, ''));
    gajraCount = (current + 1).toLocaleString();
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // 2. Only overwrite our local count if the API actually returns a number
    if (data && data.count !== undefined) {
      gajraCount = data.count.toLocaleString();
    }
  } catch (e) {
    console.log("Counter API currently unreachable, using local count.");
  }
}

function initializeUI() {
  if (!startBtn) startBtn = createButton('Weave a Gajra for Someone You Love');
  startBtn.position(width / 2 - 150, height / 2 + 100);
  startBtn.size(300, 50);
  startBtn.mousePressed(() => {
    appState = 1;
    startBtn.hide();
    if (plopSound.isLoaded()) plopSound.play();
  });
  styleButton(startBtn);

  if (!navHomeBtn) navHomeBtn = createButton('⌂');
  navHomeBtn.position(20, 20);
  navHomeBtn.size(45, 40); 
  navHomeBtn.mousePressed(() => {
    gajra = [];
    appState = 0;
    fadeAlpha = 255;
    hideSimulationUI();
    startBtn.show();
  });
  styleButton(navHomeBtn);
  navHomeBtn.hide();

  if (!downloadBtn) downloadBtn = createButton('Download');
  downloadBtn.position(width - 110, 20);
  downloadBtn.size(90, 40); 
  downloadBtn.mousePressed(() => { saveCanvas('my-gajra', 'png'); });
  styleButton(downloadBtn);
  downloadBtn.hide();

  if (!clearBtn) clearBtn = createButton('Start Over');
  clearBtn.position(75, 20);
  clearBtn.size(110, 40); 
  clearBtn.mousePressed(() => {
    gajra = [];
    messageInput.value('');
    messageInput.hide();
    sendBtn.hide();
  });
  styleButton(clearBtn);
  clearBtn.hide();

  if (!messageInput) messageInput = createInput('');
  messageInput.attribute('maxlength', '400');
  messageInput.attribute('placeholder', "Dear Beloved, In every flower, I have woven a thought of you....");
  messageInput.position(width / 2 - 200, height - 180);
  messageInput.size(400, 40);
  messageInput.input(() => { if (typeSound.isLoaded()) typeSound.play(); });
  messageInput.hide();

  if (!sendBtn) sendBtn = createButton('Gift this Gajra');
  sendBtn.position(width / 2 - 75, height - 120);
  sendBtn.size(150, 40);
  sendBtn.mousePressed(() => {
    triggerSparkleExplosion(width/2, height - 120);
    finalizeAndShare(); 
  });
  styleButton(sendBtn);
  sendBtn.hide();

  if (!homeBtn) homeBtn = createButton('Create Another');
  homeBtn.position(width / 2 - 145, height - 120); 
  homeBtn.size(140, 40);
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

  if (!venmoBtn) venmoBtn = createButton('Support Artist');
  venmoBtn.position(width / 2 + 5, height - 120); 
  venmoBtn.size(140, 40);
  venmoBtn.mousePressed(() => { window.open('https://venmo.com/u/ayeshakhalid3989', '_blank'); });
  styleButton(venmoBtn);
  venmoBtn.hide();
}

function hideSimulationUI() {
  navHomeBtn.hide(); downloadBtn.hide(); clearBtn.hide();
  messageInput.hide(); sendBtn.hide();
}

function draw() {
  push();
  imageMode(CENTER);
  let scale = max(width / bgImage.width, height / bgImage.height);
  image(bgImage, width / 2, height / 2, bgImage.width * scale, bgImage.height * scale);
  pop();

  if (appState === 0) {
    drawLandingPage();
  } else if (appState === 1) {
    drawGajraPage(false);
    if (fadeAlpha > 0) {
      fill(20, 20, 20, fadeAlpha); rect(0, 0, width, height);
      fadeAlpha -= 10;
    }
  } else if (appState === 2) {
    drawCreditsPage();
  }
  
  // ANCHORED GAJRA CALCULATOR (Visible in all states)
  drawGlobalCounter();
}

function drawGlobalCounter() {
  let pulse = map(sin(frameCount * 3), -1, 1, 8, 25);
  push();
  // Fixed at bottom with 30px breathing room
  translate(width / 2, height - 30); 
  fill(255, pulse); stroke(255, 60);
  rect(-120, -15, 240, 30, 2);
  noStroke(); fill(255, 200); textFont('Courier New'); textAlign(CENTER); textSize(11);
  text(`GAJRAS WOVEN GLOBALLY: ${gajraCount}`, 0, 5);
  pop();
}

function drawLandingPage() {
  image(logoImage, width / 2, height / 2 - 160, 200, 200);
  fill(255); textAlign(CENTER); textFont('Courier New'); textSize(16);
  text("In the quiet corners of the heart, we weave memories into form...", width/2 - 250, height / 2 - 20, 500); 
  updateAndDrawSparkles();
}

function drawGajraPage(isFinal) {
  if (!isFinal) {
    navHomeBtn.show(); downloadBtn.show(); clearBtn.show();
    if (frameCount % 4 === 0) createSparkle(mouseX, mouseY, random(-0.2, 0.2), random(-0.2, 0.2));
  }
  
  textAlign(CENTER); textFont('Courier New'); textSize(14); fill(255);
  text("A gajra reminds us that love does not need grand gestures...", width/2 - 260, 80, 520); 
  
  if (!isFinal) {
    fill(255, 255, 0); 
    text("Tap the circle to bind your flowers to the thread.", width/2 - 260, 140, 520);
  }
  
  // Dynamic scale based on state
  let gSize = isFinal ? 250 : 250;
  let gY = isFinal ? height/2 - 120 : height/2;
  
  image(circleImage, width / 2, gY, gSize, gSize);

  for (let f of gajra) {
    push(); 
    let offsetX = f.x - width/2;
    let offsetY = f.y - height/2;
    translate(width/2 + offsetX, gY + offsetY); 
    rotate(f.rotation);
    image(flowerImages[f.type], 0, 0, 100, 100); 
    pop();
  }

  if (gajra.length >= maxFlowers && !isFinal) {
    messageInput.show(); sendBtn.show();
    fill(255, 255, 0); textSize(10); textAlign(RIGHT);
    text(`${messageInput.value().length}/400`, width / 2 + 200, height - 185);
  } else if (!isFinal) {
    fill(255, 180); textSize(12);
    text(`Progress: ${gajra.length} / ${maxFlowers}`, width / 2, height - 80);
  }
  updateAndDrawSparkles();
}

function finalizeAndShare() {
  if (dingSound.isLoaded()) dingSound.play();
  updateGajraCount(true); 
  appState = 2;
}

function drawCreditsPage() {
  hideSimulationUI(); downloadBtn.show(); homeBtn.show(); venmoBtn.show();
  
  // 1. DRAW FULL-SIZE GAJRA
  drawGajraPage(true);

  // 2. DRAW MESSAGE BOX (Positioned below the gajra)
  let pulse = map(sin(frameCount * 3), -1, 1, 120, 180); 
  let boxW = 500, boxH = 100;
  let boxX = width / 2 - boxW / 2, boxY = height / 2 + 50; 
  fill(0, pulse); noStroke(); rect(boxX, boxY, boxW, boxH, 10); 
  fill(255, 255, 0); textSize(14); textAlign(LEFT, TOP); textWrap(CHAR); 
  text(messageInput.value() || "...", boxX + 20, boxY + 20, boxW - 40, boxH - 40); 

  // 3. THANK YOU TEXT
  fill(255); textAlign(CENTER); textFont('Courier New'); textSize(22);
  text("THANK YOU", width / 2, height / 2 + 190);
  
  updateAndDrawSparkles();
}

function mousePressed() {
  if (appState === 1 && dist(mouseX, mouseY, width / 2, height / 2) < 150) {
    if (gajra.length >= maxFlowers) return;
    let angle = atan2(mouseY - height / 2, mouseX - width / 2);
    let snapX = width / 2 + radius * cos(angle);
    let snapY = height / 2 + radius * sin(angle);
    let selectedType = (gajra.length === maxFlowers - 1) ? 3 : floor(random(3));
    gajra.push({ x: snapX, y: snapY, type: selectedType, rotation: random(360) });
    if (plopSound.isLoaded()) plopSound.play();
  }
}

function updateAndDrawSparkles() {
  for (let i = sparkles.length - 1; i >= 0; i--) {
    let p = sparkles[i]; p.c.setAlpha(p.alpha);
    fill(p.c); noStroke(); circle(p.x, p.y, p.sz);
    p.x += p.vx; p.y += p.vy; p.alpha -= 5;
    if (p.alpha <= 0) sparkles.splice(i, 1);
  }
}

function triggerSparkleExplosion(x, y) {
  for (let i = 0; i < 20; i++) sparkles.push({x: x, y: y, vx: random(-2,2), vy: random(-4,-1), alpha: 255, sz: random(1,4), c: color(255, random(220,255), 200)});
}

function createSparkle(x, y, vx, vy) {
  sparkles.push({x: x, y: y, vx: vx, vy: vy, alpha: 255, sz: random(1,4), c: color(255, 255, 200)});
}

function styleButton(btn) {
  btn.style('padding', '10px'); btn.style('background-color', 'rgba(255, 255, 255, 0.05)'); 
  btn.style('color', '#fff'); btn.style('border', '1px solid #fff');
  btn.style('font-family', 'Courier New'); btn.style('cursor', 'pointer');
}
