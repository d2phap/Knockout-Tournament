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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const { MatchUp } = __webpack_require__(5);
const { Team } = __webpack_require__(7);
const { Round } = __webpack_require__(6);
const { Tournament } = __webpack_require__(8);

const { RoundController } = __webpack_require__(2);
const { MatchUpController } = __webpack_require__(1);
const helper = __webpack_require__(4);

const configs = __webpack_require__(3);


window.onload = () => {
    let tooltip = document.getElementById("message");

    // onChange of numberOfTeams text box
    document.getElementById("numberOfTeams").addEventListener("change", () => {

        // hide error message
        helper.hideMessage(tooltip);
    });


    
    

    // onClick event of START button
    document.getElementById("start").addEventListener("click", () => {
        let txtNumberOfTeams = document.getElementById("numberOfTeams");
        let numberOfTeams = txtNumberOfTeams.value;
        
        // hide error message if it is opened
        helper.hideMessage(tooltip);

        let winner = document.getElementById("winner");
        let gameMap = document.getElementById("gameMap");
        let gameMsg = document.getElementById("gameMsg");
        let btnStart = document.getElementById("start");

        // hiden winner info
        winner.innerText = "";
        winner.className = "hidden";
        gameMsg.innerText = "Game is loading...";

        // redraw match ups squares
        gameMap.innerHTML = "";

        txtNumberOfTeams.setAttribute("disabled", "disabled");
        btnStart.setAttribute("disabled", "disabled");

        //start game
        startTournament(numberOfTeams).then((data) => {
            
            txtNumberOfTeams.removeAttribute("disabled");
            btnStart.removeAttribute("disabled");
            
            if (data.hasOwnProperty("error")) {

                if (data.errorAt == "tournament") {
                    helper.displayMessage(tooltip, data.message);
                }
                else {
                    helper.displayMessage(tooltip, "There was an error from server. \nPlease try again later!");
                }
                
                txtNumberOfTeams.focus();
                txtNumberOfTeams.select();
                gameMsg.innerText = "";

            }
            else {
                // show winner info
                gameMsg.innerText = "The winner is";
                winner.innerText = data.winner.name;
                winner.className = "";
            }
        }); // END startTournament
        
        
    });
} // END window.onload


// initial setup for game
var initGame = (numberOfMatchUps) => {

    let winner = document.getElementById("winner");
    let gameMap = document.getElementById("gameMap");

    // hiden winner info
    winner.innerText = "";
    winner.className = "hidden";

    // redraw match ups squares
    gameMap.innerHTML = "";

    for (let i = 0; i < numberOfMatchUps; i++) {
        let matchSquare = document.createElement("li");
        matchSquare.setAttribute("id", `match-${i}`);

        gameMap.appendChild(matchSquare);
    }
}


