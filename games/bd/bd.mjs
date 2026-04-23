/*******************************************************/
//blobdefenders.mjs
//Conatains all code for The blobdefenders
//Blob defenders is shooting enemies before they can get to you
///writen by George Taylor 
//Term 1 2025

//////////////////////Function Comments method
//Name: Name of the function
//When: (if called by function, name function)
//		(if called in class, name class and methods)
// 		(if called through draw loop, tree to find the code) EG.
//			draw() {	(gameState == "play"){	\\	in the draw loop 	if gameState = "play"  Run this function
//Job: What it does
//Input: input parameters
//Output: what it returns
/////////////////////////////////
/*******************************************************/


//Imports
import {fb_writeRecords, fb_readRecords}
    from '/Fb_io.mjs';

///UserDetails
let userDetails = {
displayName:'n/a',
email:'n/a',
photoUrl:'n/a',
uid:'n/a',
topScore: 0,
gender:'n/a',
gameName:'n/a',}

var adminVal;


if ((localStorage.getItem("userDetails") !== null) && (localStorage.getItem("adminVal") !== null)) {
	const storedDetailsUsers = localStorage.getItem("userDetails");
	const storedDetailsAdmin = localStorage.getItem("adminVal");
	userDetails = JSON.parse(storedDetailsUsers);
	adminVal = JSON.parse(storedDetailsAdmin);
}

/////Games
var gameState = "start";

// Preload Vars
var gun
var topW
var botW
var leftW
var rightW
var startButton

var gunStand
var controlsTitle1
var controlsTitle2
var controlsTitle3
var instrucTitle1
var instrucTitle2
var instrucTitle3

var gameOverTitle
var restartButton
var scoreSprite
var xpBarBar
var xpBarBoarder
var spritePlaceHolder

// Preload scope varable 
var playerSprite
var enemySprite
var orbSprite
var gameOverImg
var bg

var playerGroup
var walls
var player


//TIMERS
var iFrameCounter = 0;
var gunTimer = 3;

//ORBS
const ORBAMOUNT = 200;
let activeOrbs = [];
let inactiveOrbs = [];

//ENEMIES 
const ENEMYAMOUNT = 500;
var enemySpawnTimer = 0;
let activeEnemies = [];
let inactiveEnemies = [];
const BASICENEMY = new Map([["type", "basic"],["health", 50],["xpAmount", 20]]);

////////////GUN
const BULLETAMOUNT = 100;
let activeBullets = [];
let inactiveBullets = [];

////List of guns and stats

const PISTOL = new Map([["name", "PISTOL"],["numShots", 1],["interval", 15],["speed", 30],["size", 16],["damage", 25],["spread", 0],["peirce", 3]]);
const SHOTGUN = new Map([["name", "SHOTGUN"],["numShots", 15],["interval", 40],["speed", 19],["size", 8],["damage", 10],["spread", 30],["peirce", 2]]);
const SNIPER = new Map([["name", "SNIPER"],["numShots", 1],["interval", 60],["speed", 38],["size", 50],["damage", 70],["spread", 0],["peirce", 10]]);
const SMG = new Map([["name", "SMG"],["numShots", 1],["interval", 5],["speed", 25],["size", 8],["damage", 15],["spread", 11],["p1eirce", 1]]);
const DEVGUN = new Map([["name", "DEVGUN"],["numShots", 3],["interval", 10],["speed", 16],["size", 70],["damage", 70],["spread", 7],["peirce", 10]]);

let gunList = [PISTOL, SHOTGUN, SNIPER, SMG, DEVGUN];
var gunType = PISTOL;

let activeLives = [];
let inactiveLives = [];

let weaponSelectionButtons = [] 
let UiArray = []
let livesSprites = []


/*******************************************************/
function preload() {
	playerSprite = loadImage('./img/playerSprite.png');
	enemySprite = loadImage('./img/enemySprite.png');
	orbSprite = loadImage('./img/orbSprite.png');
	gameOverImg = loadImage('./img/gameoverImg.png');
	bg = loadImage('./img/gameBg.jpg');
}

