const davidID = "58a7e5241756fc834d904a5a";
const apiKey = "52f69545ffa7fffb30dc369ac3103f7f";
const C1_URL = "http://api.reimaginebanking.com";

function restCb(xhttp, successCb, errorCb){
  if (xhttp.readyState === 4){
    return (xhttp.status === 200 ||
            xhttp.status === 201 ||
            xhttp.status === 204) ?
            successCb(xhttp.responseText) :
            errorCb(xhttp.status, xhttp.responseText);
  }
}

// requestType = GET, POST, etc.
// contentType = application/json, etc.
// requestStr = stringified JSON or null
// url = /api/...
// successCb returns responseText (needs to be parsed)
// errorCb return xhttpStatus and responseText
export function restRequest( requestType, url, contentType, requestStr, successCb, errorCb ) {
  var xhttp = new XMLHttpRequest();
  xhttp.open(requestType, C1_URL + url, true);
  xhttp.setRequestHeader("Content-Type", contentType);
  // xhttp.setRequestHeader("Authorization", "Bearer " + localStorage.token);
  var f = function(){restCb(xhttp, successCb, errorCb)};
  xhttp.onreadystatechange = f;
  xhttp.send("key="+apiKey);
}
