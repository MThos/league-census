/*
 * @program:	    champion.js
 * @description:  Java API calls for LEAGUECENSUS.COM from League of Legends Official API
 *                loadChampionList() - load list of champions in table from static API.
 *                resetElements() - empty out elements.
 *                fixChampionNames() - change champion names to naming used for Data Dragon.
 *                loadChampionData() - once champion selected, load information about that champion.
 * @author:       Mykel Agathos
 * @date:         Jan 04, 2016
 * @revision:	    v0.1.2
 *
 * This file is part of LEAGUECENSUS.
 *
 * LOLCENSUS is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * LOLCENSUS is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with LOLCENSUS.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright © 2018 - LEAGUECENSUS.COM
 */

// global variables
var championName = null;

/*
 * @function:       loadChampionList()
 * @description:    load full list of all League champions in table format
 * @param:          none
 * @returns:        none
 */
function loadChampionList() {
	// reset elements and empty main body div entirely
	resetElements(document.getElementById("main-section"));
	$("#main-section").empty();
	// get api key from db, pull champion data from api in json format
	$.ajax({
		url: "auth.php",
		type: "GET",
		dataType: "json",
		data: {
			'url': "na1.api.riotgames.com/" + STATIC_DATA_API +
			"/champions?locale=en_US&dataById=true&"
		},
		success: function (json) {
			const MAX_CHAMP_ID = 700; // maximum possible champ id
			var champNameArr = [];
			var champNameEditArr = [];
			// check for all id's under MAX_CHAMP_ID
			for (var x = 1; x < MAX_CHAMP_ID; x++) {
				if (typeof (json.data[x]) !== "undefined") {
					var champName = json.data[x].name;
					champNameArr.push(champName);
					var champNameEdit = fixChampionNames(champName);
					champNameEditArr.push(champNameEdit);
				}
			}
			// alphabetically list champ names
			champNameArr.sort();
			champNameEditArr.sort();
			// create table for champion list
			var tbl = document.createElement("table");
			tbl.setAttribute("id", "champListTable");
			tbl.setAttribute("style", "width:100%;margin-bottom:50px;");
			var tbody = document.createElement("tbody");
			for (var n = 0; n < champNameArr.length; n++) {
				// create rows - champions
				var divId = document.getElementById("main-section");
				for (var i = 0; i < 1; i++) {
					var tr = document.createElement("tr");
					tr.setAttribute("class", "champion-tr");
					// 4 columns across
					for (var j = 0; j < 5; j++) {
						if (typeof (champNameArr[n]) === "undefined") {
							continue;
						}
						else {
							var td = document.createElement("td");
							td.setAttribute("class", "champion-td");
							td.setAttribute("id", champNameArr[n]);
							td.setAttribute("style", "width:20%");
							td.setAttribute("onclick", "loadChampionData(this);"); // onclick for champion selected
							var img = document.createElement("img");
							img.setAttribute("id", "champion-img");
							img.setAttribute("class", "hvr-pulse");
							// Wukong is a special case - name is MonkeyKing so alters alphabetical sort.
							if (champNameArr[n] === "Wukong") {
								img.setAttribute("src", "http://ddragon.leagueoflegends.com/cdn/" + DATA_DRAGON +
									"/img/champion/" + "MonkeyKing" + ".png");
							}
							else {
								img.setAttribute("src", "http://ddragon.leagueoflegends.com/cdn/" + DATA_DRAGON +
									"/img/champion/" + champNameEditArr[n] + ".png");
							}
							img.setAttribute("width", "100");
							img.setAttribute("height", "100");
							img.setAttribute("alt", champNameArr[n]);
							td.appendChild(img);
							var br = document.createElement("br");
							td.appendChild(br);
							var p = document.createElement("p");
							td.appendChild(p);
							var bold = document.createElement("b");
							td.appendChild(bold);
							var tdText = document.createTextNode(champNameArr[n].toUpperCase());
							bold.appendChild(tdText);
							p.appendChild(bold);
							tr.appendChild(td);
							n++;
						}

					}
					n--;
					tbody.appendChild(tr);
				}
				tbl.appendChild(tbody);
				divId.appendChild(tbl);
			}
		},
		error: function (jqXHR) {
			console.log("status:" + jqXHR.status);
			console.log("statusText:" + jqXHR.statusText);
			console.log("readyState:" + jqXHR.readyState);
			console.log("responseText:" + jqXHR.responseText);
		}
	});
}

/*
 * @function:       loadChampionData()
 * @description:    once champion selected, load information about that champion.
 * @param:          elem
 * @returns:        none
 */
