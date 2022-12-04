
/* javascript */

const clientId = '619dc4ae72bb482c9627b588fc4cba36';
const clientSecret = '551dfacf8408410caf30a92880e99a1f';
var access_token;
var refresh_token;
var questionIndex = 0;
var questionArray = ["How old are you?"];
var answerArray = ['This is the * answer']

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
        authorized = true;
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
    
    access_token = data.access_token;
    console.log(access_token);
    fetchPlaylistApi();
    
}

function fetchPlaylistApi(body){
    console.log("Trying to get playlist")
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
    var firstPlaylist = data.items[0].name;
    console.log(firstPlaylist);
    window.history.replaceState(null, null, window.location.pathname);
    scrollBy(0,450);
    //call the next question
    displayPlaylistAnswer(firstPlaylist);
}

function displayPlaylistAnswer(playlist){
    $('#playlist').text("Your most recently created playlist is "+playlist);
    $('#next-question').show();
    $('#authorize').hide();
}

function displayAnswer(){
    console.log("This worked")
    let result = document.querySelector('input[name="flexRadioDefault"]:checked').value;
    document.getElementById("answer").innerText = "You selected answer #" +result;
    let currentQuestion = '#'+questionIdArray[0];
    
    $(currentQuestion).hide();

    //display next question
    questionIdArray.shift();
    document.getElementById(questionIdArray[0]).show();

}

function getNextQuestion(){
    document.getElementById("question").innerText = questionArray[questionIndex];
    questionIndex++;
    $("#next-question").hide();

    var dotSelector = 'dot-'+questionIndex;
    $(dotSelector).addClass("complete");
}


if (window.location.search.length  > 0){
    handleRedirect();
    loadExperience();
} else{
    loadIntroduction();
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
    window.history.replaceState(null, null, window.location.pathname);
    
}

function loadSolutions() {
	// hide / show sections
	$("#experience").hide();
	$("#introduction").hide();
	$("#solutions").show();
    window.history.replaceState(null, null, window.location.pathname);

    
}
$(document).on("click", ".experience-btn", loadExperience);
$(document).on("click", ".introduction-btn", loadIntroduction);
$(document).on("click", ".solutions-btn", loadSolutions);



