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


export var fetchData = async (url, method, data, onSuccess = null, onError = null) => {
    let init = {
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        method: method
    }

    //add parameters
    if (method == "GET") {
        url = `${url}?${data}`
    }
    //a request using the GET or HEAD method cannot have a body
    else {
        init.body = data
    }

    let request = new Request(url, init)

    let response = await fetch(request)
    return response.json()

    // fetch(request).then((response) => { //on successful
    //     if(response.ok) {
    //         return Promise.resolve(response) 
    //     }
    // }).then((json) => {
    //     return json.json()
    // }).then((data) => { //data is ready
    //     onSuccess(data)
    // }).catch((err) => { //on error
    //     if (onError != null) {
    //         onError(err)
    //     }
    // })
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