/*******************************************************/
// setup()
/*******************************************************/
function setup() {
	console.log("setup: ");
	var cnv = new Canvas(windowWidth-10,windowHeight-10);
	createBgTiles();
	
	
	//createGroups
	playerGroup = new Group();
	walls = new Group();
	player = new Player();
	
	start();
	
	//adds a certain amount of a class to the arrays
	for (let i = 0; i < ENEMYAMOUNT; i++){
		inactiveEnemies.push(new Enemy()); // Create enemies
	}
	for (let i = 0; i < BULLETAMOUNT; i++){
		inactiveBullets.push(new Bullet()); // Create bullets
	}
	for (let i = 0; i < ORBAMOUNT; i++){
		inactiveOrbs.push(new Orb()); // Create Xp Orbs
	}

}
	
/*******************************************************/
// draw()
/*******************************************************/
function draw() {
	background(bg); 
	html_listen4Debug();

	//////"commands"///
	if (kb.pressed('x')){
		console.log(activeOrbs);
		console.log(inactiveOrbs);
	}
	if (kb.pressed('h')){
		window.location.href = '.../index.html';
	}

	
	///If in start menu and overlaps start button. remove everthing onscreen & set player pos = 0
	if(gameState == "start"){
		player.move();

		if(startButton.overlaps(player.getSprite())){
			weaponSelectionButtons.forEach(button =>{button.death()});
			UiArray.forEach(button=>{button.remove()});
			walls.removeAll();
			player.setCenter();
			startGame();
		}
		///forEach button, If player overlaps sprite gun type = associated button value///
		weaponSelectionButtons.forEach(button =>{ 
			if(button.getSprite().overlaps(player.getSprite())){
				gunType = button.getGun();
				gunStand.text = gunType.get("name");
			}
		})
		
		/////setting gun type through keybord input////
		if (kb.presses('1')){
			gunType = gunList[0];
			gunStand.text = gunType.get("name");
		}
		if (kb.presses('2')){
			gunType = gunList[1];
			gunStand.text = gunType.get("name");
		}
		if (kb.presses('3')){
			gunType = gunList[2];
			gunStand.text = gunType.get("name");
		}
		if (kb.presses('4')){
			gunType = gunList[3];
			gunStand.text = gunType.get("name");
		}
		if (kb.presses('5')){
			gunType = gunList[4];
			gunStand.text = gunType.get("name");
		}
	}

	/////If game playing, camrea pos = player pos. and constentsly move ui to associateed location
	if (gameState == "play"){
		enemySpawnTimer++;
		player.move();
		camera.x = player.sprite.x;
		camera.y = player.sprite.y;

		if  (enemySpawnTimer%150 == 0){
			for (let i = 0; i < Math.sqrt(enemySpawnTimer/150); i++){
				spawnEnemy();
			}
		}
		moveUi();
		////commands
		if (kb.pressed('l')){
			player.takeDamage();
		}
		
		if (kb.pressed('z')){
			spawnEnemy();
		}
		
		gun.rotateMinTo(mouse, 30, 90);
		
		///gun shooting when timer is greater then the gun's limit in array
		if (gunTimer > gunType.get("interval") && mouse.pressing()){
			gunTimer = 0;
		} 
		if (gunTimer == 2){
			shoot();
		}
		gunTimer += 1;

		////////ForEach///////

		//every bullet check if hitting wall, if so delete
		activeBullets.forEach(bullet => {
			if (bullet.getSprite().overlaps(walls)){
				bullet.death();
			}
		 })

			/////////i frames\\\\\\\\\\
		if(player.isIFrames == true){  
			const IFRAMEAMOUNT = 70;
			player.sprite.opacity = 0.5;
			if (iFrameCounter == IFRAMEAMOUNT){ 
				player.isIFrames = false;
				player.sprite.opacity = 1;  
				iFrameCounter = 0;
			} else {
				iFrameCounter += 1;
			}
			
		}
		//// forEachorb if touching player add xp and delete
		activeOrbs.forEach(orb => {   
			if (orb.getSprite().overlaps(player.getSprite())){
				player.gainXp(orb.getXp())  
				orb.death(); 
			}
		})
		//////enemies//////
		activeEnemies.forEach(enemy => {
			enemy.move();
			if(enemy.getSprite().overlaps(player.getSprite())){
				player.takeDamage();
			}
		})
		
		if(activeBullets.length > 0 && activeEnemies.length > 0){////if there active bullets and enmeies
			activeBullets.forEach(bullet => {////for every bullet
				activeEnemies.forEach(enemy =>{  ///check every enemie
					if(bullet.getSprite().overlaps(enemy.getSprite())){//if sprites overlap 
						enemy.hit(bullet.getdamage());
						bullet.hit();
					}
				})
			})
		}
		activeBullets.forEach(bullet => {
			if(bullet.getSprite().x >= player.getSprite().x + 2*width ||bullet.getSprite().x <= player.getSprite().x - 2*width ){
				bullet.death();
			}
			if(bullet.getSprite().y >= player.getSprite().y + 2*height ||bullet.getSprite().y <= player.getSprite().y - 2*height ){
				bullet.death();
			}

		})
	}
	if(gameState == "gameOver"){

		activeEnemies.forEach(enemy =>{
			enemy.sprite.speed = 0
			enemy.sprite.rotationSpeed = 0;
		})
		activeBullets.forEach(bullet =>{
			bullet.sprite.speed = 0;
		})

		if (kb.presses('r')){
			enemySpawnTimer = 0;
			player.levelMult = 1;
			UiArray.forEach(button=>{button.remove()});
			///Comeback  this still dosent work so probably smth to do with classes method
			for(let i = 0; i < 13; i ++){
				for(let i = 0; i < activeBullets.length; i ++){
					activeBullets[0].death(); 
				}
				for(let i = 0; i < activeEnemies.length; i ++){
					activeEnemies[0].death(); 
				}
				for(let i = 0; i < activeOrbs.length; i ++){
					activeOrbs[0].death(); 
				}
			}
			
			player.setHealth(3);
			gun.remove();
			start();

		}
	}

}
	
