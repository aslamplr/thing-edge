export function getStatus(success, error) {
  xmlHttpRequest('GET', '/api/led', success, error);
}

export function setStatus(status, success, error){
  xmlHttpRequest('POST', '/api/led', success, error, {status: status});
}

function xmlHttpRequest(method, url, success, error, data) {
    const request = new XMLHttpRequest();
    request.open(method, url, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            success(data);
        } else {
            // We reached our target server, but it returned an error
            error();
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        error();
    };

    if (method === 'POST') {
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(data));
    } else {
        request.send();
    }
}