// start the tournament game
var startTournament = async (numberOfTeams) => {

    /**************************************************************************
    * [1] retrieve CONFIGURATION from server */
    console.group("Reading CONFIGURATIONS from server...");

    let request = helper.getRequestHeader(`${configs.GAME_SERVER_URL}shared/config.js`, "GET");
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

    request = helper.getRequestHeader(`${configs.GAME_SERVER_URL}tournament`, "POST", `numberOfTeams=${numberOfTeams}`);
    let tournamentData = await (await fetch(request)).json();
    
    // check error message
    if (tournamentData.hasOwnProperty("error")) {
        console.groupEnd();
        console.groupEnd();

        tournamentData.errorAt = "tournament";
        return tournamentData;
    }

    console.info("Done! tournamentData = ");
    console.table(tournamentData);
    console.groupEnd();

	let tournamentItem = new Tournament();
	tournamentItem.id = tournamentData.tournamentId;
	tournamentItem.teamsPerMatch = TEAMS_PER_MATCH;
    tournamentItem.rounds = [];
    tournamentItem.teams = [];
    


    /**************************************************************************
    * [2.1] create Team list of the tournament */
    console.group("Creating TEAM LIST of the tournament ...");
    let gameMsg = document.getElementById("gameMsg");

    for (let match_item of tournamentData.matchUps) {

        for (let team_id of match_item.teamIds) {

            console.group(`Creating TEAM: ${team_id} ...`);

            let team = new Team();
            team.id = team_id;
            team.tournamentId = tournamentItem.id;

            console.group(`Retrieving TEAM INFO from server...`);

            // retrieve Team info from server
            request = helper.getRequestHeader(`${configs.GAME_SERVER_URL}team`, "GET", `tournamentId=${tournamentItem.id}&teamId=${team.id}`);
            let teamData = await (await fetch(request)).json();

            // check error message
            if (teamData.hasOwnProperty("error")) {
                console.groupEnd();
                console.groupEnd();
                console.groupEnd();
                console.groupEnd();

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

            // add team to the Team List
            tournamentItem.teams.push(team);

            // send message on UI
            gameMsg.innerText = `Game is loading...${Math.ceil((team_id + 1)*100 / numberOfTeams)}%...`;
        }
    }

    console.info("Done! tournamentItem.teams = ");
    console.table(tournamentItem.teams);
    console.groupEnd();
    /* [/2.1] *****************************************************************/


    // Init game
    let numberOfMatchUps = MatchUpController.getNumberOfMatchUps (numberOfTeams, TEAMS_PER_MATCH);
    let currentMatchIndex = 0; // for mark the match done on UI
    initGame(numberOfMatchUps);


    /**************************************************************************
    * [2.2] create Round of the tournament */
    console.group("Creating ROUND LIST of the tournament ...");

    // create tournament data
    let numberOfRounds = RoundController.getNumberOfRounds(numberOfTeams, TEAMS_PER_MATCH);
    let currentRoundId = 0;

    // all teams will join in the first round - also determine the winners of a round
    let winnersOfRound = tournamentItem.teams;



    do {
        // start the round
        console.group(`Creating ROUND: ${currentRoundId}`);
        // send message on UI
        gameMsg.innerText = `ROUND ${currentRoundId + 1}`;

        let round = new Round();
        round.id = currentRoundId;
        round.tournamentId = tournamentItem.id;
        round.matchUps = [];

        // get matchups of this round
        let matchDataOfRound;
        if (currentRoundId == 0) {
            matchDataOfRound = RoundController.getMatchUpsOfRound(winnersOfRound, tournamentItem.teamsPerMatch, tournamentData.matchUps);
        }
        else {
            matchDataOfRound = RoundController.getMatchUpsOfRound(winnersOfRound, tournamentItem.teamsPerMatch); 
        }

        // clear team list for next round
        winnersOfRound = [];

        // get match list of this round ----------------------------------------
        console.group(`Creating MATCH UPS of round: ${currentRoundId}`);
        
        for (let match_item of matchDataOfRound) {

            console.group(`Creating MATCH: ${match_item.match} ...`);
            // send message on UI
            let matchElement = document.getElementById(`match-${currentMatchIndex}`);
            matchElement.className = "playing"; // mark this match is being played
            gameMsg.innerText = `ROUND ${currentRoundId + 1} - MATCH ${match_item.match + 1}`;

            let match = new MatchUp();
            match.id = match_item.match;
            match.roundId = round.id; 
            match.tournamentId = tournamentItem.id;
            match.teams = [];

            console.group(`Retrieving MATCH SCORE from server of match.id = ${match.id} ...`);

            // retrieve Match score from server ------------------------------
            request = helper.getRequestHeader(`${configs.GAME_SERVER_URL}match`, "GET", `tournamentId=${tournamentItem.id}&round=${match.roundId}&match=${match.id}`);
            let matchUpData = await (await fetch(request)).json();

            // check error message
            if (matchUpData.hasOwnProperty("error")) {
                console.groupEnd();
                console.groupEnd();
                console.groupEnd();
                console.groupEnd();
                console.groupEnd();
                console.groupEnd();

                matchUpData.errorAt = "match";
                return matchUpData;
            }

            match.score = matchUpData.score;

            console.info(`Done! match.score = ${match.score}`);
            console.groupEnd();

            
            // params to determine winner
            let winnerParams = `tournamentId=${tournamentItem.id}&matchScore=${match.score}`; 

            // get team list of this match ---------------------------------
            for (let team_id of match_item.teamIds) {

                // add team to this match
                match.teams.push(tournamentItem.teams[team_id]);

                // add team score to params
                winnerParams += "&teamScores=" + tournamentItem.teams[team_id].score;
            }
            

            console.group(`Determining the WINNER of match.id = ${match.id} ...`);

            // retrieve Winner Score from server -----------------------------
            request = helper.getRequestHeader(`${configs.GAME_SERVER_URL}winner`, "GET", winnerParams);
            let winnerScoreData = await (await fetch(request)).json();

            // get winner of this match
            match.winner = match.teams.find((a) => {
                return a.score == winnerScoreData.score;
            });

            // mark this match is done on the UI
            // document.getElementById(`match-${currentMatchIndex}`).className = "done";
            matchElement.className = "done";
            currentMatchIndex++;
            

            console.info(`Done! match.winner =`);
            console.log(match.winner);
            console.groupEnd();
            
            // add team to join in the next round
            winnersOfRound.push(match.winner);

            // add this match to this round
            round.matchUps.push(match);

            console.info(`Done! match = `);
            console.table(match);
            console.groupEnd();

        } // end for matchDataOfRound


        console.info("Done! round.matchUps = ");
        console.table(round.matchUps);
        console.groupEnd();


        // add this round to tournament
        tournamentItem.rounds.push(round);

        // Go to next round
        currentRoundId++;


        console.info("Done! round = ");
        console.table(round);
        console.groupEnd();
    }
    while (currentRoundId < numberOfRounds);



    console.info("Done! tournamentItem.rounds = ");
    console.table(tournamentItem.rounds);
    console.groupEnd();
    /* [/2.2] *****************************************************************/



    // get the winner of tournament
    tournamentItem.winner = winnersOfRound[0];

    console.info(`Done! tournamentItem = `);
    console.table(tournamentItem);
    console.groupEnd();
    /* [/2] *******************************************************************/

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
            numberOfTeams = Math.floor(numberOfTeams / teamsPerMatch);
            match_count += numberOfTeams;

            // console.warn("numberOfTeams = " + numberOfTeams);
            // console.warn("match_count = " + match_count);
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

	// get match ups of a round
    static getMatchUpsOfRound (teamsOfCurrentRound, teamsPerMatch, initData = null) {
        
        if (initData != null) {
            return initData;
        }

		let matchUps = [];
        let teamsInMatchUp = [];

		for (let i = 0; i < teamsOfCurrentRound.length; i++) {
			teamsInMatchUp.push(teamsOfCurrentRound[i].id);

			if (teamsInMatchUp.length === teamsPerMatch) {
				matchUps.push({
					match: matchUps.length,
					teamIds: teamsInMatchUp.splice(0)
				});
			}
		}

        return matchUps;
    }
    
}

module.exports = { RoundController };

/***/ }),
/* 3 */
/***/ (function(module, exports) {


const GAME_SERVER_URL = "http://localhost:9876/"; // for selenium server
// const GAME_SERVER_URL = "http://localhost:8765/"; // for game server

var exports = exports || null;
if (exports) {
	exports.GAME_SERVER_URL = GAME_SERVER_URL;
}



/***/ }),
/* 4 */
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
        mode: 'no-cors',
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
/* 5 */
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
/* 6 */
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
/* 7 */
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
/* 8 */
/***/ (function(module, exports) {

class Tournament {
	constructor(id, teamsPerMatch, rounds, teams, winner) {
		this.id = id;
		this.teamsPerMatch = teamsPerMatch;
		this.rounds = rounds;
		this.teams = teams;
		this.winner = winner;
	}
}


module.exports = { Tournament };


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Edit me.
// Feel free to add other JS files in this directory as you see fit.




__webpack_require__(0);






/***/ })
/******/ ]);