/*******************************************************/
// Functions
/*******************************************************/

////////////////////////////GamePlay Screens/////////////////////

///////////////////////////////////
//Name:createBgTiles()
//When:Setup()
//Job: Creates the background tiles
//Input: N/A
//Output:N/A
////////////////////////////////
function createBgTiles(){
	for(let i = 0; i < 20; i ++){
		for(let u = 0; u < 20; u ++){
			new BgTiles(i, u);
		}
	}
}
///////////////////////////////////
//Name:start()
//When:Setup() /// (gameState == "gameOver"){ 	(kb.presses('r'))	{
//Job: creates walls/buttons // sets camera &player 2 center // resets score
//Input: N/A
//Output:N/A
////////////////////////////////
function start(){
	gameState = "start"
	camera.x = width/2;
	camera.y = height/2;
	createStartMenuUi();
	createWalls();
	player.score = 0;
	player.setCenter();
}

///////////////////////////////////
//Name:startGame()
//When: Draw(){		(gameState == "start"){		(startButton.overlaps(player.getSprite())){
//Job: spawn game ui // creae gun // change gameState
//Input: N/A
//Output:N/A
////////////////////////////////
function startGame(){
	gameState = "play";
	spawnGameUi();
	createGun();
}

///////////////////////////////////
//Name:showPlayerLives()
//When:Player.takeDamage/ Player.Death
//Job: resets and displays lives counters
//Input: N/A
//Output:N/A
////////////////////////////////
function showPlayerLives(){
	for(let i = 0; i < livesSprites.length;i ++){
		if(i >= player.getHealth()){
			livesSprites[i].opacity = 0;
		}
	}
}

