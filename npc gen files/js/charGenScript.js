/* AJAX & Resource Variables */
const ajax = {
	get(resourceAddress, responseHandler) {
		let xhr = new XMLHttpRequest();
		xhr.onload = function() { 
			if (xhr.status === 200) {
				responseHandler(xhr.responseText);
			}
			else {
				responseHandler("Error code " + xhr.status + ", ajax request failed");
			}
		}
		xhr.open('GET', resourceAddress, true);
		xhr.send(null);
	}
};
{ // Name variables
	var norrænMaleFirstNames;
	var norrænMaleLastNames;
	var norrænFemaleFirstNames;
	var norrænFemaleLastNames;
}
{// NPC type variables
	var specificCommoners;
}

{/* NPC characterisation variables */
	var appearanceCsvTables = new Array(6);
	var ambitionCsvTables = new Array(6);
	var friendshipsCsvTables = new Array(6);
	var tragediesCsvTables = new Array(6);
	var romancesCsvTables = new Array(6);
}

// Populate variables with csv data
document.addEventListener("DOMContentLoaded",
	function (event) {
		// Character Names
		ajax.get("csv/Names/norræn female first names.csv", function(responseText){norrænFemaleFirstNames = responseText;});
		ajax.get("csv/Names/norræn female last names.csv", function(responseText){norrænFemaleLastNames = responseText;});
		ajax.get("csv/Names/norræn male first names.csv", function(responseText){norrænMaleFirstNames = responseText;});
		ajax.get("csv/Names/norræn male last names.csv", function(responseText){norrænMaleLastNames = responseText;});

		// Character Types
		ajax.get("csv/NPC Types/Commoners.csv", function(responseText){specificCommoners = responseText;});
		
		// Characterisation
		{// Appearances & Mannerisms
			let appearanceAddresses = [
				"csv/Characterisation/Appearance/General Physical Build.csv",
				"csv/Characterisation/Appearance/The Way They Move.csv",
				"csv/Characterisation/Appearance/Clothing Idiosyncrasies.csv",
				"csv/Characterisation/Appearance/The First Thing Noticed.csv",
				"csv/Characterisation/Appearance/One Way They Differ From Expectations.csv",
				"csv/Characterisation/Appearance/Visible Mannerisms or Traits.csv"
			];
			for (let index in appearanceAddresses)
			{
				ajax.get(appearanceAddresses[index], function(responseText){appearanceCsvTables[index] = responseText});
			}
		}
		{// Ambition
			let ambitionAddresses = [
				"csv/Characterisation/Ambition/When Was the Ambition Sparked.csv",
				"csv/Characterisation/Ambition/Who Knows or Has Been Involved in It.csv",
				"csv/Characterisation/Ambition/What Tools Are Used to Advance It.csv",
				"csv/Characterisation/Ambition/What’s the Basic Ambition’s Form.csv",
				"csv/Characterisation/Ambition/What’s the Biggest Immediate Obstacle.csv",
				"csv/Characterisation/Ambition/Things to Help or Hinder the Ambition.csv"
			];
			for (let index in ambitionAddresses)
			{
				ajax.get(ambitionAddresses[index], function(responseText){ambitionCsvTables[index] = responseText});
			}
		}
		{// Friendships
			let friendshipsAddresses = [
				"csv/Characterisation/Close Friendships/How Old is the Relationship.csv",
				"csv/Characterisation/Close Friendships/How Did They Meet.csv",
				"csv/Characterisation/Close Friendships/What Have They Done Together.csv",
				"csv/Characterisation/Close Friendships/What Tie Harmonizes Their Differences.csv",
				"csv/Characterisation/Close Friendships/What Threatens to Divide Them.csv",
				"csv/Characterisation/Close Friendships/Things Between Friends.csv"
			];
			for (let index in friendshipsAddresses)
			{
				ajax.get(friendshipsAddresses[index], function(responseText){friendshipsCsvTables[index] = responseText});
			}
		}
		{// Tragedies
			let tragediesAddresses = [
				"csv/Characterisation/Personal Tragedies/When Did It Happen.csv",
				"csv/Characterisation/Personal Tragedies/What Was Their Responsibility For It.csv",
				"csv/Characterisation/Personal Tragedies/How Did They Try to Cope With It.csv",
				"csv/Characterisation/Personal Tragedies/What Was Its Basic Form.csv",
				"csv/Characterisation/Personal Tragedies/What Ugly Consequences Followed.csv",
				"csv/Characterisation/Personal Tragedies/What Scars Do They Have From It.csv"
			];
			for (let index in tragediesAddresses)
			{
				ajax.get(tragediesAddresses[index], function(responseText){tragediesCsvTables[index] = responseText});
			}
		}
		{// Romances
			let romancesAddresses = [
				"csv/Characterisation/Troubled Romances/Past Length of the Relationship.csv",
				"csv/Characterisation/Troubled Romances/How Did They Meet.csv",
				"csv/Characterisation/Troubled Romances/What Sparked the Romance.csv",
				"csv/Characterisation/Troubled Romances/What Problem Does One or Both Have.csv",
				"csv/Characterisation/Troubled Romances/What’s the Current Issue They Face.csv",
				"csv/Characterisation/Troubled Romances/Quirks or Traits of the Relationship.csv"
			];
			for (let index in romancesAddresses)
			{
				ajax.get(romancesAddresses[index], function(responseText){romancesCsvTables[index] = responseText});
			}
		}
	}
);
/* Close AJAX & Resource Variables */

