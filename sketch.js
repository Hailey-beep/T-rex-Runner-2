var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

var HS = 0;
localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("T-rex/trex1.png","T-rex/trex3.png","T-rex/trex4.png");
  trex_collided = loadAnimation("T-rex/trex_collided.png");
  
  groundImage = loadImage("Backgrounds/ground2.png");
  cloudImage = loadImage("Backgrounds/Cloud2.png");
  
  obstacle1 = loadImage("Obstacles/obstacle1.png");
  obstacle2 = loadImage("Obstacles/obstacle2.png");
  obstacle3 = loadImage("Obstacles/obstacle3.png");
  obstacle4 = loadImage("Obstacles/obstacle4.png");
  obstacle5 = loadImage("Obstacles/obstacle5.png");
  obstacle6 = loadImage("Obstacles/obstacle6.png");
  
  gameOverImg = loadImage("Backgrounds/gameOver.png");
  restartImg = loadImage("Backgrounds/restart.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  
  trex = createSprite(0,displayHeight/4 - 50,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(camera.x,displayHeight/4,2*displayWidth,20);
  ground.scale = 2;
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;

  
  gameOver = createSprite(0,displayHeight/9);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(0,displayHeight/7);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(camera.x/2,displayHeight/4,2*displayWidth,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
}

function draw() {
  trex.debug = true;

  background("lightblue");
  text("Score: "+ score, camera.x + 200,displayHeight/75);
  text("High Score: "+ HS, camera.x - 100, displayHeight/75)
  
  if (gameState===PLAY){

    //Makes the camera follow the trex
    camera.x = trex.x;
    camera.y = trex.y;
    invisibleGround.x = trex.x;
    //ground.x = camera.x
    //console.log(invisibleGround.x)

    score = score + Math.round(getFrameRate()/60);

    var groundSpace = camera.x - displayWidth/2;
    //console.log(groundSpace)
    //moves ground with t-rex
    if(ground.x < groundSpace) {
      var groundSpace2 = camera.x + displayWidth/2;
      //console.log(groundSpace2)
      ground.x = groundSpace2;
    }
  
    if(keyDown("space") && trex.y >= displayHeight/4.7) {
      trex.velocityY = -12;
    }
  
    //Gravity
    trex.velocityY = trex.velocityY + 0.8;
    //T-rexs
    trex.velocityX = trex.velocityX + (0.1 + score/5000000)
    //console.log(trex.velocityX)
      
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }

  }
  else if (gameState === END) {
    gameOver.x = camera.x + 50;
    restart.x = camera.x + 50;
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.x + displayWidth/2,0,40,10);
    cloud.y = Math.round(random(-100,-35));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.x + displayWidth/2,displayHeight/4 - 20,10,40);
    //obstacle.debug = true;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 200;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  HS = localStorage["HighestScore"];
  //console.log(HS);
  
  score = 0;
  
}