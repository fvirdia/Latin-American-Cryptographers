function loadJSON(url, callback) {
    var http_request = new XMLHttpRequest();

    http_request.onreadystatechange = function() {

    if (http_request.readyState == 4) {
        // Javascript function JSON.parse to parse JSON data
        var jsonObj = JSON.parse(http_request.responseText);
        callback(jsonObj);
        }
    }

    http_request.open("GET", url, true);
    try {
        http_request.send();
    } catch (err) {
        console.log("Error during load of " + url + ":");
        console.log(err);
    }
}