const diceRoller = {
	roll(numOfDice, numOfSides) {
		let result = 0;
		for (;numOfDice > 0; numOfDice--) {
			result += Math.ceil(Math.random() * numOfSides);
		}
		return result;
	},
	rollOnTable(table) { // This function expects a specific format seen in "npc gen files/csv/csv format example.csv"
		// Convert table into 2-d array
			// Split by newline to create array of rows
			table = table.split("\r\n");
			// Split each row at the location of its first comma, to create columns
			for (let i = 0; i < table.length; i++) {
				let commaIndex = table[i].indexOf(",");
				let firstCell = table[i].substring(0, commaIndex);
				let secondCell = table[i].substring(commaIndex + 1);
				table[i] = [firstCell, secondCell];
			}
		// Read which dice to roll
		let dice = this.readDice(table[0][0]);

		// Roll dice
		let diceRoll = this.roll(dice.numOfDice, dice.numOfSides);

		// Lookup value on table
		let result = this.lookupValueOnTable(diceRoll, table);

		// Return corresponding result
		return result;
	},
	readDice(dice) {
		console.log("reading dice...");
		dice = dice.split("d");
		if (dice[0] === "") dice[0] = 1;

		return {
			numOfDice: dice[0],
			numOfSides: dice[1]
		};
	},
	lookupValueOnTable(diceRoll, table) { // Simple version, which finds the number but can't handle ranges like 5-8
		let value = "";
		for (let i = 0; i < table.length; i++) {
			if (table[i][0] == diceRoll) {
				return table[i][1];
			}
		}
		return value;
	}
};

const diceRollerTester = {
	testDrive() {
		console.log(appearanceCsvTables);
		// let result = diceRoller.rollOnTable(norrænMaleFirstNames);
		let number = 429;
		let table = norrænMaleFirstNames;

		// Convert table into 2-d array
			// Split by newline to create array of rows
			table = table.split("\r\n");
			// Split each row at the location of its first comma, to create columns
			for (let i = 0; i < table.length; i++) {
				let commaIndex = table[i].indexOf(",");
				let firstCell = table[i].substring(0, commaIndex);
				let secondCell = table[i].substring(commaIndex + 1);
				table[i] = [firstCell, secondCell];
			}

		let result = diceRoller.lookupValueOnTable(number, table);
		console.log("result: " + result);
	}
};

var character = {
	sex: "",
	descent: "",
	name: "",
};

var characterGenerator = {
	generateName() {
		// Gather parameters from form
		character.sex = document.querySelector("#sexField").value;
		character.descent = document.querySelector("#descentField").value;

		// Select which name table to roll on
		let nameTables = this.chooseNameTables(character.sex, character.descent);
		
		// Roll on the chosen table
		let firstName = diceRoller.rollOnTable(nameTables.firstNameTable);
		let lastName = diceRoller.rollOnTable(nameTables.lastNameTable);

		// Assign the result to the character object
		character.name = firstName + " " + lastName;

		// Display the character info
		document.querySelector("#characterNameField").innerHTML = character.name;
	},
	chooseNameTables(sex, descent) {
		let nameTables = {};
		switch(descent) {
			case "Norræn":
				nameTables.firstNameTable = (sex === "Male") ? norrænMaleFirstNames : norrænFemaleFirstNames;
				nameTables.lastNameTable = (sex === "Male") ? norrænMaleLastNames : norrænFemaleLastNames;
		}
		return nameTables;
	},
	generateAppearance() {
		this.generateSection(appearanceCsvTables, "#characterAppearaceField");
	},
	generateAmbition() {
		this.generateSection(ambitionCsvTables, "#characterAmbitionField");
	},
	generateFriendships() {
		this.generateSection(friendshipsCsvTables, "#characterFriendshipsField");
	},
	generateTragedies() {
		this.generateSection(tragediesCsvTables, "#characterTragediesField");
	},
	generateRomances() {
		this.generateSection(romancesCsvTables, "#characterRomancesField");
	},
	generateSection(tablesVariable, querySelector) {
		// Roll for results
		let results = new Array(6);
		for (let index in tablesVariable) {
			results[index] = diceRoller.rollOnTable(tablesVariable[index]);
		}
		// Build appearanceHtml
		let appearanceHtml = this.buildCharacterSectionHtml(tablesVariable, results);
		// Display appearanceHtml
		document.querySelector(querySelector).innerHTML = appearanceHtml;
	},
	buildCharacterSectionHtml(tables, values) {
		let html = "";
		for (let index in values) {
			let tableTitle = this.getTableTitle(tables[index]);
			let tableResult = values[index];
			html += `
			<p><i>${tableTitle}</i></p>
			<p>${tableResult}</p>
			<br>`;
		}
		return html;
	},
	getTableTitle(table) {
		return table.substring(
			table.indexOf(",") + 1,
			table.indexOf("\r\n")
		);
	}
}