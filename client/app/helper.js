"use strict";


// build Request for fetching data from server
export var getRequestHeader = (url, method, data = null) => {
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
export var displayMessage = (tooltip, msg) => {
	tooltip.innerText = msg;

	// display tooltip
	tooltip.className = "";
}

// hide error message
export var hideMessage = (tooltip) => {
	// display tooltip
	tooltip.className = "hidden";
}








