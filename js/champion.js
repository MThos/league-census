/*
 * @program:	    champion.js
 * @description:    Java API calls for LOLCENSUS.COM from League of Legends Official API
 *                  loadChampionList() - load list of champions in table from static API.
 *                  resetElements() - empty out elements.
 *                  fixChampionNames() - change champion names to naming used for Data Dragon.
 *                  loadChampionData() - once champion selected, load information about that champion.
 * @author:         Mykel Agathos
 * @date:           Jan 04, 2016
 * @revision:	    v0.1.2
 *
 * This file is part of LOLCENSUS.
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
 * Copyright © 2017 - LOLCENSUS.COM
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
                if (typeof (json.data[x]) === "undefined") {
                    continue;
                }
                else {
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
    if (championName == "Wukong") {
        img.setAttribute("src", "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" +
            "MonkeyKing_0.jpg");
    }
    else {
        img.setAttribute("src", "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" +
            fixChampionNames(championName) + "_0.jpg");
    }
    img.setAttribute("width", "40%");
    img.setAttribute("height", "40%");
    img.setAttribute("alt", championName);
    img.setAttribute("style", "margin:0 0 40px 0;");
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
    li.setAttribute("role", "presentation");
    li.setAttribute("class", "active");
    ul.appendChild(li);
    var a = document.createElement("a");
    a.setAttribute("href", "#information");
    a.setAttribute("aria-controls", "information");
    a.setAttribute("role", "tab");
    a.setAttribute("data-toggle", "tab");
    var tabText = document.createTextNode("INFORMATION");
    a.appendChild(tabText);
    li.appendChild(a);
    // tab: spells
    li = document.createElement("li");
    li.setAttribute("role", "presentation");
    ul.appendChild(li);
    a = document.createElement("a");
    a.setAttribute("href", "#spells");
    a.setAttribute("aria-controls", "spells");
    a.setAttribute("role", "tab");
    a.setAttribute("data-toggle", "tab");
    tabText = document.createTextNode("SPELLS");
    a.appendChild(tabText);
    li.appendChild(a);
    // tab: lore
    li = document.createElement("li");
    li.setAttribute("role", "presentation");
    ul.appendChild(li);
    a = document.createElement("a");
    a.setAttribute("href", "#lore");
    a.setAttribute("aria-controls", "lore");
    a.setAttribute("role", "tab");
    a.setAttribute("data-toggle", "tab");
    tabText = document.createTextNode("LORE");
    a.appendChild(tabText);
    li.appendChild(a);
    // tab: tips and tricks
    li = document.createElement("li");
    li.setAttribute("role", "presentation");
    ul.appendChild(li);
    a = document.createElement("a");
    a.setAttribute("href", "#tipstricks");
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
    divPanel.setAttribute("class", "tab-pane fade in active");
    divPanel.setAttribute("id", "information");
    var br = document.createElement("br");
    divPanel.appendChild(br);
    var divInfo = document.createElement("div");
    divInfo.setAttribute("class", "divInfo");
    divPanel.appendChild(divInfo);
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
    divPassive.setAttribute("class", "divSpell clearfix");
    divPassive.setAttribute("id", "divPassive");
    divPanel.appendChild(divPassive);
    // 4 spells per champion, create 4 spans for images
    for (var i = 0; i < 4; i++) {
        var divSpell = document.createElement("div");
        divSpell.setAttribute("class", "divSpell clearfix");
        divSpell.setAttribute("id", "divSpell" + i);
        divPanel.appendChild(divSpell);
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
    spanLore.setAttribute("id", "divLore");
    divPanel.appendChild(spanLore);
    divTabContent.appendChild(divPanel);
    // panel: tips and tricks
    divPanel = document.createElement("div");
    divPanel.setAttribute("role", "tabpanel");
    divPanel.setAttribute("class", "tab-pane fade");
    divPanel.setAttribute("id", "tipstricks");
    var divAllyTips = document.createElement("div");
    divAllyTips.setAttribute("id", "divAllyTips");
    divPanel.appendChild(divAllyTips);
    br = document.createElement("br");
    divPanel.appendChild(br);
    var divEnemyTips = document.createElement("div");
    divEnemyTips.setAttribute("id", "divEnemyTips");
    divPanel.appendChild(divEnemyTips);
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
            $('#divLore').html("<b>THE STORY OF " + championName.toUpperCase().fontsize(7) + "...</b> <br><br>" +
                json[4].Lore + "<br><br><br>" + "<span id=\"lore-quote\">" + json[4].Quote + "</span>" + "<br><br>");
            // tips and tricks
            $('#divAllyTips').html("<h3>ALLY TIPS:</h3> <ul class=\"square-bullets\"><li>" +
                replaceWithBreak(json.AllyTips) + "</ul>");
            $('#divEnemyTips').html("<h3>ENEMY TIPS:</h3> <ul class=\"square-bullets\"><li>" +
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
            $('.divInfo').html(
                "<div class=\"info-columns\" id=\"info-col-1\">" +
                "<b>NAME:</b> " + json.ChampionName +
                "<br>" +
                "<b>TITLE:</b> " + json.Title +
                "<br>" +
                "<b>FACTION:</b> " + json[4].Faction +
                "<br>" +
                "<b>RELEASE DATE:</b> " + json[4].ReleaseDate +
                "<br>" +
                "<b>ID:</b> " + json.Id +
                "<br><br>" +
                "<b>RESOURCE:</b> " + json.ParType +
                "<br>" +
                "<b>ROLE:</b> " + json.Tags +
                "<br><br>" +
                "<span class=\"spanAttributeBar\" id=\"spanAttackBar\" data-toggle=\"tooltip\" " +
                             "data-placement=\"top\" >" +
                "<img src=\"images/sword.png\" width=\"27\" height=\"27\" /> " +
                "<canvas id=\"attackBar\" width=\"200\" height=\"23\" />" +
                "</span>" +
                "<span class=\"spanAttributeBar\" id=\"spanDefenseBar\" data-toggle=\"tooltip\" " +
                             "data-placement=\"top\" >" +
                "<img src=\"images/shield.png\" width=\"27\" height=\"27\" /> " +
                "<canvas id=\"defenseBar\" width=\"200\" height=\"23\" />" +
                "</span>" +
                "<span class=\"spanAttributeBar\" id=\"spanMagicBar\" data-toggle=\"tooltip\" " +
                             "data-placement=\"top\" >" +
                "<img src=\"images/flame.png\" width=\"27\" height=\"27\" /> " +
                "<canvas id=\"magicBar\" width=\"200\" height=\"23\" />" +
                "</span>" +
                "<span class=\"spanAttributeBar\" id=\"spanDifficultyBar\" data-toggle=\"tooltip\" " +
                             "data-placement=\"top\" >" +
                "<img src=\"images/stairs.png\" width=\"27\" height=\"27\" /> " +
                "<canvas id=\"difficultyBar\" width=\"200\" height=\"23\" />" +
                "</span>" +
                "<br>" +
                "<b>HEALTH:</b> " + parseFloat(json.Hp).toFixed(0) +
                " (+" + parseFloat(json.HpPerLevel).toFixed(0) + "/LVL)" +
                "<br>" +
                "<b>HEALTH REGEN:</b> " + parseFloat(json.HpRegen).toFixed(1) +
                " (+" + parseFloat(json.HpRegenPerLevel).toFixed(1) + "/LVL)" +
                "<br><br>" +
                "<b>MANA:</b> " + parseFloat(json.Mp).toFixed(0) +
                " (+" + parseFloat(json.MpPerLevel).toFixed(0) + "/LVL)" +
                "<br>" +
                "<b>MANA REGEN:</b> " + parseFloat(json.MpRegen).toFixed(1) +
                " (+" + parseFloat(json.MpRegenPerLevel).toFixed(1) + "/LVL)" +
                "<br><br>" +
                "<b>ATTACK DAMAGE:</b> " + parseFloat(json.AttackDamage).toFixed(1) +
                " (+" + parseFloat(json.AttackDamagePerLevel).toFixed(1) + "/LVL)" +
                "<br>" +
                "<b>ATTACK SPEED:</b> " + attackSpeed.toFixed(2) + "/sec" +
                " (+" + parseFloat(json.AttackSpeedPerLevel).toFixed(2) + "%/LVL)" +
                "<br><br>" +
                "<b>ARMOR:</b> " + parseFloat(json.Armor).toFixed(1) +
                " (+" + parseFloat(json.ArmorPerLevel).toFixed(1) + "/LVL)" +
                "<br>" +
                "<b>MAGIC RESIST:</b> " + parseFloat(json.SpellBlock).toFixed(1) +
                " (+" + parseFloat(json.SpellBlockPerLevel).toFixed(1) + "/LVL)" +
                "<br><br>" +
                "<b>RANGE:</b> " + parseFloat(json.AttackRange).toFixed(0) +
                "<br>" +
                "<b>MOVEMENT:</b> " + parseFloat(json.MoveSpeed).toFixed(0) +
                "<br><br>" +
                "</div>" +
                "<div class=\"info-columns\" id=\"info-col-2\">" +
                "<b>WIN RATE:</b> " + winPercent.toFixed(1) + "%" +
                "<br><br>" +
                "<b>PICK RATE:</b> " + pickRate.toFixed(1) + "%" +
                "<br><br>" +
                "<b>BAN RATE:</b> " + banRate.toFixed(1) + "%" +
                "<br><br>" +
                "<b>GOLD EARNED:</b> " + addCommas(goldEarned.toFixed(0)) +
                "<br><br>" +
                "<b>KILLS:</b> " + kills.toFixed(1) +
                "<br><br>" +
                "<b>DEATHS:</b> " + deaths.toFixed(1) +
                "<br><br>" +
                "<b>ASSISTS:</b> " + assists.toFixed(1) +
                "<br><br>" +
                "<b>DAMAGE DEALT:</b> " + addCommas(damageDealt.toFixed(0)) +
                "<br><br>" +
                "<b>DAMAGE TO CHAMPIONS:</b> " + addCommas(damageToChampions.toFixed(0)) +
                "<br><br>" +
                "<b>DAMAGE TAKEN:</b> " + addCommas(damageTaken.toFixed(0)) +
                "<br><br>" +
                "<b>HEALING:</b> " + addCommas(healing.toFixed(0)) +
                "<br><br>" +
                "<b>WARDS PLACED:</b> " + wardsPlaced.toFixed(1) +
                "<br><br>" +
                "<b>WARDS KILLED:</b> " + wardsKilled.toFixed(1) +
                "<br><br>" +
                "<b>FIRST BLOOD:</b> " + firstBlood.toFixed(1) + "%" +
                "<br><br>" +
                "<b>FIRST TOWER:</b> " + firstTower.toFixed(1) + "%" +
                "<br><br>" +
                "<b>LEVEL AVERAGE:</b> " + avgLevel.toFixed(1) +
                "<br><br>" +
                "<b>MINIONS KILLED:</b> " + minionsKilled.toFixed(0) +
                "<br><br>" +
                "</div>" +
                "<div class=\"info-columns\" id=\"info-col-3\">" +
                "<div id=\"damage-distribution\"><h4>DAMAGE DISTRIBUTION</h4></div>" +
                "<canvas id=\"damage-dealt\" width=\"300\" height=\"33\" data-toggle=\"tooltip\" " +
                            "data-placement=\"top\" data-html=\"true\" />" +
                "<br><br>" +
                "<div class=\"damage-legend\">" +
                "<div id=\"phys-square\"></div><span class=\"legend\">Physical</span>" +
                "<div id=\"magic-square\"></div><span class=\"legend\">Magic</span>" +
                "<div id=\"true-square\"></div><span class=\"legend\">True</span>" +
                "</div>" +
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
            drawCanvas(attackDec, defenseDec, magicDec, difficultyDec);
            // display passive info
            var spellName = json.PassiveName;
            var upperCaseSpellName = spellName.toUpperCase();
            $('#divPassive').html(
                "<div class=\"SpellImage\">" +
                "<img src=\"http://ddragon.leagueoflegends.com/cdn/" + DATA_DRAGON +
                "/img/passive/" + json.PassiveImageFull + "\" >" +
                "</div>" +
                "<div class=\"SpellInfo\">" +
                "<b id=\"spellName\">" + upperCaseSpellName + "</b>" +
                "<div id=\"SpellInfoRightSide\">" +
                "<b>PASSIVE ABILITY</b>" +
                "</div>" +
                "<br><br>" +
                "<b>DESCRIPTION:</b> " + json.PassiveDescription +
                "<br>" +
                "</div>");
            // spell images and spell info
            for (var i = 0; i < 4; i++) {
                spellName = json[i].Name;
                upperCaseSpellName = spellName.toUpperCase();
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
                $('#divSpell' + i).html(
                    "<div class=\"SpellImage\">" +
                    "<img src=\"http://ddragon.leagueoflegends.com/cdn/" + DATA_DRAGON +
                    "/img/spell/" + json[i].ImageFull + "\" >" +
                    "</div>" +
                    "<div class=\"SpellInfo\">" +
                    "<b id=\"spellName\">" + upperCaseSpellName + "</b>" +
                    "<div id=\"SpellInfoRightSide\">" +
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
    return replacedStr = replace.split(".,").join(".<br><br><li>");
}

/*
 * @function:       drawCanvas()
 * @description:    draws canvas bar for attack, defense, magic and difficulty.
 * @param:          attackDec, defenseDec, magicDef, difficultyDec
 * @returns:        none
 */
function drawCanvas(attackDec, defenseDec, magicDec, difficultyDec) {
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
 * @param:          divToReset
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
 * Copyright © 2017 - LOLCENSUS.COM
 */