///////////////////////////////////
//Name:createGun()
//When:startGame()
//Job: creates gun sprite and adds to player group
//Input: N/A
//Output:N/A
////////////////////////////////
function createGun(){
	gun = new Sprite(player.sprite.x, player.sprite.y + 10, 16, 50, 'n');
	gun.opacity = 0.5;
	gun.color = 'blue';
	gun.rotationLock = true;
	playerGroup.add(gun);
}

///////////////////////////////////
//Name:shoot()
//When:  draw() {	(gameState == "play"){		(gunTimer == 2){
//Job: for amounts of shoot in the guns map, Calls spawnBullet()
//Input: N/A
//Output:N/A
////////////////////////////////
function shoot(){
	for(let i = 0; i < gunType.get("numShots"); i++){
		spawnBullet();
	}
}

///////////////////////////////////
//Name:createWalls()
//When: start()
//Job: adds walls
//Input: N/A
//Output:N/A
/////////////////////////////////
function createWalls(){
	topW = new Sprite(width/2, -45, width+200, 100, 's');
	botW = new Sprite(width/2, height+45, width+200, 100, 's');
	rightW = new Sprite(width+45, height/2, 100, height, 's');
	leftW = new Sprite(-45, (height/2), 100, height, 's');
	walls.add(rightW);
	walls.add(topW);
	walls.add(botW);
	walls.add(leftW);
}

///////////////////////////////////
//Name:createStartMenuUi()
//When: start()
//Job: add start menu buttons and instructions and adds to array
//Input: N/A
//Output:N/A
/////////////////////////////////
function createStartMenuUi(){
	startButton = new Sprite(width/2, height/3, 400, 80, 's');
	startButton.textSize = 45;
	startButton.text = "Walk here to start";
	startButton.color = 'orange';

	for(let i = 0; i < gunList.length; i++){
		new weaponSelectButon(i)
	}
	gunStand = new Sprite(width/2, height/10, 400, 100, 'n');
	gunStand.textSize = 70;
	gunStand.text = gunType.get("name");
	gunStand.color = 'orange';

	controlsTitle1 = new Sprite (width/5, height/2 - 200, 500, 100, 'n');
	controlsTitle1.textSize = 20;
	controlsTitle1.text = "To move use WASD";
	controlsTitle1.color = 'white';
	
	controlsTitle2 = new Sprite (width/5, height/2, 500, 100, 'n');
	controlsTitle2.textSize = 20;
	controlsTitle2.text = "Move the mouse to aim and click to shoot";
	controlsTitle2.color = 'white';

	controlsTitle3 = new Sprite (width/5, height/2 + 200, 500, 100, 'n');
	controlsTitle3.textSize = 20;
	controlsTitle3.text = "Shoot the Blobs before they get too you";
	controlsTitle3.color = 'white';

	instrucTitle1 = new Sprite (width - width/5, height/2 - 200, 500, 100, 'n');
	instrucTitle1.textSize = 20;
	instrucTitle1.text = "The blobs drop Xp that you can pick up to level up";
	instrucTitle1.color = 'white';

	instrucTitle2 = new Sprite (width - width/5, height/2, 500, 100, 'n');
	instrucTitle2.textSize = 20;
	instrucTitle2.text = "When you level up some of your stats will be improved";
	instrucTitle2.color = 'white';

	instrucTitle3 = new Sprite (width - width/5, height/2 + 200, 500, 100, 'n');
	instrucTitle3.textSize = 20;
	instrucTitle3.text = "Walk over the tiles below to select your wepon";
	instrucTitle3.color = 'white';

	UiArray.push(controlsTitle1);
	UiArray.push(controlsTitle2);
	UiArray.push(controlsTitle3);
	UiArray.push(instrucTitle1);
	UiArray.push(instrucTitle2);
	UiArray.push(instrucTitle3);

	UiArray.push(gunStand);
	UiArray.push(startButton);
}

