"use strict";

const { Match } = require('../models/Match.js');
const { Team } = require('../models/Team.js');
const { Tournament } = require('../models/Tournament.js');


const helper = require('./helper.js');
const config = require('../../../shared/config.js');

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








