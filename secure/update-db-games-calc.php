<?php
/*
 * @program:	    update-db-games-calc.php
 * @description:    Calculate average and percents and send to MySQL
 * @author:         Mykel Agathos
 * @date:           Aug 26, 2017
 * @revision:	    v1.0.0
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

// globals
$updateChampions = 0;

$apiQuery = mysqli_query($con, "SELECT api_key FROM secure_api");
$keyFetch = mysqli_fetch_assoc($apiQuery);
$apiKey = $keyFetch["api_key"];
// read the json file and convert it to an array $data
$json = file_get_contents("https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&dataById=false&api_key=".$apiKey);
$data = json_decode($json, true);
// loop through all possible champion keys in $data
define("MAX_CHAMP_ID", 700); // maximum possible champ id
$champKeyList = array();
for ($i = 0; $i < MAX_CHAMP_ID; $i++) {
    // skip over non-existant keys
    if (isset($data["keys"][$i])) {
        array_push($champKeyList, $data["keys"][$i]);
    }
    else {
        continue;
    }
}

sort($champKeyList); // how the champions are ordered in the json
for ($n = 0; $n < count($champKeyList); $n++) {
    $champKey = $data["data"][$champKeyList[$n]]["key"]; // id of champion

    $selectGamesPlayed = mysqli_query($con,
        "SELECT GamesPlayed FROM lolcensus.championgames
         WHERE ChampId=$champKey");
    $result = mysqli_fetch_assoc($selectGamesPlayed);
    $GamesPlayed = $result['GamesPlayed'];

    $selectTotalGames = mysqli_query($con,
        "SELECT SUM(GamesPlayed) AS TotalGamesPlayed FROM lolcensus.championgames");
    $result = mysqli_fetch_assoc($selectTotalGames);
    $TotalGames = $result['TotalGamesPlayed'];

    $updateAvgValues = mysqli_query($con,
        "UPDATE championgamescalc
            SET WinPercent = (SELECT Wins FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed * 100,
            PickRate = ($GamesPlayed / $TotalGames) * 100,
            BanRate = 0,
            AvgGold = (SELECT GoldEarned FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgKills = (SELECT Kills FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgDeaths = (SELECT Deaths FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgAssists = (SELECT Assists FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgDamageDealt = (SELECT DamageDealt FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgDamageToChampions = (SELECT DamageToChampions FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgDamageTaken = (SELECT DamageTaken FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgMagicDamage = (SELECT MagicDamage FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgMagicDamageToChampions = (SELECT MagicDamageToChampions FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgMagicDamageTaken = (SELECT MagicDamageTaken FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgPhysicalDamage = (SELECT PhysicalDamage FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgPhysicalDamageToChampions = (SELECT PhysicalDamageToChampions FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgPhysicalDamageTaken = (SELECT PhysicalDamageTaken FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgTrueDamage = (SELECT TrueDamage FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgTrueDamageToChampions = (SELECT TrueDamageToChampions FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgTrueDamageTaken = (SELECT TrueDamageTaken FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgHealing = (SELECT HealingTotal FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgWardsPlaced = (SELECT WardsPlaced FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgWardsKilled = (SELECT WardsKilled FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            FirstBloodPercent = (SELECT FirstBlood FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed * 100,
            FirstTowerPercent = (SELECT FirstTower FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed * 100,
            AvgLevel = (SELECT HighestLevel FROM lolcensus.championgames WHERE ChampId=$champKey) / $GamesPlayed,
            AvgMinionsKilled = (SELECT MinionsKilled FROM lolcensus.championgames WHERE ChampID=$champKey) / $GamesPlayed
         WHERE ChampId=$champKey")
         OR die(mysqli_error($con));

    if ($updateAvgValues !== false) {
        $updateChampions++;
    }
}

echo "<b>Champions Updated - " . $updateChampions . "</b>";

mysqli_close($con);

/*
 * Copyright © 2018 - LEAGUECENSUS.COM
 */

?>
