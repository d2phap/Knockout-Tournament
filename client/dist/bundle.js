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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class Team {
	constructor(id, name, score) {
		this.id = id
		this.name = name
		this.score = score
	}

}


class Match {
	constructor(id, round, teams, score) {
		this.id = id
		this.round = round
		this.teams = teams
		this.score = score
	}

}


class Tournament {
	constructor(id, matchups, teamsPerMatch) {
		this.id = id
		this.matchups = matchups
		this.teamsPerMatch = teamsPerMatch
	}

}


module.exports = {Tournament, Match, Team};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Edit me.
// Feel free to add other JS files in this directory as you see fit.


const {Tournament, Match, Team} = __webpack_require__(0)

var tournament

window.onload = () => {

    // onClick event of START button
    document.getElementById("start").addEventListener("click", () => {
        let txtNumberOfTeams = document.getElementById("numberOfTeams")
        let url = "http://localhost:8765/tournament"
        let params = "numberOfTeams=" + txtNumberOfTeams.value

        // hide error message if it is opened
        hideMessage()

        SendRequest(url, "POST", params, (status, response) => {
            if (status == 200) { // success
                //tournament = response
                tournament = new Tournament(response.tournamentId, null, 2)

                console.log(tournament)
            }
            else { // error
                displayMessage(response.message)
                txtNumberOfTeams.focus()
                txtNumberOfTeams.select()
            }
        })
    })

    // onChange of numberOfTeams text box
    document.getElementById("numberOfTeams").addEventListener("change", () => {

        // hide error message
        hideMessage()
    })

    // display error message
    var displayMessage = (msg) => {
        let tooltip = document.getElementById("message")
        tooltip.innerText = msg

        // display tooltip
        tooltip.className = ""
    }

    // hide error message
    var hideMessage = () => {
        let tooltip = document.getElementById("message")

        // display tooltip
        tooltip.className = "hidden"
    }







}


// Send HTTP request to server
var SendRequest = (url, type, params, callback) => {
    let http = new XMLHttpRequest()

    http.open(type, url, true)

    // send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")

    http.onreadystatechange = () => {
        if (http.readyState == 4) { // ready state

            //get JSON params
            let response = JSON.parse(http.responseText)
            callback(http.status, response)
        }
    }

    http.send(params)
}







/***/ })
/******/ ]);