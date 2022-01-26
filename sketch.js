// --- VARIABLES ---
let gridSize;
let w;
let pnt = [];
let camZ = 600; // Camera Starting Position
let size;
let latestZ;
let lightPower = 230;

// Models
let tv;
let toaster;
let wm;
let key;
let hp;

function preload(){
  tv = loadModel("tv.obj", true)
  toaster = loadModel("toaster.obj", true)
  hp = loadModel("hp.obj", true)
  key = loadModel("key.obj", true)
  wm = loadModel("wm.obj", true)
}

// --- P5 SETUP ---
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  w = windowWidth/2;
  gridSize = 20;
  size = w / gridSize

  // Create Grid
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let z = map(i, 0, gridSize-1, w, -w)
      let x = map(j, 0, gridSize-1, -w, w)
      pnt.push({x: x, z: z, r: random(), m: random()});
      latestZ = z;
    }
  }
}

// --- P5 DRAW LOOP ---
function draw() {
  orbitControl();
  background(0,0,0);
  noStroke();

  // Shed Some Light
  pointLight(lightPower,lightPower*0.8,lightPower*0.9,-40,-windowHeight,camZ-100)
  pointLight(lightPower*noise(1,frameCount/210),lightPower*noise(frameCount/90),lightPower*0.45,30,0,camZ)
  
  // Make A Camera
 myCam = camera(0,20,camZ,1000000*sin(frameCount/200), 1000000,-10000000,0.1*sin(frameCount/100),1,0)

  // Draw Boxes from Grid Positions
  beginShape();
  for (let p of pnt ){
    push()
    // Let the far away boxes be darker
    let darkness = (w / 4) / ( camZ - p.z )
    ambientMaterial(p.r*254*darkness,188*darkness,200*darkness);

    translate(p.x,300*noise(p.x*0.01,p.z*0.01,frameCount*0.001),p.z)
    rotateX(noise(p.x,p.z,frameCount*0.005))
    rotateY(PI+TAU*noise(p.x,p.z,frameCount*0.002))
    rotateZ(2*noise(p.x,p.z,frameCount*0.005))
    //box(10 + p.r*size)
    scale(0.2)

    if (p.m < 0.2) {
      model(tv)
    } else if (p.m < 0.4) {
      model(toaster)
    } else if (p.m < 0.6 ){
      model(wm)
    } else if (p.m < 0.8 ) {
      model(hp) 
    } else {
      model(key)
    }
    
    pop();
  }
  endShape();

  // Remove boxes and add new ones once camera moved a row
  if ( camZ % (round(w/gridSize) * 2) == 0 ){
    addNewRow();
  }
  camZ -=1;
}

// --- FUNCTIONS ---

// Only one function to add and remove rows of boxes
function addNewRow(){
  // Remove line in front
  pnt = pnt.slice(gridSize) 

  // Add line in the back
  let newZ = latestZ - round(w/gridSize)*2
  for (let i = 0; i < gridSize; i++) {
    let x = map(i, 0, gridSize-1, -w, w)
    pnt.push({x: x, z: newZ, r: random(), m: random()})
  }

  latestZ = newZ;
}