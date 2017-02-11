"use strict";

const { MatchUp } = require('../models/MatchUp.js');
const { Team } = require('../models/Team.js');
const { Round } = require('../models/Round.js');
const { Tournament } = require('../models/Tournament.js');

const { RoundController } = require('./RoundController.js');
const { MatchUpController } = require('./MatchUpController.js');
const helper = require('./helper.js');



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








