/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const { Match } = __webpack_require__(2);
const { Team } = __webpack_require__(3);
const { Tournament } = __webpack_require__(4);


const helper = __webpack_require__(1);
const config = __webpack_require__(5);

var tournament;
const localhost = "http://localhost:8765/";

window.onload = () => {
    let tooltip = document.getElementById("message");

    // onClick event of START button
    document.getElementById("start").addEventListener("click", () => {
        let txtNumberOfTeams = document.getElementById("numberOfTeams");
        
        // hide error message if it is opened
        helper.hideMessage(tooltip);

        //start game
        getTournament(txtNumberOfTeams.value).then((data) => {
            tournament = data;
            console.info(data);
            if (data.hasOwnProperty("error")) {

                if (data.errorAt == "tournament") {
                    helper.displayMessage(tooltip, data.message);
                }
                else {
                    helper.displayMessage(tooltip, "There was an error from server. \nPlease try again later!");
                }
                
                txtNumberOfTeams.focus();
                txtNumberOfTeams.select();

                tournament = null;
                return;
            }
            
        });
        
        
    })

    // onChange of numberOfTeams text box
    document.getElementById("numberOfTeams").addEventListener("change", () => {

        // hide error message
        helper.hideMessage(tooltip);
    })



}





var getTournament = async (numberOfTeams) => {

	// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	console.info("|--- START fetching tournament");


	// retrieve Tournament info from server
    let request = helper.getRequestHeader(`${localhost}tournament`, "POST", `numberOfTeams=${numberOfTeams}`);
    let tournamentData = await (await fetch(request)).json();
    
    // check error message
    if (tournamentData.hasOwnProperty("error")) {
        tournamentData.errorAt = "tournament";
        return tournamentData;
    }

	// build tournament data ******************
	let tournamentItem = new Tournament();
	tournamentItem.id = tournamentData.tournamentId;
	tournamentItem.teamsPerMatch = config.TEAMS_PER_MATCH;

	// build matchups data ********************
	let matchUps = new Array();

	for (let match_item of tournamentData.matchUps) {

		let match = new Match();
		match.id = match_item.match;
		match.round = 0; //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

		// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		console.info("|    |--- Building match ups: " + match.id);


		// build team data ********************
		let teams = new Array();

		for (let team_id of match_item.teamIds) {
			let team = new Team();
			team.id = team_id;

			//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
			console.info("|    |    |--- Building team: " + team.id);

			// retrieve Team info from server
            request = helper.getRequestHeader(`${localhost}team`, "GET", `tournamentId=${tournamentItem.id}&teamId=${team.id}`);
            let teamData = await (await fetch(request)).json();

            // check error message
            if (teamData.hasOwnProperty("error")) {
                teamData.errorAt = "team";
                return teamData;
            }

			team.name = teamData.name;
			team.score = teamData.score;

			// add a new team
			teams.push(team);

            //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            console.info("|    |    |    Done! Team ID: " + team.id);

		} // end for of match.teamIds


		// add teams to this match
		match.teams = teams;

		// retrieve Match info from server
		request = helper.getRequestHeader(`${localhost}match`, "GET", `tournamentId=${tournamentItem.id}&round=${match.round}&match=${match.id}`);
        let matchUpData = await (await fetch(request)).json();

        // check error message
        if (matchUpData.hasOwnProperty("error")) {
            matchUpData.errorAt = "match";
            return matchUpData;
        }

		match.score = matchUpData.score;


		// add a new match
		matchUps.push(match);

        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        console.info("|    |    Done! Match ID: " + match.id);

	} // end for of matchUps


	tournamentItem.matchUps = matchUps;

	// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	console.info("|--- FINISHED fetching tournament: " + tournamentItem.id);
	// console.info(tournament);

    return tournamentItem;
}










/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRequestHeader", function() { return getRequestHeader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "displayMessage", function() { return displayMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hideMessage", function() { return hideMessage; });



// build Request for fetching data from server
var getRequestHeader = (url, method, data) => {
    let init = {
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        method: method
    };

    //add parameters
    if (method == "GET") {
        url = `${url}?${data}`;
    }
    else { //a request using the GET or HEAD method cannot have a body
        init.body = data;
    }

    return new Request(url, init);
}




// display error message
var displayMessage = (tooltip, msg) => {
	tooltip.innerText = msg;

	// display tooltip
	tooltip.className = "";
}

// hide error message
var hideMessage = (tooltip) => {
	// display tooltip
	tooltip.className = "hidden";
}










/***/ }),
/* 2 */
/***/ (function(module, exports) {

class Match {
	constructor(id, round, teams, score) {
		this.id = id;
		this.round = round;
		this.teams = teams;
		this.score = score;
	}

}

module.exports = { Match };


/***/ }),
/* 3 */
/***/ (function(module, exports) {

class Team {
	constructor(id, name, score) {
		this.id = id;
		this.name = name;
		this.score = score;
	}

}

module.exports = { Team };


/***/ }),
/* 4 */
/***/ (function(module, exports) {


class Tournament {
	constructor(id, matchUps, teamsPerMatch) {
		this.id = id;
		this.matchUps = matchUps;
		this.teamsPerMatch = teamsPerMatch;
	}

}


module.exports = { Tournament };


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// Constants shared between client and server.

var TEAMS_PER_MATCH = 2;

var exports = exports || null;
if (exports) {
  exports.TEAMS_PER_MATCH = TEAMS_PER_MATCH;
}



/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Edit me.
// Feel free to add other JS files in this directory as you see fit.



__webpack_require__(0)







/***/ })
/******/ ]);