function loadChampionData(elem) {
	// reset elements and empty main body div entirely
	resetElements(document.getElementById("main-content"));
	resetElements(document.getElementById("main-section"));
	$("#search-box").remove();
	$("#champListTable").remove();
	$("#main-section").remove();
	// set championName based on image clicked
	championName = $(elem).closest("td").attr("id");
	if (elem.length > 0) {
		championName = elem;
	}
	var divMain = document.getElementById("main-content");
	var divMainHeaders = document.createElement("div");
	divMainHeaders.setAttribute("id", "main-headers");
	divMain.appendChild(divMainHeaders);
	// champion name
	var h1 = document.createElement("h1");
	h1.setAttribute("id", "championNameHeader");
	divMainHeaders.appendChild(h1);
	var champNameCaps = championName.toUpperCase();
	document.getElementById("championNameHeader").innerHTML = champNameCaps;
	// title of champion
	var h4 = document.createElement("h4");
	h4.setAttribute("id", "championTitleHeader");
	divMainHeaders.appendChild(h4);
	// image of champion
	var img = document.createElement("img");
	img.setAttribute("id", "champion-splash");
	if (championName === "Wukong") {
		img.setAttribute("src", "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" +
			"MonkeyKing_0.jpg");
	}
	else {
		img.setAttribute("src", "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" +
			fixChampionNames(championName) + "_0.jpg");
	}
	img.setAttribute("alt", championName);
	divMainHeaders.appendChild(img);
	// tabs
	// tab: information
	var divMainInfo = document.createElement("div");
	divMainInfo.setAttribute("id", "main-info");
	divMain.appendChild(divMainInfo);
	var ul = document.createElement("ul");
	ul.setAttribute("class", "nav nav-pills center-pills");
	ul.setAttribute("role", "tablist");
	divMainInfo.appendChild(ul);
	var li = document.createElement("li");
	li.setAttribute("class", "tab-item");
	ul.appendChild(li);
	var a = document.createElement("a");
	a.setAttribute("href", "#information");
	a.setAttribute("class", "tab-link active");
	a.setAttribute("aria-controls", "information");
	a.setAttribute("role", "tab");
	a.setAttribute("data-toggle", "tab");
	var tabText = document.createTextNode("INFORMATION");
	a.appendChild(tabText);
	li.appendChild(a);
	// tab: spells
	li = document.createElement("li");
	li.setAttribute("class", "tab-item");
	ul.appendChild(li);
	a = document.createElement("a");
	a.setAttribute("href", "#spells");
	a.setAttribute("class", "tab-link");
	a.setAttribute("aria-controls", "spells");
	a.setAttribute("role", "tab");
	a.setAttribute("data-toggle", "tab");
	tabText = document.createTextNode("SPELLS");
	a.appendChild(tabText);
	li.appendChild(a);
	// tab: lore
	li = document.createElement("li");
	li.setAttribute("class", "tab-item");
	ul.appendChild(li);
	a = document.createElement("a");
	a.setAttribute("href", "#lore");
	a.setAttribute("class", "tab-link");
	a.setAttribute("aria-controls", "lore");
	a.setAttribute("role", "tab");
	a.setAttribute("data-toggle", "tab");
	tabText = document.createTextNode("LORE");
	a.appendChild(tabText);
	li.appendChild(a);
	// tab: tips and tricks
	li = document.createElement("li");
	li.setAttribute("class", "tab-item");
	ul.appendChild(li);
	a = document.createElement("a");
	a.setAttribute("href", "#tipstricks");
	a.setAttribute("class", "tab-link");
	a.setAttribute("aria-controls", "tipstricks");
	a.setAttribute("role", "tab");
	a.setAttribute("data-toggle", "tab");
	tabText = document.createTextNode("TIPS & TRICKS");
	a.appendChild(tabText);
	li.appendChild(a);
	// div panels
	// panel: information
	var divTabContent = document.createElement("div");
	divTabContent.setAttribute("class", "tab-content");
	divMainInfo.appendChild(divTabContent);
	var divPanel = document.createElement("div");
	divPanel.setAttribute("role", "tabpanel");
	divPanel.setAttribute("class", "tab-pane active");
	divPanel.setAttribute("id", "information");
	var br = document.createElement("br");
	divPanel.appendChild(br);
	var info = document.createElement("div");
	info.setAttribute("class", "info");
	divPanel.appendChild(info);
	divTabContent.appendChild(divPanel);
	// panel: spells
	divPanel = document.createElement("div");
	divPanel.setAttribute("role", "tabpanel");
	divPanel.setAttribute("class", "tab-pane fade");
	divPanel.setAttribute("id", "spells");
	br = document.createElement("br");
	divPanel.appendChild(br);
	// 1 passive per champion
	var divPassive = document.createElement("div");
	divPassive.setAttribute("class", "spell clearfix");
	divPassive.setAttribute("id", "divPassive");
	divPanel.appendChild(divPassive);
	// 4 spells per champion, create 4 spans for images
	for (var i = 0; i < 4; i++) {
		var spell = document.createElement("div");
		spell.setAttribute("class", "spell clearfix");
		spell.setAttribute("id", "spell" + i);
		divPanel.appendChild(spell);
	}
	divTabContent.appendChild(divPanel);
	// panel: lore
	divPanel = document.createElement("div");
	divPanel.setAttribute("role", "tabpanel");
	divPanel.setAttribute("class", "tab-pane fade");
	divPanel.setAttribute("id", "lore");
	br = document.createElement("br");
	divPanel.appendChild(br);
	var spanLore = document.createElement("div");
	spanLore.setAttribute("id", "lore");
	divPanel.appendChild(spanLore);
	divTabContent.appendChild(divPanel);
	// panel: tips and tricks
	divPanel = document.createElement("div");
	divPanel.setAttribute("role", "tabpanel");
	divPanel.setAttribute("class", " tab-pane fade");
	divPanel.setAttribute("id", "tipstricks");
	var ally_tips = document.createElement("div");
	ally_tips.setAttribute("id", "ally_tips");
	divPanel.appendChild(ally_tips);
	br = document.createElement("br");
	divPanel.appendChild(br);
	var enemy_tips = document.createElement("div");
	enemy_tips.setAttribute("id", "enemy_tips");
	divPanel.appendChild(enemy_tips);
	divTabContent.appendChild(divPanel);

	$.ajax({
		url: "../lol-census/secure/ajax-requests.php",
		type: "GET",
		dataType: "json",
		data: {
			'name': championName
		},
		success: function (json) {
			// !!!!REMOVE!!!!
			// !!!!REMOVE!!!!
			console.log(json); // !!!!REMOVE!!!!
			// !!!!REMOVE!!!!
			// !!!!REMOVE!!!!
			// title
			$('#championTitleHeader').html("'" + json.Title + "'");
			// lore and quote
			$('#lore').html("<b>THE STORY OF " + championName.toUpperCase().fontsize(7) + "...</b> <br><br>" +
				json[4].Lore + "<br><br><br>" + "<span id=\"lore-quote\">" + json[4].Quote + "</span>" + "<br><br>");
			// tips and tricks
			$('#ally_tips').html("<h3>ALLY TIPS:</h3> <ul class=\"square-bullets\"><li>" +
				replaceWithBreak(json.AllyTips) + "</ul>");
			$('#enemy_tips').html("<h3>ENEMY TIPS:</h3> <ul class=\"square-bullets\"><li>" +
				replaceWithBreak(json.EnemyTips) + "</ul>");
			// champion info
			var attackSpeed = 0.625 / (1 + parseFloat(json.AttackSpeedOffSet)); // attack speed calc from RiotAPI forum
			// champion games calculations
			var winPercent = parseFloat(json[5].WinPercent);
			var pickRate = parseFloat(json[5].PickRate);
			var banRate = parseFloat(json[5].BanRate);
			var goldEarned = parseFloat(json[5].AvgGold);
			var kills = parseFloat(json[5].AvgKills);
			var deaths = parseFloat(json[5].AvgDeaths);
			var assists = parseFloat(json[5].AvgAssists);
			var damageDealt = parseFloat(json[5].AvgDamageDealt);
			var damageToChampions = parseFloat(json[5].AvgDamageToChampions);
			var damageTaken = parseFloat(json[5].AvgDamageTaken);
			var magicDamage = parseFloat(json[5].AvgMagicDamage);
			var magicDamageToChampions = parseFloat(json[5].AvgMagicDamageToChampions);
			var magicDamageTaken = parseFloat(json[5].AvgMagicDamageTaken);
			var physicalDamage = parseFloat(json[5].AvgPhysicalDamage);
			var physicalDamageToChampions = parseFloat(json[5].AvgPhysicalDamageToChampions);
			var physicalDamageTaken = parseFloat(json[5].AvgPhysicalDamageTaken);
			var trueDamage = parseFloat(json[5].AvgTrueDamage);
			var trueDamageToChampions = parseFloat(json[5].AvgTrueDamageToChampions);
			var trueDamageTaken = parseFloat(json[5].AvgTrueDamageTaken);
			var healing = parseFloat(json[5].AvgHealing);
			var wardsPlaced = parseFloat(json[5].AvgWardsPlaced);
			var wardsKilled = parseFloat(json[5].AvgWardsKilled);
			var firstBlood = parseFloat(json[5].FirstBloodPercent);
			var firstTower = parseFloat(json[5].FirstTowerPercent);
			var avgLevel = parseFloat(json[5].AvgLevel);
			var minionsKilled = parseFloat(json[5].AvgMinionsKilled);
			$('.info').html(
				"<div class=\"info-columns\" id=\"info-col-1\">" +
				"<h3>BASIC INFORMATION</h3>" +
				"<hr><br>" +
				"<b>NAME</b><br>" + json.ChampionName +
				"<br>" +
				"\"" + json.Title + "\"" +
				"<br><br>" +
				"<b>FACTION</b><br>" + json[4].Faction +
				"<br><br>" +
				"<b>RELEASE DATE</b><br>" + json[4].ReleaseDate +
				"<br><br>" +
				"<b>CHAMPION ID</b><br>" + json.Id +
				"<br><br>" +
				"<b>RESOURCE</b><br>" + json.ParType +
				"<br><br>" +
				"<b>ROLE</b><br>" + json.Tags +
				"<br><br><br>" +
				"<h3>ATTRIBUTES</h3>" +
				"<hr><br>" +
				"<b>HEALTH</b><br>" + parseFloat(json.Hp).toFixed(0) +
				" (+" + parseFloat(json.HpPerLevel).toFixed(0) + "/LVL)" +
				"<br><br>" +
				"<b>HEALTH REGEN</b><br>" + parseFloat(json.HpRegen).toFixed(1) +
				" (+" + parseFloat(json.HpRegenPerLevel).toFixed(1) + "/LVL)" +
				"<br><br>" +
				"<b>MANA</b><br>" + parseFloat(json.Mp).toFixed(0) +
				" (+" + parseFloat(json.MpPerLevel).toFixed(0) + "/LVL)" +
				"<br><br>" +
				"<b>MANA REGEN</b><br>" + parseFloat(json.MpRegen).toFixed(1) +
				" (+" + parseFloat(json.MpRegenPerLevel).toFixed(1) + "/LVL)" +
				"<br><br>" +
				"<b>ATTACK DAMAGE</b><br>" + parseFloat(json.AttackDamage).toFixed(1) +
				" (+" + parseFloat(json.AttackDamagePerLevel).toFixed(1) + "/LVL)" +
				"<br><br>" +
				"<b>ATTACK SPEED</b><br>" + attackSpeed.toFixed(2) + "/sec" +
				" (+" + parseFloat(json.AttackSpeedPerLevel).toFixed(2) + "%/LVL)" +
				"<br><br>" +
				"<b>ARMOR</b><br>" + parseFloat(json.Armor).toFixed(1) +
				" (+" + parseFloat(json.ArmorPerLevel).toFixed(1) + "/LVL)" +
				"<br><br>" +
				"<b>MAGIC RESIST</b><br>" + parseFloat(json.SpellBlock).toFixed(1) +
				" (+" + parseFloat(json.SpellBlockPerLevel).toFixed(1) + "/LVL)" +
				"<br><br>" +
				"<b>RANGE</b><br>" + parseFloat(json.AttackRange).toFixed(0) +
				"<br><br>" +
				"<b>MOVEMENT</b><br>" + parseFloat(json.MoveSpeed).toFixed(0) +
				"<br><br>" +
				"</div>" +
				"<div class=\"info-columns\" id=\"info-col-2\">" +
				"<h3>IN-GAME STATISTICS</h3>" +
				"<hr><br>" +
				"<b>WIN RATE</b><br> " + winPercent.toFixed(1) + "%" + "<br><span style=\"color:" + rankTextColor(json[6].WinRank) + "\"> (" + getOrdinal(json[6].WinRank) + ")</span>" +
				"<br><br>" +
				"<b>PICK RATE</b><br> " + pickRate.toFixed(1) + "%" + "<br><span style=\"color:" + rankTextColor(json[6].PickRank) + "\"> (" +  getOrdinal(json[6].PickRank) + ")</span>" +
				"<br><br>" +
				"<b>BAN RATE</b><br> " + banRate.toFixed(1) + "%" + "<br><span style=\"color:" + rankTextColor(json[6].BanRank) + "\"> (" +  getOrdinal(parseFloat(json[6].BanRank)) + ")</span>" +
				"<br><br>" +
				"<b>GOLD EARNED</b><br> " + addCommas(goldEarned.toFixed(0)) + "<br><span style=\"color:" + rankTextColor(json[6].GoldRank) + "\"> (" +  getOrdinal(json[6].GoldRank) + ")</span>" +
				"<br><br>" +
				"<b>KILLS</b><br> " + kills.toFixed(1) + "<br><span style=\"color:" + rankTextColor(json[6].KillsRank) + "\"> (" +  getOrdinal(json[6].KillsRank) + ")</span>" +
				"<br><br>" +
				"<b>DEATHS</b><br> " + deaths.toFixed(1) + "<br><span style=\"color:" + rankTextColor(json[6].DeathsRank) + "\"> (" +  getOrdinal(json[6].DeathsRank) + ")</span>" +
				"<br><br>" +
				"<b>ASSISTS</b><br> " + assists.toFixed(1) + "<br><span style=\"color:" + rankTextColor(json[6].AssistsRank) + "\"> (" +  getOrdinal(json[6].AssistsRank) + ")</span>" +
				"<br><br>" +
				"<b>DAMAGE DEALT</b><br> " + addCommas(damageDealt.toFixed(0)) + "<br><span style=\"color:" + rankTextColor(json[6].DamageDealtRank) + "\"> (" +  getOrdinal(json[6].DamageDealtRank) + ")</span>" +
				"<br><br>" +
				"<b>CHAMPION DAMAGE</b><br> " + addCommas(damageToChampions.toFixed(0)) + "<br><span style=\"color:" + rankTextColor(json[6].DamageToChampionsRank) + "\"> (" +  getOrdinal(json[6].DamageToChampionsRank) + ")</span>" +
				"<br><br>" +
				"<b>DAMAGE TAKEN</b><br> " + addCommas(damageTaken.toFixed(0)) + "<br><span style=\"color:" + rankTextColor(json[6].DamageTakenRank) + "\"> (" +  getOrdinal(json[6].DamageTakenRank) + ")</span>" +
				"<br><br>" +
				"<b>HEALING</b><br> " + addCommas(healing.toFixed(0)) + "<br><span style=\"color:" + rankTextColor(json[6].HealingRank) + "\"> (" + getOrdinal(json[6].HealingRank) + ")</span>" +
				"<br><br>" +
				"<b>WARDS PLACED</b><br> " + wardsPlaced.toFixed(1) + "<br><span style=\"color:" + rankTextColor(json[6].WardsPlacedRank) + "\"> (" + getOrdinal(json[6].WardsPlacedRank) + ")</span>" +
				"<br><br>" +
				"<b>WARDS KILLED</b><br> " + wardsKilled.toFixed(1) + "<br><span style=\"color:" + rankTextColor(json[6].WardsKilledRank) + "\"> (" + getOrdinal(json[6].WardsKilledRank) + ")</span>" +
				"<br><br>" +
				"<b>FIRST BLOOD</b><br> " + firstBlood.toFixed(1) + "%" + "<br><span style=\"color:" + rankTextColor(json[6].FirstBloodPercentRank) + "\"> (" + getOrdinal(json[6].FirstBloodPercentRank) + ")</span>" +
				"<br><br>" +
				"<b>FIRST TOWER</b><br> " + firstTower.toFixed(1) + "%" + "<br><span style=\"color:" + rankTextColor(json[6].FirstTowerPercentRank) + "\"> (" + getOrdinal(json[6].FirstTowerPercentRank) + ")</span>" +
				"<br><br>" +
				"<b>LEVEL AVERAGE</b><br> " + avgLevel.toFixed(1) + "<br><span style=\"color:" + rankTextColor(json[6].LevelRank) + "\"> (" + getOrdinal(json[6].LevelRank) + ")</span>" +
				"<br><br>" +
				"<b>MINIONS KILLED</b><br>" + minionsKilled.toFixed(0) + "<br><span style=\"color:" + rankTextColor(json[6].MinionsKilledRank) + "\"> (" + getOrdinal(json[6].MinionsKilledRank) + ")</span>" +
				"<br><br>" +
				"</div>" +
				"<div class=\"info-columns\" id=\"info-col-3\">" +
				"<h3>CHARTS</h3>" +
				"<hr><br>" +
				"<b>DAMAGE DISTRIBUTION</b>" +
				"<br><br>" +
				"<canvas id=\"damage-dealt\" width=\"300\" height=\"33\" data-toggle=\"tooltip\" " +
							"data-placement=\"top\" data-html=\"true\" />" +
				"<br><br>" +
				"<div class=\"damage-legend\">" +
				"<div id=\"phys-square\"></div><span class=\"legend\">Physical</span>" +
				"<div id=\"magic-square\"></div><span class=\"legend\">Magic</span>" +
				"<div id=\"true-square\"></div><span class=\"legend\">True</span>" +
				"</div>" +
				"<br><br><br>" +
				"<b>ATTRIBUTES</b>" +
				"<br><br>" +
				"<span class=\"attr-bar\" id=\"spanAttackBar\" data-toggle=\"tooltip\" " +
				"data-placement=\"top\" >" +
				"<img src=\"images/sword.png\" width=\"27\" height=\"27\" /> " +
				"<canvas id=\"attackBar\" width=\"200\" height=\"23\" />" +
				"</span>" +
				"<span class=\"attr-bar\" id=\"spanDefenseBar\" data-toggle=\"tooltip\" " +
				"data-placement=\"top\" >" +
				"<img src=\"images/shield.png\" width=\"27\" height=\"27\" /> " +
				"<canvas id=\"defenseBar\" width=\"200\" height=\"23\" />" +
				"</span>" +
				"<span class=\"attr-bar\" id=\"spanMagicBar\" data-toggle=\"tooltip\" " +
				"data-placement=\"top\" >" +
				"<img src=\"images/flame.png\" width=\"27\" height=\"27\" /> " +
				"<canvas id=\"magicBar\" width=\"200\" height=\"23\" />" +
				"</span>" +
				"<span class=\"attr-bar\" id=\"spanDifficultyBar\" data-toggle=\"tooltip\" " +
				"data-placement=\"top\" >" +
				"<img src=\"images/stairs.png\" width=\"27\" height=\"27\" /> " +
				"<canvas id=\"difficultyBar\" width=\"200\" height=\"23\" />" +
				"</span>" +
				"<canvas id=\"kda\" width=\"100\" height=\"100\" />" +
				"</div>"
			);
			// damage dealt bar
			createDamageDealtBar(physicalDamageToChampions, magicDamageToChampions, trueDamageToChampions);
			// attack/defense/magic/difficulty bar title
			var attack = json.Attack;
			var defense = json.Defense;
			var magic = json.Magic;
			var difficulty = json.Difficulty;
			document.getElementById("spanAttackBar").title = "Attack Power - " + attack;
			document.getElementById("spanDefenseBar").title = "Defense Power - " + defense;
			document.getElementById("spanMagicBar").title = "Ability Power - " + magic;
			document.getElementById("spanDifficultyBar").title = "Learning Difficulty - " + difficulty;
			// convert to decimal for canvas gradiant
			var attackDec = attack * 0.1;
			var defenseDec = defense * 0.1;
			var magicDec = magic * 0.1;
			var difficultyDec = difficulty * 0.1;
			// draw canvas attack/defense/magic/difficulty bars
			createAttributeBar(attackDec, defenseDec, magicDec, difficultyDec);
			// kda graph
			createKdaGraph(kills, deaths, assists);
			// display passive info
			var spell_name = json.PassiveName;
			var upperCasespell_name = spell_name.toUpperCase();
			$('#divPassive').html(
				"<div class=\"spell-image\">" +
				"<img src=\"http://ddragon.leagueoflegends.com/cdn/" + DATA_DRAGON +
				"/img/passive/" + json.PassiveImageFull + "\" >" +
				"</div>" +
				"<div class=\"spell-info\">" +
				"<b id=\"spell_name\">" + upperCasespell_name + "</b>" +
				"<div id=\"spell-info-right\">" +
				"<b>PASSIVE ABILITY</b>" +
				"</div>" +
				"<br><br>" +
				"<b>DESCRIPTION:</b> " + json.PassiveDescription +
				"<br>" +
				"</div>");
			// spell images and spell info
			for (var i = 0; i < 4; i++) {
				spell_name = json[i].Name;
				upperCasespell_name = spell_name.toUpperCase();
				var maxAmmo = "";
				// ammo fix
				if (json[i].MaxAmmo === "-1") {
					maxAmmo = "N/A";
				}
				else {
					maxAmmo = json[i].MaxAmmo;
				}
				// resource name fix
				var costType = null;
				if (json[i].CostType === "EssenceofShadow") {
					costType = "Essence of Shadow";
				}
				else if (json[i].CostType === "pofcurrentHealth") {
					costType = "% of Current Health";
				}
				else if (json[i].CostType === "Manaplus@Effect3Amount@ManaPerSecond") {
					costType = "Mana";
				}
				else if (json[i].CostType === "Passive") {
					costType = "Passive - Always On";
				}
				else if (json[i].CostType === "None") {
					costType = "No Cost";
				}
				else if (json[i].CostType === "NoCostor50Fury") {
					costType = "No Cost";
				}
				else if (json[i].CostType === "ManaperSecond") {
					costType = "Mana";
				}
				else if (json[i].CostType === "ManaPerSecond") {
					costType = "Mana";
				}
				else if (json[i].CostType === "ManaperRocket") {
					costType = "Mana";
				}
				else if (json[i].CostType === "ManaandTurretKit") {
					costType = "Mana";
				}
				else if (json[i].CostType === "Mana,@Effect4Amount@ManaPerSecond") {
					costType = "Mana";
				}
				else if (json[i].CostType === "Mana,@Effect2Amount@Focus") {
					costType = "Mana";
				}
				else if (json[i].CostType === "Mana,1-3Charges") {
					costType = "Mana";
				}
				else if (json[i].CostType === "InitialManaCostperSecond") {
					costType = "Mana";
				}
				else if (json[i].CostType === "Furyasecond") {
					costType = "Fury";
				}
				else {
					costType = json[i].CostType;
				}
				// display spell info
				$('#spell' + i).html(
					"<div class=\"spell-image\">" +
					"<img src=\"http://ddragon.leagueoflegends.com/cdn/" + DATA_DRAGON +
					"/img/spell/" + json[i].ImageFull + "\" >" +
					"</div>" +
					"<div class=\"spell-info\">" +
					"<b id=\"spell_name\">" + upperCasespell_name + "</b>" +
					"<div id=\"spell-info-right\">" +
					"<b>HOTKEY:</b> " + json[i].HotKey +
					"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
					"<b>MAX RANK:</b> " + json[i].MaxRank +
					"</div>" +
					"<br><br>" +
					"<b>DESCRIPTION:</b> " + json[i].Description +
					"<br><br>" +
					"<b>RESOURCE:</b> " + costType +
					"<br>" +
					"<b>COST:</b> " + json[i].CostBurn +
					"<br>" +
					"<b>COOLDOWN:</b> " + json[i].CooldownBurn +
					"<br>" +
					"<b>RANGE:</b> " + json[i].RangeBurn +
					"<br>" +
					"<b>MAX AMMO:</b> " + maxAmmo +
					"<br>" +
					"</div>");
			}
			$('[data-toggle="tooltip"]').tooltip(); // activate bootstrap tooltips
		},
		error: function (jqXHR) {
			console.log("status:" + jqXHR.status);
			console.log("statusText:" + jqXHR.statusText);
			console.log("readyState:" + jqXHR.readyState);
			console.log("responseText:" + jqXHR.responseText);
		}
	});
}

