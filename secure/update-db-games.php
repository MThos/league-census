<?php
/*
 * @program:	    update-db-games.php
 * @description:    Pull matches from seed data to calculate win rate, etc
 *                  and store in database for ajax calls.
 * @author:         Mykel Agathos
 * @date:           Apr 19, 2017
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

// disable error reporting to hide api key on error messages
//error_reporting(0);

header('Content-type: text/html; charset=utf-8');

// parse server settings into $config array
$config = parse_ini_file("config.ini");
$con = mysqli_connect($config["host"],
                      $config["sqlUser"],
                      $config["sqlPass"],
                      $config["dbName"]);
// check connection
if ($con === false) {
    return mysqli_connect_error();
}

$accountId = 233861913;
$beginTime = 1481108400000; // start of season 7
$apiQuery = mysqli_query($con, "SELECT api_key FROM secure_api");
$keyFetch = mysqli_fetch_assoc($apiQuery);
$apiKey = $keyFetch["api_key"];
// read the api json to get game id
$jsonMatchList = file_get_contents("https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/".$accountId."?".
    "beginTime".$beginTime."=&api_key=".$apiKey);
$dataMatchList = json_decode($jsonMatchList, true);
// loop through all matches to collect game id's
$gameIdList = array();
for ($i = 0; $i < count($dataMatchList["matches"]); $i++) {
    if (isset($dataMatchList["matches"][$i]["gameId"])) {
        array_push($gameIdList, $dataMatchList["matches"][$i]["gameId"]);
    }
}
// loop through all matches
$championsUpdated = 0;
for ($j = 0; $j < count($gameIdList); $j++) {
    $currentGameId = $gameIdList[$j];
    // read the api json to gather game details
    $jsonMatch = file_get_contents("https://na1.api.riotgames.com/lol/match/v3/matches/".$currentGameId."?".
        "api_key=".$apiKey);
    $dataMatch = json_decode($jsonMatch, true);
    // game bans
    $bannedChampId = array();
    for ($n = 0; $n < count($dataMatch["teams"]); $n++) {
        for ($i = 0; $i < count($dataMatch["teams"][$n]["bans"]); $i++) {
            array_push($bannedChampId, $dataMatch["teams"][$n]["bans"][$i]["championId"]);
        }
    }
    // individual champion game stats
    for ($n = 0; $n < count($dataMatch["participants"]); $n++)
    {
        $championId = $dataMatch["participants"][$n]["championId"];
        $win = $dataMatch["participants"][$n]["stats"]["win"];
        $goldEarned = $dataMatch["participants"][$n]["stats"]["goldEarned"];
        $kills = $dataMatch["participants"][$n]["stats"]["kills"];
        $deaths = $dataMatch["participants"][$n]["stats"]["deaths"];
        $assists = $dataMatch["participants"][$n]["stats"]["assists"];
        $damageDealt = $dataMatch["participants"][$n]["stats"]["totalDamageDealt"];
        $magicDamage = $dataMatch["participants"][$n]["stats"]["magicDamageDealt"];
        $physicalDamage = $dataMatch["participants"][$n]["stats"]["physicalDamageDealt"];
        $trueDamage = $dataMatch["participants"][$n]["stats"]["trueDamageDealt"];
        $damageToChampions = $dataMatch["participants"][$n]["stats"]["totalDamageDealtToChampions"];
        $magicDamageToChampions = $dataMatch["participants"][$n]["stats"]["magicDamageDealtToChampions"];
        $physicalDamageToChampions = $dataMatch["participants"][$n]["stats"]["physicalDamageDealtToChampions"];
        $trueDamageToChampions = $dataMatch["participants"][$n]["stats"]["trueDamageDealtToChampions"];
        $damageTaken = $dataMatch["participants"][$n]["stats"]["totalDamageTaken"];
        $magicDamageTaken = $dataMatch["participants"][$n]["stats"]["magicalDamageTaken"];
        $physicalDamageTaken = $dataMatch["participants"][$n]["stats"]["physicalDamageTaken"];
        $trueDamageTaken = $dataMatch["participants"][$n]["stats"]["trueDamageTaken"];
        $healingTotal = $dataMatch["participants"][$n]["stats"]["totalHeal"];
        $wardsPlaced = $dataMatch["participants"][$n]["stats"]["wardsPlaced"];
        $wardsKilled = $dataMatch["participants"][$n]["stats"]["wardsKilled"];
        $highestLevel = $dataMatch["participants"][$n]["stats"]["champLevel"];
        $minionsKilled = $dataMatch["participants"][$n]["stats"]["totalMinionsKilled"];
        // check if firstBlood exists
        if (isset($dataMatch["participants"][$n]["stats"]["firstBloodKill"])) {
            $firstBlood = $dataMatch["participants"][$n]["stats"]["firstBloodKill"];
        }
        else {
            $firstBlood = "false";
        }
        // check if firstTower exists
        if (isset($dataMatch["participants"][$n]["stats"]["firstTowerKill"])) {
            $firstTower = $dataMatch["participants"][$n]["stats"]["firstTowerKill"];
        }
        else {
            $firstTower = "false";
        }
        // check win/loss t/f and assign value (want a numerical value, not t/f in db)
        $winCount = 0;
        $lossCount = 0;
        $totalGames = 0;
        if ($win == "true") {
            $winCount = 1;
            $totalGames = 1;
        }
        else {
            $lossCount = 1;
            $totalGames = 1;
        }
        // check first blood t/f and assign value (want a numerical value, not t/f in db)
        $firstBloodCount = 0;
        if ($firstBlood == "true") {
            $firstBloodCount = 1;
        }
        else {
            $firstBloodCount = 0;
        }
        // check first tower t/f and assign value (want a numerical value, not t/f in db)
        $firstTowerCount = 0;
        if ($firstTower == "true") {
            $firstTowerCount = 1;
        }
        else {
            $firstTowerCount = 0;
        }
        // update game stats, champion by champion in current game
        $insertGameStats = mysqli_query($con, "UPDATE championgames
                                    SET Wins=Wins+$winCount, Losses=Losses+$lossCount,
                                    GamesPlayed=GamesPlayed+$totalGames, GoldEarned=GoldEarned+$goldEarned,
                                    Kills=Kills+$kills, Deaths=Deaths+$deaths, Assists=Assists+$assists,
                                    DamageDealt=DamageDealt+$damageDealt, MagicDamage=MagicDamage+$magicDamage,
                                    PhysicalDamage=PhysicalDamage+$physicalDamage, TrueDamage=TrueDamage+$trueDamage,
                                    DamageToChampions=DamageToChampions+$damageToChampions,
                                    MagicDamageToChampions=MagicDamageToChampions+$magicDamageToChampions,
                                    PhysicalDamageToChampions=PhysicalDamageToChampions+$physicalDamageToChampions,
                                    TrueDamageToChampions=TrueDamageToChampions+$trueDamageToChampions,
                                    DamageTaken=DamageTaken+$damageTaken,
                                    MagicDamageTaken=MagicDamageTaken+$magicDamageTaken,
                                    PhysicalDamageTaken=PhysicalDamageTaken+$physicalDamageTaken,
                                    TrueDamageTaken=TrueDamageTaken+$trueDamageTaken,
                                    HealingTotal=HealingTotal+$healingTotal, WardsPlaced=WardsPlaced+$wardsPlaced,
                                    WardsKilled=WardsKilled+$wardsKilled, FirstBlood=FirstBlood+$firstBloodCount,
                                    FirstTower=FirstTower+$firstTowerCount, HighestLevel=HighestLevel+$highestLevel,
                                    MinionsKilled=MinionsKilled+$minionsKilled
                                    WHERE ChampId=$championId")
                                    OR die(mysqli_error($con));

        $championsUpdated++;
    }

    usleep(1200000); // prevent API rate limit
}

// display games calculated
$gamesCalculated = $championsUpdated / 10;
echo $gamesCalculated." games calculated.";


/*print "<pre>";
print_r($gameIdList);
//print_r($bannedChampId);
print "</pre>";*/
mysqli_close($con);

/*
 * Copyright © 2018 - LEAGUECENSUS.COM
 */

?>
