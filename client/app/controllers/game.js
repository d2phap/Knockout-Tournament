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
        let url = localhost + "tournament"
        let params = "numberOfTeams=" + txtNumberOfTeams.value
        

        // hide error message if it is opened
        helper.hideMessage(tooltip)

        helper.sendRequest(url, "POST", params, (status, response) => {
            if (status == 200) { // success
                //tournament = response
                tournament = new Tournament(response.tournamentId, null, config.TEAMS_PER_MATCH)

                console.log(tournament)
            }
            else { // error
                helper.displayMessage(tooltip, response.message)
                txtNumberOfTeams.focus()
                txtNumberOfTeams.select()
            }
        })
    })

    // onChange of numberOfTeams text box
    document.getElementById("numberOfTeams").addEventListener("change", () => {

        // hide error message
        helper.hideMessage(tooltip)
    })

    







}