/*
 * @function:       replaceWithBreak()
 * @description:    takes a string and replaces ".," found in the string with ".<br>"
 *                  eg. json.AllyTips separates text by ".,"
 * @param:          replace
 * @returns:        replacedStr
 */
function replaceWithBreak(replace) {
	return replace.split(".,").join(".<br><br><li>");
}

/*
 * @function:       createAttributeBar()
 * @description:    draws canvas bar for attack, defense, magic and difficulty.
 * @param:          attackDec, defenseDec, magicDef, difficultyDec
 * @returns:        none
 */
function createAttributeBar(attackDec, defenseDec, magicDec, difficultyDec) {
	// attack
	var canvas = document.getElementById("attackBar");
	var ctx = canvas.getContext("2d");
	var grad = ctx.createLinearGradient(0, 0, 200, 0);
	grad.addColorStop(0, "#992600");
	grad.addColorStop(attackDec, "#992600");
	grad.addColorStop(attackDec, "#1c1c1c");
	grad.addColorStop(1, "#1c1c1c");
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, 200, 23);
	ctx.strokeStyle = "#1c1c1c";
	ctx.stroke();
	// defense
	canvas = document.getElementById("defenseBar");
	ctx = canvas.getContext("2d");
	grad = ctx.createLinearGradient(0, 0, 200, 0);
	grad.addColorStop(0, "#00802b");
	grad.addColorStop(defenseDec, "#00802b");
	grad.addColorStop(defenseDec, "#1c1c1c");
	grad.addColorStop(1, "#1c1c1c");
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, 200, 23);
	ctx.strokeStyle = "#1c1c1c";
	ctx.stroke();
	// magic
	canvas = document.getElementById("magicBar");
	ctx = canvas.getContext("2d");
	grad = ctx.createLinearGradient(0, 0, 200, 0);
	grad.addColorStop(0, "#0052cc");
	grad.addColorStop(magicDec, "#0052cc");
	grad.addColorStop(magicDec, "#1c1c1c");
	grad.addColorStop(1, "#1c1c1c");
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, 200, 23);
	ctx.strokeStyle = "#1c1c1c";
	ctx.stroke();
	// difficulty
	canvas = document.getElementById("difficultyBar");
	ctx = canvas.getContext("2d");
	grad = ctx.createLinearGradient(0, 0, 200, 0);
	grad.addColorStop(0, "#6600ff");
	grad.addColorStop(difficultyDec, "#6600ff");
	grad.addColorStop(difficultyDec, "#1c1c1c");
	grad.addColorStop(1, "#1c1c1c");
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, 200, 23);
	ctx.strokeStyle = "#1c1c1c";
	ctx.stroke();
}