///////////////////////////////////
//Name:spawnGameOverUi()
//When: pleyer.death
//Job: spawns death screen(score, restart sprite, gameover title)
//Input: N/A
//Output:N/A
/////////////////////////////////
async function spawnGameOverUi(){

	gameOverTitle = new Sprite(player.sprite.x, (player.sprite.y - height/5), 250, 100, 'n')
	gameOverTitle.image = (gameOverImg);
	gameOverImg.resize(gameOverTitle.width, gameOverTitle.height);

	restartButton = new Sprite(player.sprite.x + width/3, player.sprite.y, 450, 100, 'n')
	restartButton.textSize = 45;
	restartButton.text = "Press 'r' to restart";

	scoreSprite = new Sprite(player.sprite.x  - width/3, player.sprite.y, 300, 100, 'n')
	scoreSprite.textSize = 50;
	scoreSprite.text = "Score: " + player.getScore();

	UiArray.push(gameOverTitle);
	UiArray.push(restartButton);
	UiArray.push(scoreSprite);

	fb_readRecords("/gameList/bd/scores/" + userDetails.uid).then((snapshot) => {
		if (snapshot.val() <= player.getScore()){
			fb_writeRecords("/gameList/bd/scores/" + userDetails.uid, player.getScore())
		} 
	})
}

///////////////////////////////////
//Name:spawnGameUi()
//When: startGame()
//Job: spawns Xp bar/border and healthCounters
//Input: N/A
//Output:N/A
/////////////////////////////////
function spawnGameUi(){
	for (let i = 0; i < player.getHealth(); i++){
		spritePlaceHolder = new Sprite((35*i) + 30 + -width/2 + player.sprite.x, height/2 + player.sprite.y - 30, 20, 30, 'n')
		livesSprites.push(spritePlaceHolder);
		
	}

	xpBarBoarder = new Sprite(width/2, 50, 650, 70, 'n')
	xpBarBoarder.color = 'grey'
	xpBarBar = new Sprite(width/2, 50, xpBarBoarder.width *0.9, xpBarBoarder.height*0.9, 'n')
	xpBarBar.color = 'orange'
	xpBarBar.opacity = 0;
}

///////////////////////////////////
//Name: moveUi)()
//When: draw() {	(gameState == "play"){
//Job: sets ui elment to correct location relative to player
//Input: N/A
//Output:N/A
/////////////////////////////////
function moveUi(){
	livesSprites.forEach(sprite =>{
		sprite.x =(35*livesSprites.indexOf(sprite)) + 30 + -width/2 + player.sprite.x;
		sprite.y = height/2 + player.sprite.y - 30, 20, 30;
	});
	xpBarBoarder.y = -height/2 + player.sprite.y + 50;
	xpBarBoarder.x = player.sprite.x;
	xpBarBar.y = -height/2 + player.sprite.y + 50;
	xpBarBar.x = player.sprite.x;
}

///////////////////////////////////
//Name: spawnEnemy
//When: draw() {  (gameState == "play"){ ((enemySpawnTimer%150 == 0){ ||| (kb.pressed('z')){)
//Job: get a enemy from inActive array and Enemy.spawn
//Input: N/A
//Output:N/A
/////////////////////////////////
function spawnEnemy(){        
	if(inactiveEnemies.length > 0){
		let enemy = inactiveEnemies.shift();
		activeEnemies.push(enemy);
		enemy.spawn(BASICENEMY);
	}
}
///////////////////////////////////
//Name: spawnOrb()
//When: Enemy.death
//Job: gets a orb from inActive array and Orb.spawn
//Input: x and y pos & how much xp
//Output:N/A
/////////////////////////////////
function spawnOrb(x, y, amount){
	let orb = inactiveOrbs.shift();
	activeOrbs.push(orb); 
	orb.spawn(x, y, amount);
}

///////////////////////////////////
//Name: spawnBullet()
//When: shoot()
//Job: gets a bullet from inActive array and Bullet.spawn
//Input: N/A
//Output:N/A
/////////////////////////////////
function spawnBullet(){
	if(inactiveBullets.length > 0){
		let bullet = inactiveBullets.shift(); 
		activeBullets.push(bullet);
		bullet.spawn();
	}
}


