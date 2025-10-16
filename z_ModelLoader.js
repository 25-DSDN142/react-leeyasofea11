let handPose;
let video;
let hands = [];
let sparkles = [];
let clouds = [];

function preload() {
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  handPose.detectStart(video, gotHands);

  // Initialize clouds
  for (let i = 0; i < 8; i++) {
    clouds.push({
      x: random(width),
      y: random(height / 2),
      w: random(100, 200),
      h: random(50, 100),
      speed: random(0.1, 0.5)
    });
  }
}

function draw() {
  // Grey-blue sky background
  background(180, 200, 255);

  // Draw and move clouds
  noStroke();
  fill(220, 220, 255, 180); // soft cloud color
  for (let cloud of clouds) {
    ellipse(cloud.x, cloud.y, cloud.w, cloud.h);
    ellipse(cloud.x - cloud.w/3, cloud.y + 10, cloud.w * 0.7, cloud.h * 0.7);
    ellipse(cloud.x + cloud.w/3, cloud.y - 10, cloud.w * 0.7, cloud.h * 0.7);

    cloud.x += cloud.speed; // move cloud slowly
    if (cloud.x - cloud.w > width) cloud.x = -cloud.w; // loop cloud
  }

  // Draw video slightly transparent on top
  tint(255, 100);
  image(video, 0, 0, width, height);
  noTint();

  // Add sparkles at index finger
  for (let i = 0; i < hands.length; i++) {
    let index = hands[i].index_finger_tip;
    addSparkle(index.x, index.y);
  }

  // Update and draw sparkles
  for (let i = sparkles.length - 1; i >= 0; i--) {
    sparkles[i].update();
    sparkles[i].show();
    if (sparkles[i].finished()) {
      sparkles.splice(i, 1);
    }
  }
}

function gotHands(results) {
  hands = results;
}

function addSparkle(x, y) {
  sparkles.push(new Sparkle(x, y));
}

class Sparkle {
  constructor(x, y) {
    this.x = x + random(-5, 5);
    this.y = y + random(-5, 5);
    this.size = random(8, 15);
    this.alpha = 255;
    this.angle = random(TWO_PI);
    this.speed = random(0.01, 0.03);
  }
  
  update() {
    this.alpha -= 4;
    this.angle += this.speed;
  }
  
  finished() {
    return this.alpha <= 0;
  }
  
  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    noStroke();
    fill(255, 255, 0, this.alpha); // bright yellow
    beginShape();
    for (let i = 0; i < 8; i++) {
      let len = i % 2 === 0 ? this.size : this.size / 2;
      let a = TWO_PI / 8 * i;
      vertex(cos(a) * len, sin(a) * len);
    }
    endShape(CLOSE);
    pop();
  }
}