/*
 * @function:       createDamageDealtBar()
 * @description:    create a bar on canvas "damage-dealt" for magic/physica/true damage values
 * @param:          magicDamage, physicalDamage, trueDamage
 * @returns:        none
 */
function createDamageDealtBar(physicalDamageToChampions, magicDamageToChampions, trueDamageToChampions) {
	var totalDamage = physicalDamageToChampions + magicDamageToChampions + trueDamageToChampions;
	var physicalPercent = physicalDamageToChampions / totalDamage;
	var magicPercent = magicDamageToChampions / totalDamage;
	var truePercent = trueDamageToChampions / totalDamage;
	var canvas = document.getElementById("damage-dealt");
	var ctx = canvas.getContext("2d");
	var grad = ctx.createLinearGradient(0, 0, 300, 0);
	grad.addColorStop(0, "#992600");
	grad.addColorStop(physicalPercent, "#992600");
	grad.addColorStop(physicalPercent, "#0052cc");
	grad.addColorStop(magicPercent + physicalPercent, "#0052cc");
	grad.addColorStop(magicPercent + physicalPercent, "#fff");
	grad.addColorStop(truePercent + physicalPercent + magicPercent, "#fff");
	grad.addColorStop(1, "#1c1c1c");
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, 300, 33);
	ctx.strokeStyle = "#1c1c1c";
	ctx.stroke();
	// tooltip hover
	document.getElementById("damage-dealt").title = "<b>Physical:</b> " + (physicalPercent*100).toFixed(1) + "%" +
													"<br><b>Magical:</b> " + (magicPercent*100).toFixed(1) + "%" +
													"<br><b>True:</b> " + (truePercent*100).toFixed(1) + "%";
}

