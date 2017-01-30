<?php

/*
 * @program:	    auth.php
 * @description:    Protect API key by pulling from the database
 *                  and passing it into the url requested.
 * @author:         Mykel Agathos
 * @date:           Dec 14, 2015
 * @revision:	    v1.0.0
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

// disable error reporting to hide api key on error messages
error_reporting(0);
// parse server settings into $config array
$config = parse_ini_file("secure/config.ini");
$con = mysqli_connect($config["host"],
                      $config["sqlUser"],
                      $config["sqlPass"],
                      $config["dbName"]);
if ($con === false) {
    return mysqli_connect_error();
}
// select API key from db
$apiQuery = mysqli_query($con, "SELECT api_key FROM secure_api");
$keyFetch = mysqli_fetch_assoc($apiQuery);
$key = $keyFetch["api_key"];
// ajax call - json - pass in api key from server to client
header("Content-Type: application/json");
$url = $_GET["url"];
$json = file_get_contents("https://".$url."api_key=".$key);
$obj = json_decode($json);
echo json_encode($obj, JSON_PRETTY_PRINT);



/*
 * Copyright © 2017 - LOLCENSUS.COM
 */

?>