//////////////////////////////////////////Classes//////////////////////////////////
class Enemy{
	sprite; 
	health;
	Type;
	speedNum = 8;
	rotSpeed = 0.02;
	constructor(){
		print("enemy spawn");
	}
	move() {
		this.sprite.rotateTowards(player.sprite, this.rotSpeed);
		this.sprite.direction = this.sprite.rotation; 
		this.sprite.speed = this.speedNum;
	}
	spawn(enemyType){
		this.Type = enemyType;
		this.sprite = new Sprite(player.getSprite().x-50 + -width/2 +(width + 100)* Math.floor(random(0, 2)), player.getSprite().y-50 + -height/2 +(height + 100)* Math.floor(random(0, 2)), 45, 'd');
		this.sprite.image = (enemySprite)
		this.sprite.image.rotation = 180;
		enemySprite.resize(this.sprite.width, this.sprite.height);
		this.sprite.rotation = random(0, 360)
		
		
		this.health = this.Type.get("health");
	}
	hit(damageTaken){
		this.health += -damageTaken
		if(this.health <= 0){
			this.death();
		}
	} 
	death(){
		player.scoreCount();
		spawnOrb(this.sprite.x, this.sprite.y, this.Type.get("xpAmount"))
		activeEnemies.splice(activeEnemies.indexOf(this), 1);
		inactiveEnemies.push(this);
		this.sprite.remove();
	}
	getSprite(){return this.sprite}
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
class Orb{
	sprite; 
	XpAmount;
	constructor(){ 
	}
	spawn(x, y, amount){ 
		this.XpAmount = amount;
		this.sprite = new Sprite(x, y, this.XpAmount*2, 'n');
		this.sprite.image = (orbSprite)
		orbSprite.resize(this.sprite.width, this.sprite.height);
	}

	death(){
	activeOrbs.splice(activeOrbs.indexOf(this), 1);
	inactiveOrbs.push(this)
	this.sprite.remove();}
	
