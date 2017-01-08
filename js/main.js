/* Welcome to Fire and Ice! This will probably be a big mess of a file! Yay for code! 

	WHOA MY GOSH I'M USING COOKIES! Never done this before! I don't know what I'm doing at all!
*/
/*************************************
	VARIABLE DECLARATIONS 'CAUSE SCOPE
**************************************/
var newGame = checkNewGame(); //checks whether or not to reset the cookies
var currentChar = null; //global variable for player's character
var maxHealth = 100;//default in case things go wrong with the cookies
var maxMana = 30;
var currHealthRate = 10;
var currManaRate = 5;
var slot = 0; //sets slot for cookie grabbing and stuff
var fireEnemies = [
	new Enemy("Dragon Scout", 150, 10, 20, 1)
];//list of enemies of the Ice Masters
var iceEnemies = [
	new Enemy("Frost Scout", 150, 10, 20, 1)
];//list of enemies of the Dragons
var enemies = [];//empty enemy list, filled during setup
var enemy; //holds current enemy

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
	this.strength = 20;
	this.agility = 20;
	this.defence = 20;
	this.intelligence = 20;
	this.mana = 30;
	this.health = 100;
	this.experience = 0;
	this.level = 1;
}

function Enemy(name, health, min, max, level){
	this.name = name;
	this.health = health;
	this.minDamage = min;
	this.maxDamage = max;
	this.level = level;
	this.numKilled = 0;
}

/**************************************
	MAIN METHODS
***************************************/
function initGame(){
	//set up vars and things
	if(newGame){
		//set up cookies
		createCookie("slot1", null, 365); 
		createCookie("slot1", null, 365); 
		createCookie("slot1", null, 365); 
		createCookie("slot1", null, 365); 
		createCookie("newGame", false, 365); 
	}
	
	checkSlots();
	
}

function createChar(){
	var name = $('#name').val();
	var age = $('#age').val();
	var gender = $('#gen:checked').val();
	var species = $('#species').val();
	var fireice = $('#fireice:checked').val();
	
	currentChar = new Character(name, gender, age, species, fireice);
	
	slot = getQueryVariable("slot");
	
		
	createCookie("slot" + slot, JSON.stringify(currentChar), 365);
	
	
	location.href = "play.html?slot=" + slot;
	
	return false;
	
}

function setUp(){
	slot = getQueryVariable("slot");
	currentChar = JSON.parse(getCookie("slot" + slot));
	$('#name').html(currentChar.name);
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
	var resting = true;
	while(resting){
		setTimeout(upHealth(currHealthRate), 2000);
		console.log("resting");
		if($('#health').attr("aria-valuenow") >= maxHealth){
			console.log("done resting");
			$('#health').attr("aria-valuenow", maxHealth);
			resting = false;
		}
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
		addStats();
		setEnemy();
	}
	else{
		var damageT = random(enemy.minDamage, enemy.maxDamage);
		downHealth(damageT);
		log("The " + enemy.name + " struck you for " + damageT + " damage.");
		if($('#health').attr("aria-valuenow") < 1){
			log("You have been terribly wounded. Neandra spends " + random(10, 70) + " of her mana to heal you. You must rest.");
			lowerStats();
			rest();
			setEnemy();
		}
	}
}



/**************************************
	HELPER METHODS
***************************************/

function upHealth(num){
	$('#health').attr("aria-valuenow", function(i, origValue){
		return parseInt(origValue) + num;
	});
	var currentNum = parseInt($('#health').attr("aria-valuenow"));
	var maxNum = parseInt($('#health').attr("aria-valuemax"));
	var percent = 100 * (currentNum/maxNum);
	$('#health').attr("style", "width: " + percent + "%;");
	$('#health').html("" + currentNum + "/" + maxNum);
}

function upMana(num){
	$('#mana').attr("aria-valuenow", function(i, origValue){
		return parseInt(origValue) + num;
	});
	var currentNum = parseInt($('#mana').attr("aria-valuenow"));
	var maxNum = parseInt($('#mana').attr("aria-valuemax"));
	var percent = 100 * (currentNum/maxNum);
	$('#mana').attr("style", "width: " + percent + "%;");
	$('#mana').html("" + currentNum + "/" + maxNum);
}

function downHealth(num){
	$('#health').attr("aria-valuenow", function(i, origValue){
		return parseInt(origValue) - num;
	});
	var currentNum = parseInt($('#health').attr("aria-valuenow"));
	var maxNum = parseInt($('#health').attr("aria-valuemax"));
	var percent = 100 * (currentNum/maxNum);
	$('#health').attr("style", "width: " + percent + "%;");
	$('#health').html("" + currentNum + "/" + maxNum);
}

function downMana(num){
	$('#mana').attr("aria-valuenow", function(i, origValue){
		return parseInt(origValue) - num;
	});
	var maxNum = parseInt($('#mana').attr("aria-valuemax"));
	var percent = 100 * (currentNum/maxNum);
	$('#mana').attr("style", "width: " + percent + "%;");
	$('#mana').html("" + currentNum + "/" + maxNum);
}

function downEHealth(num){
	$('#enemyH').attr("aria-valuenow", function(i, origValue){
		return parseInt(origValue) - num;
	});
	var currentNum = parseInt($('#enemyH').attr("aria-valuenow"));
	var maxNum = parseInt($('#enemyH').attr("aria-valuemax"));
	var percent = 100 * (currentNum/maxNum);
	$('#enemyH').attr("style", "width: " + percent + "%;");
	$('#enemyH').html("" + currentNum + "/" + maxNum);
}

function checkNewGame(){
	if(getCookie("newGame") == "")
		return true;
	return false;
}

function checkSlots(){
	for(var i = 0; i < 4; i++)
		if(getCookie("slot" + i) != "")
			fillSlot(i+1);
}

function fillSlot(slot){
	var loadButton = "";
	if(JSON.parse(getCookie("slot" + slot)) == null){
		var player = "Slot " + slot + " Empty";
		loadButton = "<a class='load btn' href='createChar.php?slot=" + slot + "'>New Player</a>";
	}
	else{
		var player = JSON.parse(getCookie("slot" + slot));
		player = player.name + " " + player.level;
	
	loadButton = "<a class='load btn' href='play.php?slot=" + slot + "'>Load Player</a>";
	}
	$('#slot'+slot).html("<td class='name'>" + player + "</td><td>" + loadButton + "</td>");
}

//from CSS-Tricks: https://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable)
{
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
	createCookie("slotadmin", JSON.stringify(neandra), 365);
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
	
	$('#enemyH').html("" + enemy.health + "/" + enemy.health);
	
	var stats = "<h4>" + enemy.name + "</h4>\nStrength: " + enemy.minDamage + "-" + enemy.maxDamage + "\nKilled: " + enemy.numKilled;
	
	$('#eInfo').html(stats);
	
}

function log(message){
	$('.log').append("<p>" + message + "</p>");
	console.log(message);
}

function addStats(){
	//TODO: work out stat multipliers
	currentChar.strength++;
	currentChar.agility++;
	currentChar.defence++;
	currentChar.intelligence++;
	currentChar.experience++;
	//if experience is a certain level, level up
}

function lowerStats(){
	//TODO: work out stat multipliers
	currentChar.strength--;
	currentChar.agility--;
	currentChar.defence--;
	currentChar.intelligence--;
	currentChar.experience--;
	//do something or other
}
