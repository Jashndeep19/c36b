var dog,sadDog,happyDog,garden,washroom,bedroom;
var database,foodS,foodStock,fedTime,lastFed;
var currentTime,feed,addFood,food, gameState,readState;

function preload(){
sadDog=loadImage("images/dog.png");
happyDog=loadImage("images/happy dog.png");
garden=loadImage("images/Garden.png");
washroom=loadImage("images/Wash Room.png");
bedroom=loadImage("images/Bed Room.png");
foood=loadImage("images/Living Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(400,500);
  
  food = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      background(garden);
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    background(bedroom);
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    background(washroom);
   }else{
    update("Hungry")
    background(foood);
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }
 
  drawSprites();
}


function readStock(data){
  foodS=data.val();
  food.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  food.updateFoodStock(food.getFoodStock()-1);
  database.ref('/').update({
    Food:food.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}


function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}