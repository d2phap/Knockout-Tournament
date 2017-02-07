"use strict"

const { Match } = require('../models/Match.js')
const { Team } = require('../models/Team.js')
const { Tournament } = require('../models/Tournament.js')


const helper = require('./helper.js')
const config = require('../../../shared/config.js')

var tournament
const localhost = "http://localhost:8765/"

window.onload = () => {
    let tooltip = document.getElementById("message")

    // onClick event of START button
    document.getElementById("start").addEventListener("click", () => {
        let txtNumberOfTeams = document.getElementById("numberOfTeams")
        
        // hide error message if it is opened
        helper.hideMessage(tooltip)

        tournament = getTournament(txtNumberOfTeams.value)
        console.log(tournament)


        // helper.displayMessage(tooltip, err.message)
        // txtNumberOfTeams.focus()
        // txtNumberOfTeams.select()
        
    })

    // onChange of numberOfTeams text box
    document.getElementById("numberOfTeams").addEventListener("change", () => {

        // hide error message
        helper.hideMessage(tooltip)
    })





    //read Tournament data from server
    var getTournament = (numberOfTeams) => {
        let url = `${localhost}tournament`
        let params = `numberOfTeams=${numberOfTeams}`
        let matchUps = new Array()

        const tournamentData =  helper.fetchData(url, "POST", params)

        //read MatchUps data
        tournamentData.matchUps.forEach((item) => {
            let teams = new Array(config.TEAMS_PER_MATCH)

            //read Teams of match
            item.teamIds.forEach((teamId) => {
                let teamName = ""
                let teamScore = 0
                let teamParams = `tournamentId=${tournamentData.tournamentId}&teamId=${teamId}`

                const teamObject =  getTeam(tournamentData.tournamentId, teamId)
                console.log(teamObject)
                teams.push(teamObject)

            }, this) //end foreach Teams

            let match = new Match(item.match, 0, teams, 0)
            matchUps.push(match)

        }, this) //end foreach MatchUps



        return new Tournament(tournamentData.tournamentId, matchUps, config.TEAMS_PER_MATCH)
    }



    //read Team data from server
    var getTeam = (tournamentId, teamId) => {
        let teamParams = `tournamentId=${tournamentId}&teamId=${teamId}`

        let teamData = helper.fetchData(`${localhost}team`, "GET", teamParams)
        return new Team(teamData.id, teamData.name, teamData.score)
    }






}







