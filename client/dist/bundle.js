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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const { MatchUp } = __webpack_require__(4);
const { Team } = __webpack_require__(6);
const { Round } = __webpack_require__(5);
const { Tournament } = __webpack_require__(7);

const { RoundController } = __webpack_require__(2);
const { MatchUpController } = __webpack_require__(1);
const helper = __webpack_require__(3);



const localhost = "http://localhost:8765/";



window.onload = () => {
    let tooltip = document.getElementById("message");
    

    // onClick event of START button
    document.getElementById("start").addEventListener("click", () => {
        var numberOfTeams = document.getElementById("numberOfTeams").value;
        
        // hide error message if it is opened
        helper.hideMessage(tooltip);

        //start game
        startTournament(numberOfTeams).then((data) => {
            _tournament = data;
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

                _tournament = null;
                return;
            }
            

            console.log(_teamList);
        });
        
        
    })

    // onChange of numberOfTeams text box
    document.getElementById("numberOfTeams").addEventListener("change", () => {

        // hide error message
        helper.hideMessage(tooltip);
    })



}


var _tournament;
var _teamList = [];

var startTournament = async (numberOfTeams) => {

    /**************************************************************************
    * [1] retrieve CONFIGURATION from server */
    console.group("Reading CONFIGURATIONS from server...");

    let request = helper.getRequestHeader(`${localhost}shared/config.js`, "GET");
    const configJs = await (await fetch(request)).text();
    
    // add script to source code
    let script = document.getElementById("config");
    if (script != null) { // exist
        document.body.removeChild(script);
    }
    script = document.createElement("script");
    script.setAttribute("id", "config");
    script.innerHTML = `${configJs}`;
    document.body.appendChild(script);

    console.info("Done! TEAMS_PER_MATCH = " + TEAMS_PER_MATCH);
    console.groupEnd();
    /* [/1] *******************************************************************/


    /**************************************************************************
    * [2] Send request to server to create a Tournament */
    console.group("Starting TOURNAMENT...");

    // retrieve Tournament info from server 
    console.group("Retrieving TOURNAMENT info from server ...");

    request = helper.getRequestHeader(`${localhost}tournament`, "POST", `numberOfTeams=${numberOfTeams}`);
    let tournamentData = await (await fetch(request)).json();
    
    // check error message
    if (tournamentData.hasOwnProperty("error")) {
        tournamentData.errorAt = "tournament";
        return tournamentData;
    }

    console.info("Done! tournamentData = ");
    console.log(tournamentData);
    console.groupEnd();

	// create tournament data
    let numberOfRounds = RoundController.getNumberOfRounds(numberOfTeams, TEAMS_PER_MATCH);
    let numberOfMatchUps = MatchUpController.getNumberOfMatchUps (numberOfTeams, TEAMS_PER_MATCH);
    let currentRoundId = 0;
    let teamsOfRound = []; // create Team list of a Round

	let tournamentItem = new Tournament();
	tournamentItem.id = tournamentData.tournamentId;
	tournamentItem.teamsPerMatch = TEAMS_PER_MATCH;

    /**************************************************************************
    * [2.1] create Match ups of a round */
    console.group(`Creating MATCH UPS for tournamentItem.id = ${tournamentItem.id} ...`);
    let matchUpsOfRound = [];

    for (let match_item of tournamentData.matchUps) {

        console.group(`Creating MATCH: ${match_item.match} ...`);

        let match = new MatchUp();
        match.id = match_item.match;
        match.roundId = currentRoundId; 
        match.tournamentId = tournamentItem.id;

        console.group(`Retrieving MATCH SCORE from server of match.id = ${match.id} ...`);

        // retrieve Match score from server
        request = helper.getRequestHeader(`${localhost}match`, "GET", `tournamentId=${tournamentItem.id}&round=${match.roundId}&match=${match.id}`);
        let matchUpData = await (await fetch(request)).json();

        // check error message
        if (matchUpData.hasOwnProperty("error")) {
            matchUpData.errorAt = "match";
            return matchUpData;
        }

        match.score = matchUpData.score;

        console.info(`Done! match.score = ${match.score}`);
        console.groupEnd();

        



        /**************************************************************************
        * [2.1.1] get TEAMS of a match */
        console.group(`Creating TEAMS for match.id = ${match_item.match} ...`);

        let teamsOfMatch = [];

        for (let team_id of match_item.teamIds) {

            console.group(`Creating TEAM: ${team_id} ...`);

            let team = new Team();
            team.id = team_id;
            team.tournamentId = tournamentItem.id;

            console.group(`Retrieving TEAM INFO from server...`);

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

            console.info(`Done! teamData = `);
            console.log(teamData);
            console.groupEnd();

            console.info(`Done! team = `);
            console.log(team);
            console.groupEnd();

            // add team to the this match
            teamsOfMatch.push(team);

            // add team to the Team List
            _teamList.push(team);
        }

        console.info(`Done! teamsOfMatch = `);
        console.log(teamsOfMatch);
        console.groupEnd();
        /* [/2.1.1] ***************************************************************/



        // add teams to this match
        match.teams = teamsOfMatch;

        // add this match to this round
        matchUpsOfRound.push(match);

        console.info(`Done! match = `);
        console.log(match);
        console.groupEnd();
    }

    console.info("Done! matchUpsOfRound = ");
    console.log(matchUpsOfRound);
    console.groupEnd();
    /* [/2.1] *****************************************************************/


    








    console.info(`Done! tournamentItem.id = ${tournamentItem.id}`);
    console.groupEnd();
    /* [/2] *******************************************************************/

    return tournamentItem;
}













