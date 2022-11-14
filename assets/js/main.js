
/* javascript */

const clientId = '619dc4ae72bb482c9627b588fc4cba36';
const clientSecret = '551dfacf8408410caf30a92880e99a1f';

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
    let body = code;
}
