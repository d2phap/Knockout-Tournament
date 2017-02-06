// Edit me.
// Feel free to add other JS files in this directory as you see fit.
"use strict"

const {Tournament, Match, Team} = require('./game')

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





