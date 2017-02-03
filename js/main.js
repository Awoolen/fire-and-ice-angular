/* Welcome to Fire and Ice! This will probably be a big mess of a file! Yay for code! 

	WHOA MY GOSH I'M USING COOKIES! Never done this before! I don't know what I'm doing at all!
	
	EDIT: Aaaand nooooow, using... *drumroll* ...localStorage! Which is actually 10x more simple than I thought it would be!
*/
/*************************************
	VARIABLE DECLARATIONS 'CAUSE SCOPE
**************************************/
var newGame = checkNewGame(); //checks whether or not to reset the localStorage
var currentChar = null; //global variable for player's character
var maxHealth = 100;//default in case things go wrong with the localStorage
var maxMana = 30;
var exp = 0;
var currHealthRate = 10;
var currManaRate = 5;
var resting = false; // checks whether player is currently resting
var slot = 0; //sets slot for data grabbing and stuff
var fireEnemies = [
	new Enemy("Dragon Scout", 150, 10, 20, 1),
	new Enemy("Dragon Novice", 175, 15, 23, 2)
];//list of enemies of the Ice Masters
var iceEnemies = [
	new Enemy("Frost Scout", 150, 10, 20, 1),
	new Enemy("Frost Novice", 175, 15, 23, 2)
];//list of enemies of the Dragons
var enemies = [];//empty enemy list, filled during setup
var enemy; //holds current enemy
var story = [
	"Part1",
	"part2",
	"part3"
]; //holds story parts
var storyLis = [
	"<li>1</li>"
]; //holds lis for story tabs
var inventory = [];
var potion_types = [
	"health", //gives HP
	"strength", //boosts strength stat
	"magic" //gives mana
];//holds potion list for dropping

/**************************************
	CONSTRUCTORS
***************************************/
function Character(name, gender, age, species, fireOrIce){
	//TODO: work out stats based on species and age
	this.name = name;
	this.gender = gender;
	this.age = age;
	this.species = species;
	this.fireOrIce = fireOrIce;
	this.strength = 20; //helps base damage
	this.agility = 20; //helps dodge attacks
	this.defence = 20; //helps block attacks
	this.intelligence = 20; //gives more mana and spell damage
	this.wisdom = 20; //increases all stats
	this.mana = 30;
	this.health = 100;
	this.experience = 0;
	this.level = 1;
	this.story = 1;
}

function Enemy(name, health, min, max, level){
	this.name = name;
	this.health = health;
	this.minDamage = min;
	this.maxDamage = max;
	this.level = level;
	this.numKilled = 0; //decides when you can leave an area
}

/**************************************
	MAIN METHODS
***************************************/
function initGame(){
	//set up vars and things
	if(newGame){
		//set up local storage
		setData("slot1", null); 
		setData("slot2", null); 
		setData("slot3", null); 
		setData("slot4", null); 
		setData("newGame", false); 
	}
	
	checkSlots();
	
}

function createChar(){
	var name = $('#name').val();
	var age = $('#age').val();
	var gender = $('input[name="gender"]:checked').val();
	var species = $('#species').val();
	var fireice = $('input[name="fireice"]:checked').val();
	
	currentChar = new Character(name, gender, age, species, fireice);
	
	slot = getQueryVariable("slot");
	
		
	setData("slot" + slot, JSON.stringify(currentChar));
	
	
	location.href = "play.html?slot=" + slot;
	
	return false;
	
}

function setUp(){
	slot = getQueryVariable("slot");
	currentChar = JSON.parse(getData("slot" + slot));
	$('#name').html(currentChar.name);
	var info = currentChar.age + " year-old " + currentChar.species;
	$('#pInfo').html(info);
	exp = currentChar.experience;
	var maxExp = parseInt($('#exp').attr("aria-valuemax"));
	var percent = 100 * (exp/maxExp);
	$('#exp').attr("style", "width: " + percent + "%;");
	$('.exp').attr("data-tooltip", "" + exp + "/" + maxExp);
	
	maxHealth = currentChar.health;
	$('#health').attr("aria-valuemax", maxHealth);
	upHealth(maxHealth);
	maxMana = currentChar.mana;
	$('#mana').attr("aria-valuemax", maxMana);
	upMana(maxMana);
	if(currentChar.fireOrIce == "Fire")
		enemies = iceEnemies;
	else
		enemies = fireEnemies;
	
	setEnemy();
}