	getSprite(){return this.sprite;}
	getdamage(){return this.XpAmount}
	getXp(){return this.XpAmount}
}
	
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
class Player{
	isIFrames = false;
	score = 0;
	PLAYERMAXSPEED = 16;
	MOVERES = 0.9;
    LEVELUPTHRESHHOLD = 100
	sprite; 
	xp = 0;
	levelMult = 1;
	health = 3;
	constructor(){ 
		this.sprite = new Sprite(width/2.5, height/2, 40, 'd');
		this.sprite.image = (playerSprite)
		playerSprite.resize(this.sprite.width - 2, this.sprite.height  - 2);
		this.sprite.rotationLock = true;
		this.sprite.friction = 0;
		playerGroup.add(this.sprite);
	}
	setCenter(){
		this.sprite.y = height/2;
		this.sprite.x = width/2;
	}
	gainXp (xpAmount){
		this.xp += xpAmount;
		if (this.xp <= this.LEVELUPTHRESHHOLD){
			xpBarBar.scale.x = this.xp/ this.LEVELUPTHRESHHOLD;
		} else {
			xpBarBar.scale = 1
		}

		xpBarBar.opacity = 1;
		if (this.xp >= this.LEVELUPTHRESHHOLD){
			this.levelup();
		}
	}
	levelup(){
		this.levelMult = this.levelMult*1.5;
		this.xp += - this.LEVELUPTHRESHHOLD;
	}
	hit(){
		this.peirce += -1;
		if(this.peirce == 0){
			this.death();
		}
	}
	move(){
		if (kb.pressing('right')){
			playerGroup.vel.x = (this.PLAYERMAXSPEED-playerGroup.vel.x)*0.1+playerGroup.vel.x;
		} 
		if (kb.pressing('left')){
			playerGroup.vel.x = ((this.PLAYERMAXSPEED*-1)-playerGroup.vel.x)*0.1+playerGroup.vel.x;
		} 
		if (kb.pressing('down')){
			playerGroup.vel.y = (this.PLAYERMAXSPEED-playerGroup.vel.y)*0.1+playerGroup.vel.y;
		} 	
		if (kb.pressing('up')){
			playerGroup.vel.y = ((this.PLAYERMAXSPEED*-1)-playerGroup.vel.y)*0.1+playerGroup.vel.y;
		} 

		if (this.sprite.vel.x >= 1){
			this.sprite.scale.x = -1;
		} 
		if (this.sprite.vel.x <= -1){
			this.sprite.scale.x = 1;
		}
		

		playerGroup.vel.x = this.MOVERES*playerGroup.vel.x
		playerGroup.vel.y = this.MOVERES*playerGroup.vel.y
	}
	takeDamage(){
		if (this.isIFrames == false){	
			this.health += -1;
			if(this.health >= 1){
				this.isIFrames = true;
				showPlayerLives(); 
			} else {
			this.death();
		}
	}
	}
	death(){
		gameState = "gameOver";
		playerGroup.vel.x = 0;
		playerGroup.vel.y = 0;
	
		xpBarBar.remove();
		xpBarBoarder.remove();
		
		spawnGameOverUi();
		showPlayerLives(); 
	}
	getSprite(){return this.sprite;}
	getScore(){return this.score;}
	getHealth(){return this.health;}
	setHealth(hp){this.health = hp;}
	scoreCount(){this.score ++}
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
class Bullet{
	colour = 'yellow';
	sprite; 
	damage;
	peirce;
	MAXBULLETSPEED = 80;
	constructor(){ 
		this.color = 'red'
	}
	spawn(){
		this.sprite = new Sprite(gun.x, gun.y, gunType.get("size"), 'n');
		this.sprite.color = this.colour
		this.damage = gunType.get("damage") * player.levelMult;
		this.peirce = gunType.get("peirce") * player.levelMult;
		this.sprite.speed = gunType.get("speed")
		this.sprite.direction = gun.rotation-90 + (gunType.get("spread")* random(-1, 1))
	}
	hit(){
		this.peirce += -1;
		if(this.peirce == 0){
			this.death();
		}
	}
	death(){
		activeBullets.splice(activeBullets.indexOf(this), 1);
		inactiveBullets.push(this)
		this.sprite.remove();
	}
	getSprite(){return this.sprite;}
	getdamage(){return this.damage}
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
class weaponSelectButon{
	gun;
	sprite;
	constructor(gunType){
		this.gun = gunList[gunType];
		this.sprite = new Sprite((gunList.indexOf(this.gun)+1)*(width/(gunList.length + 1)), height - 90, 150, 50, 'n');
		this.sprite.text = this.gun.get("name");
		this.sprite.color = 'grey';
		weaponSelectionButtons.push(this);
	}
	death(){this.sprite.remove();}
	getGun(){return this.gun}
	getSprite(){return this.sprite;}
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
class BgTiles{
	sprite;
	int = 400;
	constructor(column, row){
		this.sprite = new Sprite((column - 10) * this.int, (row - 10) * this.int, this.int, this.int, 'n');
		this.sprite.image = (bg);
		this.sprite.image.resize(this.int, this.int);
	}
	death(){this.sprite.remove();}
	getGun(){return this.gun}
	getSprite(){return this.sprite;}
}

/**************************************************************/
// html_listen4Debug()
// Register keyboard keydown event
// To check if user wants sprite debug mode OR not
//  Hit ctrl-z to turn debug mode on
//  Hti ctrl-x to turn debug mode off
// Input:  n/a
// Return: n/a
/**************************************************************/
function html_listen4Debug() {
    document.addEventListener('keydown', function(event) {
      if (event.key === '7') {
        // To slow the frame rate down to 1 frame/sec
        frameRate(1);
      }

	  if (event.key === '8') {
        // Place debug code here ***************************
        // EG to set debug mode for all sprites 
        allSprites.debug = true; 
      }

      else if (event.key === '9') {
        allSprites.debug = false; 
        frameRate(60);
      }
    });
  }

  window.preload = preload;
  window.setup = setup;
  window.draw = draw;
/*******************************************************/
//  END OF Program
/*******************************************************/