/*
 * @function:       createKdaGraph()
 * @description:    create a graph on canvas "kda" for champion KDA.
 * @param:          kills, deaths, assists
 * @returns:        none
 */
function createKdaGraph(kills, deaths, assists) {
	//var kdaChart;
	// if a chart exists, clear it before creating next
	//if (kdaChart !== undefined || kdaChart !== null) {
	//    kdaChart.clear();
	//}
	var data = {
		labels: [],
		datasets: [
			{
				data: [133.3, 86.2, 52.2, 51.2, 50.2],
				backgroundColor: [
					"#FF6384",
					"#63FF84",
					"#84FF63",
					"#8463FF",
					"#6384FF"
				],
				borderColor: "black",
				borderWidth: 2
			}
		]
	};
	var options = {
		rotation: -Math.PI,
		cutoutPercentage: 30,
		circumference: Math.PI,
		legend: {
			position: 'left'
		},
		animation: {
			animateRotate: false,
			animateScale: true
		}
	};
	var ctx = document.getElementById("kda").getContext("2d");
	kdaChart = new Chart(ctx).Doughnut(data, options);
}

/*
 * @function:       fixChampionNames()
 * @description:    change champion names to naming used for Data Dragon.
 * @param:          champName
 * @returns:        champNameEdit
 */
