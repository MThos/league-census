/*
 * @program:	    lolcensus.js
 * @description:    Scripts for lolcensus.com
 * @author:         Mykel Agathos
 * @date:           Nov 26, 2016
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

/*
 * @function:       main function
 * @description:    auto-fill champion text box with names
 * @param:          none
 * @returns:        none
 */
$( function() {
    var availableTags = [
        "Aatrox",
        "Ahri",
        "Akali",
        "Alistar",
        "Amumu",
        "Anivia",
        "Annie",
        "Ashe",
        "Aurelion Sol",
        "Azir",
        "Bard",
        "Blitzcrank",
        "Brand",
        "Braum",
        "Caitlyn",
        "Cassiopeia",
        "Cho'Gath",
        "Corki",
        "Darius",
        "Diana",
        "Dr. Mundo",
        "Draven",
        "Ekko",
        "Elise",
        "Evelynn",
        "Ezreal",
        "Fiddlesticks",
        "Fiora",
        "Fizz",
        "Galio",
        "Gangplank",
        "Garen",
        "Gnar",
        "Gragas",
        "Graves",
        "Hecarim",
        "Heimerdinger",
        "Illaoi",
        "Irelia",
        "Ivern",
        "Janna",
        "Jarvan IV",
        "Jax",
        "Jayce",
        "Jhin",
        "Jinx",
        "Kalista",
        "Karma",
        "Karthus",
        "Kassadin",
        "Katarina",
        "Kayle",
        "Kennen",
        "Kha'Zix",
        "Kindred",
        "Kled",
        "Kog'Maw",
        "LeBlanc",
        "Lee Sin",
        "Leona",
        "Lissandra",
        "Lucian",
        "Lulu",
        "Lux",
        "Malphite",
        "Malzahar",
        "Maokai",
        "Master Yi",
        "Miss Fortune",
        "Mordekaiser",
        "Morgana",
        "Nami",
        "Nasus",
        "Nautilus",
        "Nidalee",
        "Nocturne",
        "Nunu",
        "Olaf",
        "Orianna",
        "Pantheon",
        "Poppy",
        "Quinn",
        "Rammus",
        "Rek'Sai",
        "Renekton",
        "Rengar",
        "Riven",
        "Rumble",
        "Ryze",
        "Sejuani",
        "Shaco",
        "Shen",
        "Shyvana",
        "Singed",
        "Sion",
        "Sivir",
        "Skarner",
        "Sona",
        "Soraka",
        "Swain",
        "Syndra",
        "Tahm Kench",
        "Taliyah",
        "Talon",
        "Taric",
        "Teemo",
        "Thresh",
        "Tristana",
        "Trundle",
        "Tryndamere",
        "Twisted Fate",
        "Twitch",
        "Udyr",
        "Urgot",
        "Varus",
        "Vayne",
        "Veigar",
        "Vel'Koz",
        "Vi",
        "Viktor",
        "Vladimir",
        "Volibear",
        "Warwick",
        "Wukong",
        "Xerath",
        "XinZhao",
        "Yasuo",
        "Yorick",
        "Zac",
        "Zed",
        "Ziggs",
        "Zilean",
        "Zyra"
    ];
    $("#searchedName").autocomplete({
        source: availableTags
    });

    // back-to-top button
    var amountScrolled = 300;

    $(window).scroll(function() {
        if ( $(window).scrollTop() > amountScrolled ) {
            $('a.back-to-top').fadeIn('slow');
        } else {
            $('a.back-to-top').fadeOut('slow');
        }
    });

    $('a.back-to-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 700);
        return false;
    });
} );

/*
 * Copyright © 2017 - LOLCENSUS.COM
 */