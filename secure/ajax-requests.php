<?php
/*
 * @program:	    ajax-requests.php
 * @description:  Fetch data from MySQL to pass through AJAX to client.
 * @author:       Mykel Agathos
 * @date:         Nov 04, 2016
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

header("Content-Type: application/json");

// disable error reporting to hide api key on error messages
error_reporting(0); 

$config = parse_ini_file("config.ini");
$con = mysqli_connect($config["host"],
                      $config["sqlUser"],
                      $config["sqlPass"],
                      $config["dbName"]);
if ($con === false) {
  return mysqli_connect_error();
}

mysqli_set_charset($con, "utf8");

// championName passed in from champion.js, loadChampionData()
$champ_name = $_GET['name']; 
$champ_name_slashed = addslashes($champ_name);

// championstats
$rs_stats = mysqli_query($con, "SELECT * FROM championstats 
                        WHERE ChampionName='$champ_name_slashed'");
$stats = mysqli_fetch_assoc($rs_stats);
$champ_id = $stats['Id'];

// championspells
$rs_spells = mysqli_query($con, "SELECT * FROM championspells 
                        WHERE ChampId='$champ_id'");
$spells = array();
while ($row = mysqli_fetch_assoc($rs_spells)) {
  $spells[] = $row;
}

// championdetails
$rs_details = mysqli_query($con, "SELECT * FROM championdetails 
                        WHERE ChampId='$champ_id'");
$details = array();
while ($row = mysqli_fetch_assoc($rs_details)) {
  $details[] = $row;
}

// championgames
$rs_games = mysqli_query($con, "SELECT * FROM championgamescalc 
                        WHERE ChampId='$champ_id'");
$games = array();
while ($row = mysqli_fetch_assoc($rs_games)) {
  $games[] = $row;
}

// games played and total games played
$rs_gamesplayed = mysqli_query($con, "SELECT SUM(GamesPlayed) AS TotalGamesPlayed, GamesPlayed FROM championgames");
$games_played = mysqli_fetch_assoc($rs_gamesplayed);

// champion ranks
$rs_ranks = mysqli_query($con, "SELECT 
  Find_in_set(WinPercent, 
  (SELECT Group_concat(WinPercent ORDER BY WinPercent DESC) 
  FROM lolcensus.championgamescalc)) AS WinRank,
  
  Find_in_set(PickRate, 
  (SELECT Group_concat(PickRate ORDER BY PickRate DESC) 
  FROM lolcensus.championgamescalc)) AS PickRank,

  Find_in_set(BanRate, 
  (SELECT Group_concat(BanRate ORDER BY BanRate DESC)
  FROM lolcensus.championgamescalc)) AS BanRank,
       Find_in_set(AvgGold, (SELECT Group_concat(AvgGold ORDER BY AvgGold DESC)
                             FROM lolcensus.championgamescalc)) AS GoldRank,
       Find_in_set(AvgKills, (SELECT Group_concat(AvgKills ORDER BY AvgKills DESC)
                              FROM lolcensus.championgamescalc)) AS KillsRank,
       Find_in_set(AvgDeaths, (SELECT Group_concat(AvgDeaths ORDER BY AvgDeaths DESC)
                               FROM lolcensus.championgamescalc)) AS DeathsRank,
       Find_in_set(AvgAssists, (SELECT Group_concat(AvgAssists ORDER BY AvgAssists DESC)
                              FROM lolcensus.championgamescalc)) AS AssistsRank,
       Find_in_set(AvgDamageDealt, (SELECT Group_concat(AvgDamageDealt ORDER BY AvgDamageDealt DESC)
                              FROM lolcensus.championgamescalc)) AS DamageDealtRank,
       Find_in_set(AvgDamageToChampions, (SELECT Group_concat(AvgDamageToChampions ORDER BY AvgDamageToChampions DESC)
                                          FROM lolcensus.championgamescalc)) AS DamageToChampionsRank,
       Find_in_set(AvgDamageTaken, (SELECT Group_concat(AvgDamageTaken ORDER BY AvgDamageTaken DESC)
                                    FROM lolcensus.championgamescalc)) AS DamageTakenRank,
       Find_in_set(AvgMagicDamage, (SELECT Group_concat(AvgMagicDamage ORDER BY AvgMagicDamage DESC)
                                    FROM lolcensus.championgamescalc)) AS MagicDamageRank,
       Find_in_set(AvgMagicDamageToChampions, (SELECT Group_concat(AvgMagicDamageToChampions ORDER BY AvgMagicDamageToChampions DESC)
                                               FROM lolcensus.championgamescalc)) AS MagicDamageToChampionsRank,
       Find_in_set(AvgMagicDamageTaken, (SELECT Group_concat(AvgMagicDamageTaken ORDER BY AvgMagicDamageTaken DESC)
                                         FROM lolcensus.championgamescalc)) AS MagicDamageTakenRank,
       Find_in_set(AvgPhysicalDamage, (SELECT Group_concat(AvgPhysicalDamage ORDER BY AvgPhysicalDamage DESC)
                                       FROM lolcensus.championgamescalc)) AS PhysicalDamageRank,
       Find_in_set(AvgPhysicalDamageToChampions, (SELECT Group_concat(AvgPhysicalDamageToChampions ORDER BY AvgPhysicalDamageToChampions DESC)
                                                  FROM lolcensus.championgamescalc)) AS PhysicalDamageToChampionsRank,
       Find_in_set(AvgPhysicalDamageTaken, (SELECT Group_concat(AvgPhysicalDamageTaken ORDER BY AvgPhysicalDamageTaken DESC)
                                            FROM lolcensus.championgamescalc)) AS PhysicalDamageTakenRank,
       Find_in_set(AvgTrueDamage, (SELECT Group_concat(AvgTrueDamage ORDER BY AvgTrueDamage DESC)
                                   FROM lolcensus.championgamescalc)) AS TrueDamageRank,
       Find_in_set(AvgTrueDamageToChampions, (SELECT Group_concat(AvgTrueDamageToChampions ORDER BY AvgTrueDamageToChampions DESC)
                                              FROM lolcensus.championgamescalc)) AS TrueDamageToChampionsRank,
       Find_in_set(AvgTrueDamageTaken, (SELECT Group_concat(AvgTrueDamageTaken ORDER BY AvgTrueDamageTaken DESC)
                                        FROM lolcensus.championgamescalc)) AS TrueDamageTakenRank,
       Find_in_set(AvgHealing, (SELECT Group_concat(AvgHealing ORDER BY AvgHealing DESC)
                                FROM lolcensus.championgamescalc)) AS HealingRank,
       Find_in_set(AvgWardsPlaced, (SELECT Group_concat(AvgWardsPlaced ORDER BY AvgWardsPlaced DESC)
                                    FROM lolcensus.championgamescalc)) AS WardsPlacedRank,
       Find_in_set(AvgWardsKilled, (SELECT Group_concat(AvgWardsKilled ORDER BY AvgWardsKilled DESC)
                                    FROM lolcensus.championgamescalc)) AS WardsKilledRank,
       Find_in_set(FirstBloodPercent, (SELECT Group_concat(FirstBloodPercent ORDER BY FirstBloodPercent DESC)
                                       FROM lolcensus.championgamescalc)) AS FirstBloodPercentRank,
       Find_in_set(FirstTowerPercent, (SELECT Group_concat(FirstTowerPercent ORDER BY FirstTowerPercent DESC)
                                       FROM lolcensus.championgamescalc)) AS FirstTowerPercentRank,
       Find_in_set(AvgLevel, (SELECT Group_concat(AvgLevel ORDER BY AvgLevel DESC)
                              FROM lolcensus.championgamescalc)) AS LevelRank,
       Find_in_set(AvgMinionsKilled, (SELECT Group_concat(AvgMinionsKilled ORDER BY AvgMinionsKilled DESC)
                                      FROM lolcensus.championgamescalc)) AS MinionsKilledRank
FROM championgamescalc
WHERE ChampId='$champ_id'");
$ranks = array();
while ($row = mysqli_fetch_assoc($rs_ranks)) {
  $ranks[] = $row;
}

$json_data = array_merge($stats, $spells, $details, $games, $games_played, $ranks);
echo json_encode($json_data);

/*
 * Copyright © 2018 - LEAGUECENSUS.COM
 */
?>
