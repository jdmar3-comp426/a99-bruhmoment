var get_leaderboard = ()=>{
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }
    fetch("https://bjpskapus9.execute-api.us-east-1.amazonaws.com/dev/app/score/leaderboard", requestOptions)
    .then(response => response.text())
    .then(result => {
        console.log(result);
        console.log(JSON.parse(result).body);
        var leaderboard = JSON.parse(result).body;
        var temp = "";
        for(var i = 0; i < leaderboard.length; i++){
            temp += "<tr><td>" + leaderboard[i].username + "</td><td>" + leaderboard[i].top_score + "</td>" + "<td>" + leaderboard[i].total_words_solved + "</td>" + "<td>" + leaderboard[i].longest_word_solved + "</td></tr>";
        }
        document.getElementById("data").innerHTML = temp;
    }).catch(error => console.log('error', error));
}

function reset_game(){
    localStorage.word = null;
    localStorage.numGuesses = 0;
    localStorage.setItem("letterbank", "");
    window.location.href = "../gamepage.html";
}