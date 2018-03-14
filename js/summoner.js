/*
 * @program:	    summoner.js
 * @description:    Java API calls for LOLCENSUS.COM from League of Legends Official API
 *                  summonerSearch() - search summoner by name in textbox.
 *                  findMasteries() - search list of masteries for summoner.
 *                  findGameModeStats() - search list of game modes and stats for summoner.
 *                  resetElements() - empty out elements.
 *                  editGameModeName() - rename game modes to be more readable.
 *                  createWinsGraph() - create a graph showing all summoner game wins.
 *                  enterKeyCheck() - check if enter key pressed inside textbox #summonerName
 * @author:         Mykel Agathos
 * @date:           Sept 25, 2015
 * @revision:	    v1.0.0
 *
 * This file is part of LEAGUECENSUS
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
var summonerName = "";
var summonerInfoArray = [];
var gameModeWinsArray = [];
var gameModeNameArray = [];
var gameModeColorArray = [];
var gameModeHighlightArray = [];
var gameModeInfoArray = [];
var masteryInfoArray = [];
var errorText = "";

/*
 * @function:       summonerSearch()
 * @description:    search summoner by name in textbox
 * @param:          none
 * @returns:        none
 */
function summonerSearch() {
	summonerName = $("#summonerName").val();
	// reset elements and empty main body div entirely
	resetElements(document.getElementById("left-main-body"));
	resetElements(document.getElementById("right-main-body"));
	$("#left-main-body").empty();
	$("#right-main-body").empty();
	// get api key from db, pull summoner data from api in json format
	if (summonerName !== "") {
		$.ajax({
			url: "auth.php",
			type: "GET",
			dataType: "json",
			data: {
				'url': "na.api.pvp.net/api/lol/na/v" + riotSummoner + "/summoner/by-name/" + summonerName + "?"
			},
			success: function (json) {
				if (json === null)
				{
					errorText = " That summoner cannot be found!";
					searchError(errorText);
				}
				else
				{
					// remove spaces from summoner name
					var summonerNameNoSpaces = summonerName.replace(" ", "");
					summonerNameNoSpaces = summonerNameNoSpaces.toLowerCase().trim();
					// summoner icon, level, id and last played
					var summonerProfIcon = "http://avatar.leagueoflegends.com/na/" + summonerName + ".png";
					var summonerLevel = json[summonerNameNoSpaces].summonerLevel;
					var summonerId = json[summonerNameNoSpaces].id;
					var revisionDate = json[summonerNameNoSpaces].revisionDate;
					var summonerLastPlayedFullDate = new Date(revisionDate); // convert epoch time to date
					var summonerLastPlayedToString = summonerLastPlayedFullDate.toUTCString();
					var summonerLastPlayed = summonerLastPlayedToString.substring(4,16); // display date only, no time
					summonerInfoArray.push(["ID", summonerId]);
					summonerInfoArray.push(["Level", summonerLevel]);
					summonerInfoArray.push(["Last Played", summonerLastPlayed]);
					// create elements and set attributes for summoner name, info and wins chart
					var divLeftId = document.getElementById("left-main-body");
					// profile icon
					var img = document.createElement("img");
					img.setAttribute("id", "summProfIcon");
					var h2 = document.createElement("h2");
					var br = document.createElement("br");
					// summoner name
					var spanName = document.createElement("span");
					spanName.setAttribute("class", "yellow-span");
					spanName.setAttribute("id", "summNameLrg");
					// summoner info - id, level, last played
					var spanInfo = document.createElement("span");
					spanInfo.setAttribute("id", "summInfo");
					// wins chart title
					var spanChart = document.createElement("span");
					spanChart.setAttribute("class", "white-span");
					spanChart.setAttribute("id", "chartTitle");
					// wins chart
					var canvas = document.createElement("canvas");
					canvas.setAttribute("id", "wins");
					// append elements
					divLeftId.appendChild(img);
					divLeftId.appendChild(br);
					divLeftId.appendChild(h2);
					h2.appendChild(spanName);
					divLeftId.appendChild(br);
					divLeftId.appendChild(spanInfo);
					divLeftId.appendChild(br);
					divLeftId.appendChild(spanChart);
					divLeftId.appendChild(canvas);
					divLeftId.appendChild(br);
					// set element properties
					document.getElementById("summProfIcon").src = summonerProfIcon;
					document.getElementById("summProfIcon").height = 64;
					document.getElementById("summProfIcon").width = 64;
					document.getElementById("summProfIcon").style.border = "3px solid #000";
					document.getElementById("summNameLrg").innerHTML = summonerName;
					document.getElementById("wins").height = 400;
					document.getElementById("wins").width = 300;
					document.getElementById("chartTitle").innerHTML = "<h3>" + "WINS" + "</h3>";
					// create table - summoner info
					var spanId = document.getElementById("summInfo");
					var tbl = document.createElement("table");
					tbl.setAttribute("border", "0");
					var tbody = document.createElement("tbody");
					for (var i = 0; i < summonerInfoArray.length; i++) {
						var tr = document.createElement("tr");
						tr.setAttribute("class", "summoner-tr");
						for (var j = 0; j < summonerInfoArray[i].length; j++) {
							var bold = document.createElement("b");
							var td = document.createElement("td");
							td.setAttribute("class", "summoner-td");
							var tdText = document.createTextNode(summonerInfoArray[i][j]);
							td.appendChild(bold);
							bold.appendChild(tdText);
							tr.appendChild(td);
						}
						tbody.appendChild(tr);
					}
					tbl.appendChild(tbody);
					spanId.appendChild(tbl);
					spanId.appendChild(br);
					// add font color to cells of table - 2nd column
					var tds = document.getElementsByTagName("td");
					for(var n = 1, k = tds.length; n < k; n+=2) {
						tds[n].style.color = "#FFDF00";
					}
					// function to find list of masteries for summoner
					findMasteries(summonerId);
					// function to find stats on game modes for summoner
					findGameModeStats(summonerId);
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
	else {
		errorText = " You need to enter a summoner name!";
		searchError(errorText);
	}
}

/*
 * @function:       findMasteries()
 * @description:    search list of masteries for summoner
 * @param:          summonerId
 * @returns:        none
 */
function findMasteries(summonerId) {
	$.ajax({
		url: "auth.php",
		type: "GET",
		dataType: "json",
		data: {
			'url': "na.api.pvp.net/api/lol/na/v" + riotSummoner + "/summoner/" + summonerId + "/masteries?"
		},
		success: function (json) {
			var numberOfPages = json[summonerId].pages.length;
			var pagesCount = 1;
			// continue while not at last mastery page
			while (pagesCount < (numberOfPages + 1)) {
				var divId = document.getElementById("right-main-body");
				// mastery page no header
				var newSpanWhite = document.createElement("span");
				var spanIdPageNo = "masteryPageNo" + pagesCount;
				newSpanWhite.setAttribute("class", "white-span");
				newSpanWhite.setAttribute("id", spanIdPageNo);
				newSpanWhite.innerHTML = "<h4>" + "MASTERY PAGE # " + pagesCount + "</h4>";
				divId.appendChild(newSpanWhite);
				// mastery page name
				var pageName = json[summonerId].pages[pagesCount - 1].name;
				masteryInfoArray.push(["Name", pageName]);
				// mastery page id
				var pageId = json[summonerId].pages[pagesCount - 1].id;
				masteryInfoArray.push(["ID", pageId]);
				// mastery page active?
				var activeStr = "";
				var pageActive = json[summonerId].pages[pagesCount - 1].current;
				if (pageActive === true) {
					activeStr = "YES";
				}
				else {
					activeStr = "NO";
				}
				masteryInfoArray.push(["Active", activeStr]);

				// create table - masteries
				var tbl = document.createElement("table");
				tbl.setAttribute("border", "0");
				var tbody = document.createElement("tbody");
				for (var i = 0; i < masteryInfoArray.length; i++) {
					var tr = document.createElement("tr");
					tr.setAttribute("class", "summoner-tr");
					for (var j = 0; j < masteryInfoArray[i].length; j++) {
						var bold = document.createElement("b");
						var td = document.createElement("td");
						td.setAttribute("class", "summoner-td");
						var tdText = document.createTextNode(masteryInfoArray[i][j]);
						td.appendChild(bold);
						bold.appendChild(tdText);
						tr.appendChild(td);
					}
					tbody.appendChild(tr);
				}
				tbl.appendChild(tbody);
				divId.appendChild(tbl);
				var br = document.createElement("br");
				divId.appendChild(br);
				// add font color to cells of table - 2nd column
				var tds = document.getElementsByTagName("td");
				for(var n = 1, k = tds.length; n < k; n+=2) {
					tds[n].style.color = "#FFDF00";
				}
				masteryInfoArray = []; // empty array
				pagesCount++; // goto next mastery page
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
 * @function:       findGameModeStats()
 * @description:    search list of game modes and stats for summoner
 * @param:          summonerId
 * @returns:        none
 */
function findGameModeStats(summonerId) {
	$.ajax({
		url: "auth.php",
		type: "GET",
		dataType: "json",
		data: {
			'url': "na.api.pvp.net/api/lol/na/v" + riotStats + "/stats/by-summoner/" + summonerId + "/summary?season=SEASON2015&"
		},
		success: function (json) {
			var numberOfGameModes = json.playerStatSummaries.length;
			var modeCount = 0;
			while (modeCount < (numberOfGameModes)) {
				var gameModeName = json.playerStatSummaries[modeCount].playerStatSummaryType;
				// increment over the following game modes if found
				if (gameModeName === "Ascension" ||
					gameModeName === "CAP5x5" ||
					gameModeName === "CounterPick" ||
					gameModeName === "FirstBlood1x1" ||
					gameModeName === "FirstBlood2x2" ||
					gameModeName === "Hexakill" ||
					gameModeName === "KingPoro" ||
					gameModeName === "NightmareBot" ||
					gameModeName === "OneForAll5x5" ||
					gameModeName === "RankedPremade3x3" ||
					gameModeName === "RankedPremade5x5" ||
					gameModeName === "SummonersRift6x6" ||
					gameModeName === "URF" ||
					gameModeName === "URFBots" ||
					gameModeName === "Bilgewater" ||
					gameModeName === "Unranked3x3" ||
					gameModeName === "RankedTeam3x3" ||
					gameModeName === "CoopVsAI3x3") {
					modeCount++; // goto next game mode
				}
				else {
					// game mode name
					var divId = document.getElementById("left-main-body");
					var newSpanWhite = document.createElement("span");
					var spanIdGameMode = "gameMode" + gameModeName;
					newSpanWhite.setAttribute("class", "white-span");
					newSpanWhite.setAttribute("id", spanIdGameMode);
					var gameModeNameEdit = editGameModeName(gameModeName);
					newSpanWhite.innerHTML = '<h4>' + gameModeNameEdit + '</h4>';
					gameModeNameArray.push(gameModeNameEdit);
					divId.appendChild(newSpanWhite);
					// game mode wins
					var gameModeWins = json.playerStatSummaries[modeCount].wins;
					if (gameModeWins == null) {
						gameModeWins = "N/A";
					}
					gameModeWinsArray.push(gameModeWins);
					gameModeInfoArray.push(["Wins", gameModeWins]);
					// game mode losses
					var gameModeLosses = json.playerStatSummaries[modeCount].losses;
					// check if game modes losses are null in the api and assign zero
					if (gameModeLosses == null) {
						gameModeLosses = "N/A";
					}
					gameModeInfoArray.push(["Losses", gameModeLosses]);
					// game mode champion kills
					var gameModeChampionKills = json.playerStatSummaries[modeCount].aggregatedStats.totalChampionKills;
					if (gameModeChampionKills == null) {
						gameModeChampionKills = "N/A";
					}
					gameModeInfoArray.push(["Champion Kills", gameModeChampionKills]);
					// game mode assists
					var gameModeAssists = json.playerStatSummaries[modeCount].aggregatedStats.totalAssists;
					if (gameModeAssists == null) {
						gameModeAssists = "N/A";
					}
					gameModeInfoArray.push(["Assists", gameModeAssists]);
					// game mode turrets killed
					var gameModeTurretsKilled = json.playerStatSummaries[modeCount].aggregatedStats.totalTurretsKilled;
					if (gameModeTurretsKilled == null) {
						gameModeTurretsKilled = "N/A";
					}
					gameModeInfoArray.push(["Turrets Killed", gameModeTurretsKilled]);
					// game mode minion kills
					var gameModeMinionKills = json.playerStatSummaries[modeCount].aggregatedStats.totalMinionKills;
					if (gameModeMinionKills == null) {
						gameModeMinionKills = "N/A";
					}
					gameModeInfoArray.push(["Minion Kills", gameModeMinionKills]);
					// game mode neutral minions killed
					var gameModeNMinionsKilled = json.playerStatSummaries[modeCount].aggregatedStats.totalNeutralMinionsKilled;
					if (gameModeNMinionsKilled == null) {
						gameModeNMinionsKilled = "N/A";
					}
					gameModeInfoArray.push(["Neutral Minions", gameModeNMinionsKilled]);

					// create table - game modes
					var tbl = document.createElement("table");
					tbl.setAttribute("border", "0");
					var tbody = document.createElement("tbody");
					for (var i = 0; i < gameModeInfoArray.length; i++) {
						var tr = document.createElement("tr");
						tr.setAttribute("class", "summoner-tr");
						for (var j = 0; j < gameModeInfoArray[i].length; j++) {
							var bold = document.createElement("b");
							var td = document.createElement("td");
							td.setAttribute("class", "summoner-td");
							var tdText = document.createTextNode(gameModeInfoArray[i][j]);
							td.appendChild(bold);
							bold.appendChild(tdText);
							tr.appendChild(td);
						}
						tbody.appendChild(tr);
					}
					tbl.appendChild(tbody);
					divId.appendChild(tbl);
					var br = document.createElement("br");
					divId.appendChild(br);
					// add font color to cells of table
					var tds = document.getElementsByTagName("td");
					for(var n = 1, k = tds.length; n < k; n+=2) {
						tds[n].style.color = "#FFDF00";
					}
					gameModeInfoArray = []; // empty array
					modeCount++; // goto next game mode
				}
			}
			// load a graph of summoners wins
			createWinsGraph(gameModeWinsArray, gameModeNameArray);
			gameModeWinsArray = []; // empty array
			gameModeNameArray = []; // empty array
		},
		error: function (jqXHR) {
			console.log("status:" + jqXHR.status);
			console.log("statusText:" + jqXHR.statusText);
			console.log("readyState:" + jqXHR.readyState);
			console.log("responseText:" + jqXHR.responseText);
		}
	});
}

function searchError(errorText) {
	if ($(".alert").length) {
		$(".alert").remove();
		$("#errorBreakLine").remove();
	}
	var divCenter = document.getElementById("center-top-main-body");
	var divAlert = document.createElement("div");
	divAlert.setAttribute("class", "alert alert-warning");
	divAlert.setAttribute("id", "search-alert");
	divAlert.style.width = "50%";
	divAlert.style.margin = "0 auto";
	divAlert.innerHTML = "<strong> WARNING! </strong>" + errorText;
	var br = document.createElement("br");
	br.setAttribute("id", "errorBreakLine");
	divCenter.appendChild(br);
	divCenter.appendChild(divAlert);
}

/*
 * @function:       enterKeyCheck()
 * @description:    check if enter key pressed inside textbox #summonerName
 * @param:          e
 * @returns:        none
 */
function enterKeyCheck(e) {
	if (e.keyCode === 13) {
		summonerSearch();
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
 * @function:       editGameModeName()
 * @description:    edit the game mode name to a more readable name
 *                  and push colors to the arrays
 * @param:          gameModeName
 * @returns:        gameModeNameEdit
 */
function editGameModeName(gameModeName) {
	var gameModeNameEdit;
	if (gameModeName === "AramUnranked5x5") {
		gameModeNameEdit = "ARAM 5v5";
		gameModeColorArray.push("#46F79B");
		gameModeHighlightArray.push("#77F9B5");
		return gameModeNameEdit;
	}
	else if (gameModeName === "CoopVsAI") {
		gameModeNameEdit = "COOP-VS-AI 5v5";
		gameModeColorArray.push("#B45CFD");
		gameModeHighlightArray.push("#CB8EFE");
		return gameModeNameEdit;
	}
	else if (gameModeName === "OdinUnranked") {
		gameModeNameEdit = "DOMINION 5v5";
		gameModeColorArray.push("#FDB45C");
		gameModeHighlightArray.push("#FFC870");
		return gameModeNameEdit;
	}
	else if (gameModeName === "RankedSolo5x5") {
		gameModeNameEdit = "RANKED SOLO 5v5";
		gameModeColorArray.push("#46A3F7");
		gameModeHighlightArray.push("#77BBF9");
		return gameModeNameEdit;
	}
	else if (gameModeName === "RankedTeam5x5") {
		gameModeNameEdit = "RANKED TEAM 5v5";
		gameModeColorArray.push("#F7F346");
		gameModeHighlightArray.push("#F9F677");
		return gameModeNameEdit;
	}
	else if (gameModeName === "Unranked") {
		gameModeNameEdit = "NORMAL 5v5";
		gameModeColorArray.push("#F7464A");
		gameModeHighlightArray.push("#FF5A5E");
		return gameModeNameEdit;
	}
	else {
		gameModeNameEdit = "ERROR!";
		return gameModeNameEdit;
	}
}

/*
 * @function:       createWinsGraph()
 * @description:    create a graph on canvas "wins" for summoner wins
 * @param:          gameModeWinsArray, gameModeNameArray
 * @returns:        none
 */
function createWinsGraph(gameModeWinsArray, gameModeNameArray) {
	var winsChart;
	// if a chart exists, clear it before creating next
	if (winsChart != undefined || winsChart != null) {
		winsChart.clear();
	}
	var data = {
		labels: [],
		datasets: [
			{
				label: "gameModeWinsLine",
				fillColor: "#292B33",
				strokeColor: "#009933",
				pointColor: "#009933",
				pointStrokeColor: "#009933",
				pointHighlightFill: "#E4E4E4",
				pointHighlightStroke: "#E4E4E4",
				data: []
			}
		]
	};
	var length = gameModeWinsArray.length;
	for (var i = 0; i < length; i++) {
		data.labels[i] = gameModeNameArray[i];
		data.datasets[0].data[i] = gameModeWinsArray[i];
	}
	var options = {
		datasetFill : false,
		datasetStrokeWidth : 4,
		scaleShowGridLines : true,
		scaleGridLineColor : "#1a1a1a",
		scaleGridLineWidth : 2,
		bezierCurve: false,
		pointDotRadius: 4,
		animationSteps: 100,
		animationEasing: "easeOutBounce",
		showScale: true,
		scaleFontColor: "#C7C7C7"
	};
	var ctx = document.getElementById("wins").getContext("2d");
	winsChart = new Chart(ctx).Line(data, options);
}

/*
 * Copyright © 2018 - LEAGUECENSUS.COM
 */
