var story = [
	new Story("Prologue", "prol", "This is the prologue"),
	new Story("Base of the Knoll", "grass", "You have reached the base of the knoll."),
	new Story("Knoll Crest", "grass", "You've crested the knoll.")
]; //holds story parts
var storyLis = [
	"<li class='tab col s2'><a href='#prol'>Prologue</a></li><li class='tab col s2'><a href='#grass'>Grassy Knoll</a></li>"
]; //holds lis for story tabs
var partIds = [
	"prol",
	"grass"
];

function Story(title, partition, content){
	this.title = title;
	this.partition = partition;
	this.content = content;
	this.unlocked = false;
}

function loadStory(partsLoaded){
	$('#story').html("<ul id='tabshere' class='tabs'></ul><div id='partshere'></div>");
	for(i = 0; i < liLoaded; i++){
		$('#tabshere').append(storyLis[i]);
		$('#partshere').append("<div class='tab-pane' id='" + partIds[i] + "'></div>");
		console.log("li appended");
	}
	for(n = 0; n < partsLoaded; n++){
		let thisPart = story[n];
		$('#partshere > #'+thisPart.partition).append(
			"<h4><strong>" + thisPart.title + "</strong></h4>" +
			"<p>" + thisPart.content + "</p>"
		);
		console.log("part appended");
	}
	initTabs();
}