var getTournament = async (numberOfTeams) => {

    // retrieve teamsPerMatch info from server **************************************************************
    let request = helper.getRequestHeader(`${localhost}shared/config.js`, "GET");
    const configJs = await (await fetch(request)).text();
    
    // add script to source code
    let script = document.getElementById("config");
    if (script != null) { // exist
        document.body.removeChild(script);
    }
    script = document.createElement("script");
    script.setAttribute("id", "config");
    script.innerHTML = `${configJs}`;
    document.body.appendChild(script);

    
    // variables
    const teamsPerMatch = TEAMS_PER_MATCH;
    let numberOfRounds = RoundController.getNumberOfRounds(numberOfTeams, teamsPerMatch);
    let numberOfMatchUps = MatchUpController.getNumberOfMatchUps (numberOfTeams, teamsPerMatch);

	// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	console.info("|--- START fetching tournament");


	// retrieve Tournament info from server ******************************************************************
    request = helper.getRequestHeader(`${localhost}tournament`, "POST", `numberOfTeams=${numberOfTeams}`);
    let tournamentData = await (await fetch(request)).json();
    
    // check error message
    if (tournamentData.hasOwnProperty("error")) {
        tournamentData.errorAt = "tournament";
        return tournamentData;
    }

	// build tournament data *********************************************************************************
	let tournamentItem = new Tournament();
	tournamentItem.id = tournamentData.tournamentId;
	tournamentItem.teamsPerMatch = teamsPerMatch;

    // build Rounds data *************************************************************************************
	let rounds = new Array();

    for (let i = 0; i < numberOfRounds; i++) {

		let round = new Round();
		round.id = i;
		round.tournamentId = tournamentItem.id;


        // build matchups data ********************************************************************************
        let matchUps = new Array();

        for (let match_item of tournamentData.matchUps) {

            let match = new MatchUp();
            match.id = match_item.match;
            match.roundId = round.id; 
			match.tournamentId = tournamentItem.id;

			//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
			console.log("|    |--- Building match ups: " + match.id);

            // build team data ********************************************************************************
            let teams = new Array();

            for (let team_id of match_item.teamIds) {
                let winnerParams = `tournamentId=${tournamentItem.id}`; // params to determine winner
                let team = new Team();
                team.id = team_id;
                team.tournamentId = tournamentItem.id;

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

                // add team score to params
                winnerParams += "&teamScores=" + team.score;

                // add a new team
                teams.push(team);
                _teamList.push(team);

                //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                console.info("|    |    |    Done! Team ID: " + team.id);

            } // end for of match.teamIds

            // add teams to this match
            match.teams = teams;

            // retrieve Match info from server
            request = helper.getRequestHeader(`${localhost}match`, "GET", `tournamentId=${tournamentItem.id}&round=${match.roundId}&match=${match.id}`);
            let matchUpData = await (await fetch(request)).json();

            // check error message
            if (matchUpData.hasOwnProperty("error")) {
                matchUpData.errorAt = "match";
                return matchUpData;
            }

            match.score = matchUpData.score;
            winnerParams += "&matchScore=" + match.score; // add match score to params

            // retrieve Winner Score from server **************************************************************
            request = helper.getRequestHeader(`${localhost}winner`, "GET", winnerParams);
            let winnerScoreData = await (await fetch(request)).json();

            // find winner
            let winner = teams.find((a) => {
                return a.score == winnerScoreData.score;
            });
            match.winnerId = winner.id;


            // add a new match
            matchUps.push(match);

            //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            console.info("|    |    Done! Match ID: " + match.id);

        } // end for of matchUps






        round.matchUps = matchUps;
		rounds.push(round);

	} // end for of numberOfRounds





	tournamentItem.rounds = rounds;

	// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	console.info("|--- FINISHED fetching tournament: " + tournamentItem.id);
	// console.info(tournament);

    return tournamentItem;
}