function fixChampionNames(champName) {
	var champNameEdit;
	if (champName === "Aurelion Sol") {
		champNameEdit = "AurelionSol";
		return champNameEdit;
	}
	else if (champName === "Cho'Gath") {
		champNameEdit = "Chogath";
		return champNameEdit;
	}
	else if (champName === "Dr. Mundo") {
		champNameEdit = "DrMundo";
		return champNameEdit;
	}
	else if (champName === "Jarvan IV") {
		champNameEdit = "JarvanIV";
		return champNameEdit;
	}
	else if (champName === "Kai'Sa") {
		champNameEdit = "Kaisa";
		return champNameEdit;
	}
	else if (champName === "Kha'Zix") {
		champNameEdit = "Khazix";
		return champNameEdit;
	}
	else if (champName === "Kog'Maw") {
		champNameEdit = "KogMaw";
		return champNameEdit;
	}
	else if (champName === "LeBlanc") {
		champNameEdit = "Leblanc";
		return champNameEdit;
	}
	else if (champName === "Lee Sin") {
		champNameEdit = "LeeSin";
		return champNameEdit;
	}
	else if (champName === "Master Yi") {
		champNameEdit = "MasterYi";
		return champNameEdit;
	}
	else if (champName === "Miss Fortune") {
		champNameEdit = "MissFortune";
		return champNameEdit;
	}
	else if (champName === "Rek'Sai") {
		champNameEdit = "RekSai";
		return champNameEdit;
	}
	else if (champName === "Tahm Kench") {
		champNameEdit = "TahmKench";
		return champNameEdit;
	}
	else if (champName === "Twisted Fate") {
		champNameEdit = "TwistedFate";
		return champNameEdit;
	}
	else if (champName === "Vel'Koz") {
		champNameEdit = "Velkoz";
		return champNameEdit;
	}
	/*else if (champName === "Wukong") {
	 champNameEdit = "MonkeyKing";
	 return champNameEdit;
	}*/
	else if (champName === "Xin Zhao") {
		champNameEdit = "XinZhao";
		return champNameEdit;
	}
	else {
		return champName;
	}
}

