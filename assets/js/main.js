
/* javascript */

const clientId = '619dc4ae72bb482c9627b588fc4cba36';
const clientSecret = '551dfacf8408410caf30a92880e99a1f';
var access_token;
var refresh_token;
var questionIndex = 0;
var questionArray = ["Spotify offers a flat rate payout per stream to artists.", "Which answer is NOT a current demand of Spotify from musicians?", "Which major record labels own sizable shares of Spotify stock?", "Spotify's total artist payout has increased each year."];
var answerArray = ["", `Spotify pays less than a cent per stream. The average payout is $0.004 per stream and depends on the distribution contract each artist has, the country of the listener, and whether the listener is a Free or Premium subscriber. This small number often needs to be divided further by record labels and managers attached to artists.
`,`Artists are demanding all of the above EXCEPT the sale of digital albums. Artists are not opposed to streaming as a means of music consumption, but demand that rates are about 3x as high as they are now. For artists, it is still a great idea to release digital albums on sites such as Bandcamp to give fans the opportunity to support more directly.`,
`Sony and UMG still own stock in Spotify. These record labels are set up to succeed either way. If Spotify continues to take a huge cut of subscription and ad revenue, this increases the value of their stock. If Spotify starts to take less money, the record labels get more money from their artist agreements. Either way, their vested interests give them the upper hand over the artists and lets Spotify's treatment of artists run unchecked. `,
`While this is true, it is not as good as it seems. From 2017 to 2021, artists receiving 1 million dollars rose from 720 to 1040 (44% increase). During this same time, the number of premium subscription users rose from 124 million to 188 million (51% increase). While Spotify boasts about being the first to pay billions of dollars out to rights holders, this can only be expected as their users increase as well. Not to mention that these billions are reaching rights holders, which means music artists are only getting a fraction of this big number.`
]

const getAuthorization = (function () {
    var url = 'https://accounts.spotify.com/authorize?'
    url += 'client_id=' + clientId;
    url += '&response_type=code';
    url += '&redirect_uri=https://etgeorge.github.io/dig245-final/';

    window.location.href = url;

});

function getCode() {
    let code = null;
    const searchQuery = window.location.search;

    if (searchQuery.length > 0) {
        const urlParams = new URLSearchParams(searchQuery);
        code = urlParams.get('code');
    } else {
        getAuthorization();
        authorized = true;
    }

    return code;
}




function handleRedirect() {
    let code = getCode();
    getToken(code);
}


function getToken(code) {
    let body = 'grant_type=authorization_code';
    body += '&code=' + code;
    body += '&redirect_uri=' + encodeURI('https://etgeorge.github.io/dig245-final/');
    body += '&client_id' + clientId;
    body += '&client_secret' + clientSecret;
    fetchAuthorizationApi(body);
}

function fetchAuthorizationApi(body) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "https://accounts.spotify.com/api/token?", true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(clientId + ":" + clientSecret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse() {
    var data = JSON.parse(this.responseText);

    access_token = data.access_token;
    console.log(access_token);
    fetchPlaylistApi();

}

function fetchPlaylistApi(body) {
    console.log("Trying to get playlist")
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.spotify.com/v1/me/playlists?", true)
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = handlePlaylistResponse;
}

function handlePlaylistResponse() {
    var data = JSON.parse(this.responseText);
    var firstPlaylist = data.items[2].name;
    var firstPlaylistLength = data.items[2].tracks.total;
    console.log(data);
    console.log(firstPlaylist);
    window.history.replaceState(null, null, window.location.pathname);
    scrollBy(0, 450);
    //call the next question
    displayPlaylistAnswer(firstPlaylist, firstPlaylistLength);
}

function displayPlaylistAnswer(playlist, length) {
    $('#playlist').text("One of your recent playlists is " + playlist +" which is "+length+
    " tracks long. This playlist would cost you $"+length*0.99+" to create by purchasing each track individuallly. Compare this to the $10 a month it costs to create an unlimited number of these playlists.");
    $('#next-question').show();
    $('#authorize').hide();
}

function displayAnswer() {
    console.log("This worked")
    let result = document.querySelector('input[name="flexRadioDefault"]:checked').value;
    document.getElementById("answer").innerText = "You selected answer #" + result;
    let currentQuestion = '#' + questionIdArray[0];

    $(currentQuestion).hide();

    //display next question
    questionIdArray.shift();
    document.getElementById(questionIdArray[0]).show();

}

function getNextQuestion() {
    document.getElementById("question").innerText = questionArray[questionIndex];
    questionIndex++;
    $("#next-question").hide();
    getNextAnswer();
    $('#reveal-answer').show("fade");
    $("#skip").show("fade");
    var dotSelector = '#dot-' + questionIndex;
    console.log(dotSelector);
    $(dotSelector).addClass("completed");
}

function getNextAnswer(){
    let answerSelector="#answers-"+questionIndex;
    console.log(answerSelector);
    $(answerSelector).show("fade");
    $("#playlist").hide("fade");
}

function revealAnswer() {
    let result = document.querySelector('input[name="flexRadioDefault"]:checked').value;
    let answerSelector="#answers-"+questionIndex;
    $(answerSelector).hide("fade");
    


    console.log(answerArray[questionIndex])
    var answer;
    if (result=="true"){
        answer = "Correct! "
    } else{
        answer = "Close! "
    }
    answer+=answerArray[questionIndex];
    console.log(answer);
    document.getElementById("question").innerText = answer;
    $('#reveal-answer').hide();
    $("#next-question").show();
    $("#skip").hide();
}

function skipAuthorize() {
    console.log("skip called");
    $("#authorize").hide("fade");
    getNextQuestion();
    
    
}

if (window.location.search.length > 0) {
    handleRedirect();
    loadExperience();
} else {
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