/***/ }),
/* 1 */
/***/ (function(module, exports) {

class MatchUpController {
    constructor() {
        
    }
    
    // get number of matchUps in a tournament
    static getNumberOfMatchUps (numberOfTeams, teamsPerMatch) {
        let match_count = 0;
        while (numberOfTeams != 1) {
            numberOfTeams = numberOfTeams / teamsPerMatch;
            match_count += numberOfTeams;
        }
        return match_count;
    }
    
}

module.exports = { MatchUpController };

/***/ }),
/* 2 */
/***/ (function(module, exports) {

class RoundController {
    constructor () {

    }
    
    // get number of rounds in a tournament
    static getNumberOfRounds (numberOfTeams, teamsPerMatch) {
        let numberOfRounds = Math.log(numberOfTeams) / Math.log(teamsPerMatch);
        return Math.floor(numberOfRounds);
    }
    
}

module.exports = { RoundController };

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRequestHeader", function() { return getRequestHeader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "displayMessage", function() { return displayMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hideMessage", function() { return hideMessage; });



// build Request for fetching data from server
var getRequestHeader = (url, method, data = null) => {
    let init = {
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        method: method
    };

    //add parameters
    if (data != null) {
        if (method == "GET") {
            url = `${url}?${data}`;
        }
        else { //a request using the GET or HEAD method cannot have a body
            init.body = data;
        }
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
/* 4 */
/***/ (function(module, exports) {

class MatchUp {
	constructor(id, roundId, tournamentId, score, teams, winner) {
		this.id = id;
		this.roundId = roundId;
		this.tournamentId = tournamentId;
		this.score = score;
		this.teams = teams;
		this.winner = winner;
	}
}

module.exports = { MatchUp };


/***/ }),
/* 5 */
/***/ (function(module, exports) {

class Round {
	constructor(id, tournamentId, matchUps) {
		this.id = id;
		this.tournamentId = tournamentId;
		this.matchUps = matchUps;
	}
}

module.exports = { Round };


/***/ }),
/* 6 */
/***/ (function(module, exports) {

class Team {
	constructor(id, tournamentId, name, score) {
		this.id = id;
		this.tournamentId = tournamentId;
		this.name = name;
		this.score = score;
	}
}

module.exports = { Team };


/***/ }),
/* 7 */
/***/ (function(module, exports) {

class Tournament {
	constructor(id, teamsPerMatch, rounds, winner) {
		this.id = id;
		this.teamsPerMatch = teamsPerMatch;
		this.rounds = rounds;
		this.winner = winner;
	}
}


module.exports = { Tournament };


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Edit me.
// Feel free to add other JS files in this directory as you see fit.



__webpack_require__(0)







/***/ })
/******/ ]);