/*
 * @function:       resetElements()
 * @description:    reset all the elements in selected div
 * @param:          divToReset
 * @returns:        none
 */
function resetElements(divToReset) {
	for (var i = 0; i < divToReset.childNodes.length; i++) {
		var e = divToReset.childNodes[i];
		if (e.tagName) {
			switch (e.tagName.toLowerCase()) {
				case 'input':
					switch (e.type) {
						case "button":
						case "submit":
						case "img":
							break;
						default:
							e.value = '';
							break;
					}
					break;
				case 'span':
					e.innerHTML = '';
					break;
				case 'table':
					e.innerHTML = '';
					break;
				default:
					resetElements(e);
			}
		}
	}
}

/*
 * @function:       addCommas()
 * @description:    add comma's for thousands separator
 * @param:          commaSplit
 * @returns:        none
 */
function addCommas(commaSplit)
{
	commaSplit += '';
	x = commaSplit.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

/*
 * @function:       addOrdinal()
 * @description:    add ordinal notation for numbers
 * @param:          ordinalNumber
 * @returns:        none
 */
 function getOrdinal(ordinalNumber) {
	 var s = ["th","st","nd","rd"], v = ordinalNumber % 100;
	 return ordinalNumber + (s[(v-20)%10]||s[v]||s[0]);
  }

/*
* @function:       rankTextColor()
* @description:    change color of text for ranking placement
* @param:          rank
* @returns:        color
*/
function rankTextColor(rank) {
	var color = null;

	if (rank <= 30) {
	   color = "#009933";
	}
	else if (rank > 30 && rank < 60) {
		color = "#fff3cd";
	}
	else {
		color = "#cc2900";
	}

	return color;
}

/*
 * Copyright © 2018 - LEAGUECENSUS.COM
 */
