
/* javascript */

const clientId = '619dc4ae72bb482c9627b588fc4cba36';
const clientSecret = '551dfacf8408410caf30a92880e99a1f';
var access_token;
var refresh_token;

const getAuthorization = (function () {
    var url = 'https://accounts.spotify.com/authorize?'
    url += 'client_id=' + clientId;
    url += '&response_type=code';
    url += '&redirect_uri=https://etgeorge.github.io/dig245-final/';

    window.location.href=url;
    
});

function getCode()  {
    let code = null;
    const searchQuery = window.location.search;

    if (searchQuery.length > 0){
        const urlParams = new URLSearchParams(searchQuery);
        code = urlParams.get('code');
    } else {
        getAuthorization();
    }

    return code;
}




function handleRedirect (){
    let code = getCode();
    getToken(code);
}


function getToken(code){
    let body = 'grant_type=authorization_code';
    body += '&code='+code;
    body += '&redirect_uri='+encodeURI('https://etgeorge.github.io/dig245-final/');
    body += '&client_id' + clientId;
    body += '&client_secret'+clientSecret;
    fetchAuthorizationApi(body);
}

function fetchAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://accounts.spotify.com/api/token?", true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic '+ btoa(clientId+":"+clientSecret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse(){
    var data = JSON.parse(this.responseText);
    document.getElementById("result").innerText = "This token is: " + data.access_token;
    access_token = data.access_token;
    $('#query').show();
}

function fetchPlaylistApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.spotify.com/v1/me/playlists?", true)
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer '+ access_token);
    xhr.send(body);
    xhr.onload = handlePlaylistResponse;
}

function handlePlaylistResponse(){
    var data = JSON.parse(this.responseText);
    console.log(data);
}

function displayAnswer(){
    console.log("This worked")
    let result = document.querySelector('input[name="flexRadioDefault"]:checked').value;
    document.getElementById("answer").innerText = "You selected answer #" +result;


}

if (window.location.search.length  > 0){
    handleRedirect();
}


//SPA Functions

function loadExperience() {
	console.log("Page loaded");
	// hide / show sections
	$("#experience").show();
	$("#introduction").hide();
	$("#solutions").hide();
    
}

function loadIntroduction() {
	// hide / show sections
	$("#experience").hide();
	$("#introduction").show();
	$("#solutions").hide();
}

function loadSolutions() {
	// hide / show sections
	$("#experience").hide();
	$("#introduction").hide();
	$("#solutions").show();
}
$(document).on("click", ".experience-btn", loadExperience);
$(document).on("click", ".introduction-btn", loadIntroduction);
$(document).on("click", ".solutions-btn", loadSolutions);

loadIntroduction();