function rest(){
	// Solution from: http://stackoverflow.com/a/1495907/6447865

	// added check to avoid multiple resting "timers"
	if (!resting) {
		timeoutID = setInterval(function () {
			resting = true;
			upHealth(currHealthRate);

	        if($('#health').attr("aria-valuenow") >= maxHealth){
				console.log("done resting");
				$('#health').attr("aria-valuenow", maxHealth);
				resting = false;
				clearInterval(timeoutID);
			}
	    }, 2000);
	}
}

function fight(){
	if($('#enemyH').attr("aria-valuenow") < enemy.health)
		$('#rest').addClass('disabled');
	var damage = currentChar.strength + currentChar.agility/2;
	downEHealth(damage);
	log("You struck the " + enemy.name + " for " + damage + " damage.");
	if($('#enemyH').attr("aria-valuenow") < 1){
		log("You defeated the " + enemy.name + "!");
		addExp();
		clearLog();
		setEnemy();
	}
	else{
		var damageT = random(enemy.minDamage, enemy.maxDamage);
		downHealth(damageT);
		log("The " + enemy.name + " struck you for " + damageT + " damage.");
		if($('#health').attr("aria-valuenow") < 1){
			log("You have been terribly wounded. Neandra spends " + random(10, 70) + " of her mana to heal you. You must rest.");
			lowerExp();
			rest();
			clearLog();
			setEnemy();
		}
	}
}

function story(partsLoaded){
	for(var i = 0; i < partsLoaded; i++){
		if(i%5 == 0){
			//load new ul
		}
		//load story part
	}
}



/**************************************
	HELPER METHODS
***************************************/

//A lot of these methods are potentially unnecessary, but they make the code more readable for me, at least

function upHealth(num){
	$('#health').attr("aria-valuenow", function(i, origValue){
		return parseInt(origValue) + num;
	});
	var currentNum = parseInt($('#health').attr("aria-valuenow"));
	var maxNum = parseInt($('#health').attr("aria-valuemax"));
	var percent = 100 * (currentNum/maxNum);
	$('#health').attr("style", "width: " + percent + "%;");
	$('.health').attr("data-tooltip", "" + currentNum + "/" + maxNum);
	initTooltip();
}

function upMana(num){
	$('#mana').attr("aria-valuenow", function(i, origValue){
		return parseInt(origValue) + num;
	});
	var currentNum = parseInt($('#mana').attr("aria-valuenow"));
	var maxNum = parseInt($('#mana').attr("aria-valuemax"));
	var percent = 100 * (currentNum/maxNum);
	$('#mana').attr("style", "width: " + percent + "%;");
	$('.mana').attr("data-tooltip", "" + currentNum + "/" + maxNum);
	initTooltip();
}

function downHealth(num){
	$('#health').attr("aria-valuenow", function(i, origValue){
		return parseInt(origValue) - num;
	});
	var currentNum = parseInt($('#health').attr("aria-valuenow"));
	var maxNum = parseInt($('#health').attr("aria-valuemax"));
	var percent = 100 * (currentNum/maxNum);
	$('#health').attr("style", "width: " + percent + "%;");
	$('.health').attr("data-tooltip", "" + currentNum + "/" + maxNum);
	initTooltip();
}

function downMana(num){
	$('#mana').attr("aria-valuenow", function(i, origValue){
		return parseInt(origValue) - num;
	});
	var maxNum = parseInt($('#mana').attr("aria-valuemax"));
	var percent = 100 * (currentNum/maxNum);
	$('#mana').attr("style", "width: " + percent + "%;");
	$('.mana').attr("data-tooltip", "" + currentNum + "/" + maxNum);
	initTooltip();
}

function downEHealth(num){
	$('#enemyH').attr("aria-valuenow", function(i, origValue){
		return parseInt(origValue) - num;
	});
	var currentNum = parseInt($('#enemyH').attr("aria-valuenow"));
	var maxNum = parseInt($('#enemyH').attr("aria-valuemax"));
	var percent = 100 * (currentNum/maxNum);
	$('#enemyH').attr("style", "width: " + percent + "%;");
	$('.enemy').attr("data-tooltip", "" + currentNum + "/" + maxNum);
	initTooltip();
}

