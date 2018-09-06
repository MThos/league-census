<?php
/*
 * @program:	    update-db-champion.php
 * @description:    Pull champion information from data dragon files
 *                  and store in database for calculations/ajax calls.
 * @author:         Mykel Agathos
 * @date:           Mar 27, 2016
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


// globals
$insertChampStatsRowCount = 0;
$insertChampStatsFails = 0;
$insertChampSpellsRowCount = 0;
$insertChampSpellsFails = 0;
$spellsPrimaryKey = 0;
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

$apiQuery = mysqli_query($con, "SELECT api_key FROM secure_api");
$keyFetch = mysqli_fetch_assoc($apiQuery);
$apiKey = $keyFetch["api_key"];
// read the json file and convert it to an array $data
$json = file_get_contents("../cache/champions.json");
$data = json_decode($json, true);
// loop through all possible champion keys in $data and populate $champKeyList array
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
// sort $champKeyList alphabetically - how the champions are ordered in the json
sort($champKeyList);
// loop through the champion list to populate variables that will get inserted to database.
for ($n = 0; $n < count($champKeyList); $n++) {
		// CHAMPION STATS
		// [champ]: key, name, title, full, sprite, lore, blurb, partype
		$champKey = $data["data"][$champKeyList[$n]]["id"]; // id of champion
		$champName = $data["data"][$champKeyList[$n]]["name"];
		$champTitle = $data["data"][$champKeyList[$n]]["title"];
		$champLore = $data["data"][$champKeyList[$n]]["lore"];
		$champBlurb = $data["data"][$champKeyList[$n]]["blurb"];
		$champParType = $data["data"]["$champKeyList[$n]"]["partype"];
		// [image]: full, sprite
		$champImageFull = $data["data"][$champKeyList[$n]]["image"]["full"];
		$champImageSprite = $data["data"][$champKeyList[$n]]["image"]["sprite"];
		// [info]: attack, defense, magic, difficulty
		$champAttack = $data["data"]["$champKeyList[$n]"]["info"]["attack"];
		$champDefense = $data["data"]["$champKeyList[$n]"]["info"]["defense"];
		$champMagic = $data["data"]["$champKeyList[$n]"]["info"]["magic"];
		$champDifficulty = $data["data"]["$champKeyList[$n]"]["info"]["difficulty"];
		/* [stats]: hp, hpperlevel, mp, mpperlevel, movespeed, armor, armorperlevel,
								spellblock, spellblockperlevel, attackrange, hpregen, hpregenperlevel,
								mpregen, mpregenperlevel, crit, critperlevel, attackdamage, attackdamageperlevel,
								attackspeedoffset, attackspeedperlevel */
		$champHp = $data["data"][$champKeyList[$n]]["stats"]["hp"];
		$champHpPerLevel = $data["data"][$champKeyList[$n]]["stats"]["hpperlevel"];
		$champMp = $data["data"][$champKeyList[$n]]["stats"]["mp"];
		$champMpPerLevel = $data["data"][$champKeyList[$n]]["stats"]["mpperlevel"];
		$champMoveSpeed = $data["data"][$champKeyList[$n]]["stats"]["movespeed"];
		$champArmor = $data["data"][$champKeyList[$n]]["stats"]["armor"];
		$champArmorPerLevel = $data["data"][$champKeyList[$n]]["stats"]["armorperlevel"];
		$champSpellBlock = $data["data"][$champKeyList[$n]]["stats"]["spellblock"];
		$champSpellBlockPerLevel = $data["data"][$champKeyList[$n]]["stats"]["spellblockperlevel"];
		$champAttackRange = $data["data"][$champKeyList[$n]]["stats"]["attackrange"];
		$champHpRegen = $data["data"][$champKeyList[$n]]["stats"]["hpregen"];
		$champHpRegenPerLevel = $data["data"][$champKeyList[$n]]["stats"]["hpregenperlevel"];
		$champMpRegen = $data["data"][$champKeyList[$n]]["stats"]["mpregen"];
		$champMpRegenPerLevel = $data["data"][$champKeyList[$n]]["stats"]["mpregenperlevel"];
		$champCrit = $data["data"][$champKeyList[$n]]["stats"]["crit"];
		$champCritPerLevel = $data["data"][$champKeyList[$n]]["stats"]["critperlevel"];
		$champAttackDamage = $data["data"][$champKeyList[$n]]["stats"]["attackdamage"];
		$champAttackDamagePerLevel = $data["data"][$champKeyList[$n]]["stats"]["attackdamageperlevel"];
		$champAttackSpeedOffSet = $data["data"][$champKeyList[$n]]["stats"]["attackspeedoffset"];
		$champAttackSpeedPerLevel = $data["data"][$champKeyList[$n]]["stats"]["attackspeedperlevel"];
		// [passive]: name, description, [passive][image]: full, sprite
		$champPassiveName = $data["data"][$champKeyList[$n]]["passive"]["name"];
		$champPassiveDescription = $data["data"][$champKeyList[$n]]["passive"]["description"];
		$champPassiveImageFull = $data["data"][$champKeyList[$n]]["passive"]["image"]["full"];
		$champPassiveImageSprite = $data["data"][$champKeyList[$n]]["passive"]["image"]["sprite"];
		// allytips[]: 2 or 3 tips per champion
		$champAllyTipsArr = array();
		for ($i = 0; $i < 3; $i++) {
				if (isset($data["data"][$champKeyList[$n]]["allytips"][$i])) {
						array_push($champAllyTipsArr, $data["data"][$champKeyList[$n]]["allytips"][$i]);
				}
		}
		$champAllyTips = implode(", ", $champAllyTipsArr);
		// enemytips[]: 2 or 3 tips per champion
		$champEnemyTipsArr = array();
		for ($i = 0; $i < 3; $i++) {
				if (isset($data["data"][$champKeyList[$n]]["enemytips"][$i])) {
						array_push($champEnemyTipsArr, $data["data"][$champKeyList[$n]]["enemytips"][$i]);
				}
		}
		$champEnemyTips = implode(", ", $champEnemyTipsArr);
		// tags[]: ie. fighter, tank, support, etc
		$champTagsArr = array();
		for ($i = 0; $i < 2; $i++) {
				if (isset($data["data"][$champKeyList[$n]]["tags"][$i])) {
						array_push($champTagsArr, $data["data"][$champKeyList[$n]]["tags"][$i]);
				}
		}
		$champTags = implode(", ", $champTagsArr);
		// escapes special characters
		$champName = mysqli_real_escape_string($con, $champName);
		$champTitle = mysqli_real_escape_string($con, $champTitle);
		$champImageFull = mysqli_real_escape_string($con, $champImageFull);
		$champImageSprite = mysqli_real_escape_string($con, $champImageSprite);
		$champLore = mysqli_real_escape_string($con, $champLore);
		$champBlurb = mysqli_real_escape_string($con, $champBlurb);
		$champParType = mysqli_real_escape_string($con, $champParType);
		$champAllyTips = mysqli_real_escape_string($con, $champAllyTips);
		$champEnemyTips = mysqli_real_escape_string($con, $champEnemyTips);
		$champTags = mysqli_real_escape_string($con, $champTags);
		$champPassiveName = mysqli_real_escape_string($con, $champPassiveName);
		$champPassiveDescription = mysqli_real_escape_string($con, $champPassiveDescription);
		$champPassiveImageFull = mysqli_real_escape_string($con, $champPassiveImageFull);
		$champPassiveImageSprite = mysqli_real_escape_string($con, $champPassiveImageSprite);
		// insert champions stats to championstats table or display error
		$insertChampStats = mysqli_query($con, "INSERT INTO championstats
						(Id, ChampionName, Title, ImageFull, ImageSprite,
						 Lore, Blurb, ParType, AllyTips, EnemyTips, Tags,
						 Attack, Defense, Magic, Difficulty, Hp, HpPerLevel,
						 Mp, MpPerLevel, MoveSpeed, Armor, ArmorPerLevel,
						 SpellBlock, SpellBlockPerLevel, AttackRange, HpRegen,
						 HpRegenPerLevel, MpRegen, MpRegenPerLevel, Crit,
						 CritPerLevel, AttackDamage, AttackDamagePerLevel,
						 AttackSpeedOffSet,AttackSpeedPerLevel, PassiveName,
						 PassiveDescription, PassiveImageFull, PassiveImageSprite)
		 VALUES ('$champKey', '$champName', '$champTitle', '$champImageFull',
						 '$champImageSprite', '$champLore', '$champBlurb', '$champParType',
						 '$champAllyTips', '$champEnemyTips', '$champTags', '$champAttack',
						 '$champDefense', '$champMagic', '$champDifficulty', '$champHp',
						 '$champHpPerLevel', '$champMp', '$champMpPerLevel', '$champMoveSpeed',
						 '$champArmor', '$champArmorPerLevel', '$champSpellBlock',
						 '$champSpellBlockPerLevel', '$champAttackRange', '$champHpRegen',
						 '$champHpRegenPerLevel', '$champMpRegen', '$champMpRegenPerLevel',
						 '$champCrit', '$champCritPerLevel', '$champAttackDamage',
						 '$champAttackDamagePerLevel', '$champAttackSpeedOffSet',
						 '$champAttackSpeedPerLevel', '$champPassiveName',
						 '$champPassiveDescription', '$champPassiveImageFull',
						 '$champPassiveImageSprite') ON DUPLICATE KEY UPDATE Id=$champKey")
							OR die(mysqli_error($con));
		// row count for stats insert
		if ($insertChampStats !== false) {
				$insertChampStatsRowCount++;
		}

		// CHAMPION SPELLS
		// spells count for all champions
		$spellsTotalCount = count($data["data"][$champKeyList[$n]]["spells"]);
		for ($i = 0; $i < $spellsTotalCount; $i++) {
				$spellsPrimaryKey++;
				// assign hotkey value as in game (Q, W, E, R)
				if ($i === 0) {
						$hotKey = "Q";
				}
				if ($i === 1) {
						$hotKey = "W";
				}
				if ($i === 2) {
						$hotKey = "E";
				}
				if ($i === 3) {
						$hotKey = "R";
				}
				/* spells[]: id, name, description, tooltip, maxrank, cooldownBurn, costBurn,
										 costType, maxammo, rangeBurn, resource, full, sprite */
				$spellsId = $data["data"][$champKeyList[$n]]["spells"][$i]["key"];
				$spellsName = $data["data"][$champKeyList[$n]]["spells"][$i]["name"];
				$spellsDescription = $data["data"][$champKeyList[$n]]["spells"][$i]["description"];
				$spellsTooltip = $data["data"][$champKeyList[$n]]["spells"][$i]["tooltip"];
				$spellsMaxRank = $data["data"][$champKeyList[$n]]["spells"][$i]["maxrank"];
				$spellsCooldownBurn = $data["data"][$champKeyList[$n]]["spells"][$i]["cooldownBurn"];
				$spellsCostBurn = $data["data"][$champKeyList[$n]]["spells"][$i]["costBurn"];
				$spellsCostType = $data["data"][$champKeyList[$n]]["spells"][$i]["costType"];
				$spellsRangeBurn = $data["data"][$champKeyList[$n]]["spells"][$i]["rangeBurn"];
				$spellsResource = $data["data"][$champKeyList[$n]]["spells"][$i]["resource"];
				$spellsImageFull = $data["data"][$champKeyList[$n]]["spells"][$i]["image"]["full"];
				$spellsImageSprite = $data["data"][$champKeyList[$n]]["spells"][$i]["image"]["sprite"];
				// spells[]: cooldown[], cost[], effect[], effectBurn[], range[]
				$spellsCooldownArr = array();
				$spellsCostArr = array();
				$spellsEffectArr = array();
				$spellsEffectBurnArr = array();
				$spellsRangeArr = array();
				for ($m = 0; $m < $spellsMaxRank; $m++) {
						if (isset($data["data"][$champKeyList[$n]]["spells"][$i]["cooldown"][$m])) {
								array_push($spellsCooldownArr, $data["data"][$champKeyList[$n]]["spells"][$i]["cooldown"][$m]);
						}
						if (isset($data["data"][$champKeyList[$n]]["spells"][$i]["cost"][$m])) {
								array_push($spellsCostArr, $data["data"][$champKeyList[$n]]["spells"][$i]["cost"][$m]);
						}
						if (isset($data["data"][$champKeyList[$n]]["spells"][$i]["range"][$m])) {
								array_push($spellsRangeArr, $data["data"][$champKeyList[$n]]["spells"][$i]["range"][$m]);
						}
						if (isset($data["data"][$champKeyList[$n]]["spells"][$i]["effectBurn"][$m])) {
								array_push($spellsEffectBurnArr, $data["data"][$champKeyList[$n]]["spells"][$i]["effectBurn"][$m]);
						}
				}
				// effects count for current spell
				$spellsEffectCount = count($data["data"][$champKeyList[$n]]["spells"][$i]["effect"]);
				for ($j = 0; $j < $spellsEffectCount; $j++) {
						// check number of ranks for current effect
						$spellsEffectRankCount = count($data["data"][$champKeyList[$n]]["spells"][$i]["effect"][$j]);
						$spellsEffectElements = null;
						// collect all elements from effect arrays
						for ($k = 0; $k < $spellsEffectRankCount; $k++) {
								if (isset($data["data"][$champKeyList[$n]]["spells"][$i]["effect"][$j][$k])) {
										$spellsEffectElements .= $data["data"][$champKeyList[$n]]["spells"][$i]["effect"][$j][$k];
										// add a slash between elements, unless it's the last element in the array (-1)
										if ($k !== $spellsEffectRankCount - 1) {
												$spellsEffectElements .= "/";
										}
								}
						}
						array_push($spellsEffectArr, $spellsEffectElements);
				}
				$spellsCooldown = implode(", ", $spellsCooldownArr);
				$spellsCost = implode(", ", $spellsCostArr);
				$spellsEffect = implode(", ", array_filter($spellsEffectArr)); // filter out null values
				$spellsEffectBurn = implode(", ", array_filter($spellsEffectBurnArr)); // filter out null values
				$spellsRange = implode(", ", $spellsRangeArr);
				// escapes special characters
				$spellsId = mysqli_real_escape_string($con, $spellsId);
				$spellsName = mysqli_real_escape_string($con, $spellsName);
				$spellsDescription = mysqli_real_escape_string($con, $spellsDescription);
				$spellsTooltip = mysqli_real_escape_string($con, $spellsTooltip);
				$spellsCooldown = mysqli_real_escape_string($con, $spellsCooldown);
				$spellsCooldownBurn = mysqli_real_escape_string($con, $spellsCooldownBurn);
				$spellsCost = mysqli_real_escape_string($con, $spellsCost);
				$spellsCostBurn = mysqli_real_escape_string($con, $spellsCostBurn);
				$spellsEffect = mysqli_real_escape_string($con, $spellsEffect);
				$spellsEffectBurn = mysqli_real_escape_string($con, $spellsEffectBurn);
				$spellsCostType = mysqli_real_escape_string($con, $spellsCostType);
				$spellsRange = mysqli_real_escape_string($con, $spellsRange);
				$spellsRangeBurn = mysqli_real_escape_string($con, $spellsRangeBurn);
				$spellsImageFull = mysqli_real_escape_string($con, $spellsImageFull);
				$spellsImageSprite = mysqli_real_escape_string($con, $spellsImageSprite);
				$spellsResource = mysqli_real_escape_string($con, $spellsResource);
				// insert champions spells to championspells table or display error
				$insertChampSpells = mysqli_query($con, "INSERT INTO championspells
																				 (SpellId, ChampId, HotKey, ShortNameId, `Name`, Description,
																					Tooltip, MaxRank, Cooldown, CooldownBurn, Cost, CostBurn,
																					Effect, EffectBurn, CostType, `Range`, RangeBurn,
																					Resource, ImageFull, ImageSprite)
																	VALUES ('$spellsPrimaryKey', '$champKey', '$hotKey', '$spellsId',
																					'$spellsName', '$spellsDescription', '$spellsTooltip',
																					'$spellsMaxRank', '$spellsCooldown', '$spellsCooldownBurn',
																					'$spellsCost', '$spellsCostBurn', '$spellsEffect',
																					'$spellsEffectBurn', '$spellsCostType',
																					'$spellsRange', '$spellsRangeBurn', '$spellsResource',
																					'$spellsImageFull', '$spellsImageSprite')
																	ON DUPLICATE KEY UPDATE SpellId=$spellsPrimaryKey") or die(mysqli_error($con));
				// row count for spells insert
				if ($insertChampSpells !== false) {
						$insertChampSpellsRowCount++;
				}
		}
}

$date = date('Y-m-d H:i:s');
$insertLastUpdate = mysqli_query($con, "INSERT INTO updates (LastChampionUpdate)
																VALUES ('$date')") or die (mysqli_error($con));

echo "<b>ChampionStats - " . $insertChampStatsRowCount . " rows updated</b>";
echo "<br /><br />";
echo "<b>ChampionSpells - " . $insertChampSpellsRowCount . " rows updated</b><br/><br/>";
mysqli_close($con);

/*
 * Copyright © 2018 - LEAGUECENSUS.COM
 */

?>
