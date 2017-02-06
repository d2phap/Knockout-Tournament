"use strict"


// Send HTTP request to server
export var sendRequest = (url, type, params, callback) => {
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

// display error message
export var displayMessage = (tooltip, msg) => {
	tooltip.innerText = msg

	// display tooltip
	tooltip.className = ""
}

// hide error message
export var hideMessage = (tooltip) => {
	// display tooltip
	tooltip.className = "hidden"
}