function checkNewGame(){
	if(getData("newGame") == "")
		return true;
	return false;
}

function checkSlots(){
	for(var i = 0; i < 4; i++)
		if(getData("slot" + i) != "")
			fillSlot(i+1);
}

function fillSlot(slot){
	var loadButton = "";
	if(JSON.parse(getData("slot" + slot)) == null){
		var player = "Slot " + slot + " Empty";
		loadButton = "<a class='load btn' href='createChar.html?slot=" + slot + "'>New Player</a>";
	}
	else{
		var player = JSON.parse(getData("slot" + slot));
		player = player.name + "</br>Level: " + player.level;
	
	loadButton = "<a class='load btn' href='play.html?slot=" + slot + "'>Load Player</a>";
	}
	$('#slot'+slot).html("<td class='name'>" + player + "</td><td>" + loadButton + "</td>");
}

//from CSS-Tricks: https://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function backdoor(){
	var neandra = new Character("Neandra Amari", "Female", 12, "Kendrii", "Fire");
	neandra.strength = 100;
	neandra.agility = 100;
	neandra.intelligence = 100;
	neandra.defence = 100;
	neandra.mana = 300;
	neandra.health = 1000;
	neandra.level = 100;
	neandra.experience = 9999;
	setData("slotadmin", JSON.stringify(neandra));
	console.log("Admin player created");
	location.href = "play.html?slot=admin";
}

function random(min, max){
	var num = Math.floor((Math.random() * max) +  min);
	return num;
}

function setEnemy(){
	do{
		enemy = enemies[random(0, 1)];
	}while(enemy.level > currentChar.level);
	
	$('#enemyH').attr({
		"aria-valuenow" : enemy.health,
		"aria-valuemax" : enemy.health,
		"style" : "width: 100%;"
	});
	
	$('.enemy').attr("data-tooltip", "" + enemy.health + "/" + enemy.health);
	initTooltip();
	
	var stats = "<h4>" + enemy.name + "</h4>\nStrength: " + enemy.minDamage + "-" + enemy.maxDamage + "\nKilled: " + enemy.numKilled;
	
	$('#eInfo').html(stats);
	
}

function log(message){	
	$('.log .card-content > p:nth-child(2)').before("<p>" + message + "</p>");
	console.log(message);
}

function clearLog(){
	$('.log .card-content p').remove();
}

function toast(message){
	Materialize.toast(message, 4000);
}

function addExp(enemyLevel){
	/*currentChar.experience+=(enemyLevel*0.1);
	//if experience is a certain level, level up
	if(currentChar.experience >= 300+((level + enemyLevel) * 80)){
	  levelUp();
	  currentChar.experience = 0;
	}*/
	var currentNum = currentChar.experience;
	var maxNum = parseInt($('#exp').attr("aria-valuemax"));
	var percent = 100 * (currentNum/maxNum);
	$('#exp').attr("style", "width: " + percent + "%;");
	$('.exp').attr("data-tooltip", "" + currentNum + "/" + maxNum);
	initTooltip();
}

function lowerExp(){
	/*currentChar.experience-=(level*0.05);
	//don't let experience be less than 0
	if(currentChar.experience < 0){
	  currentChar.experience = 0;
	}*/
	var currentNum = currentChar.experience;
	var maxNum = parseInt($('#exp').attr("aria-valuemax"));
	var percent = 100 * (currentNum/maxNum);
	$('#exp').attr("style", "width: " + percent + "%;");
	$('.exp').attr("data-tooltip", "" + currentNum + "/" + maxNum);
	initTooltip();
}

function levelUp(){
  currentChar.level++;
  refactorStats();
  //toast levelup
  toast("Levelled up to level " + currentChar.level);
}

function refactorStats(){
  //not a priority until the interface is fixed
 /* currentChar.intelligence = intBaseLevel + (level*0.2) + intMulti;
  currentChar.wisdom = wisBaseLevel + (level*0.5) + wisMulti;
  currentChar.strength = strBaseLevel + (level*0.3) + strMulti;
  currentChar.agility = agilBaseLevel + (level * )*/
  console.log('Stats refactored.');
}

function initTooltip(){
    $('.tooltipped').tooltip();
}