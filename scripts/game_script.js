var canvas = document.getElementById("gamecanvas");
var ctx = canvas.getContext("2d", {alpha: false});
canvas.width = canvas.getBoundingClientRect().width;
canvas.height = canvas.getBoundingClientRect().height;
ctx.textAlign = "center";


//geneate word function
var generate_word = ()=>{
    localStorage.word = null;
    localStorage.letterBank = "";
    localStorage.numGuesses = 0;
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }
    fetch("https://bjpskapus9.execute-api.us-east-1.amazonaws.com/dev/app/generator", requestOptions)
    .then(response => response.text())
    .then(result => {
        // store word to use for game and to send to /app/score/update after game

        // console.log(result);
        // console.log(JSON.parse(result).body.word);
        if(JSON.parse(result).body.word.length <= 7){
            localStorage.letterBank = "";
            localStorage.numGuesses = 0;
            localStorage.word = JSON.parse(result).body.word;
        }else{
            generate_word()
        }
    }).catch(error => console.log('error', error));
}

//update score function
var update_score = (username, score, word) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"username":username, "score":score, "word":word});
    var requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://bjpskapus9.execute-api.us-east-1.amazonaws.com/dev/app/score/update/", requestOptions)
    .then(response => response.text())
    .then(result => {
        console.log(result);
        console.log(JSON.parse(result).body.success);
    }).catch(error => console.log('error', error));
}

function guess_letter(){
    text_input = document.getElementById("guess_text").value;
    text_input = text_input.toLowerCase();
    text_input = text_input.match(/[A-Z]+|[a-z]+/gm)

    if(!(localStorage.letterBank.includes(text_input)) && text_input !== null){
        localStorage.letterBank = localStorage.letterBank + text_input;
    }
    localStorage.numGuesses = parseInt(localStorage.numGuesses) + 1;
    document.getElementById("guess_text").value = "";
}

function reset_board(){
    generate_word();
}

function draw_board(){
    ctx.fillStyle = "black";
    rendered_word = "";
    if(localStorage.word !== null){
        for(letter in localStorage.word){
            if (localStorage.letterBank.includes(localStorage.word[letter])){
                rendered_word = rendered_word + " " + localStorage.word[letter];
            } else{
                rendered_word = rendered_word + " _ ";
            }
        }
    }

    ctx.font = '3rem Arial';
    ctx.fillText(`guesses: ${localStorage.numGuesses}`, canvas.width/2, 0+canvas.height/3.25);
    ctx.font = '6rem Arial';
    ctx.fillText(rendered_word, canvas.width/2, 0+canvas.height/1.25);
}

function display(){
    //draw background
    ctx.fillStyle = "#796D8B";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw_board();



}

function findUnique(str){
    return [...str].reduce((acc, curr)=>{
      return acc.includes(curr) ?  acc  :  acc + curr;
    }, "")
  }

function game_loop(){

    if (localStorage.word === null){
        generate_word()
    }
    if(localStorage.word !== null){
        unique_letters = findUnique(localStorage.word);
        numletters = unique_letters.length;

        for(letter in unique_letters){
            if(localStorage.letterBank.includes(unique_letters[letter])){
                numletters -= 1;
            }
        }
        if(numletters == 0){
            update_score(localStorage.getItem("username"), (numGuesses/unique_letters.length)*Math.pow(unique_letters.length, 1.3), localStorage.word);
            window.location.replace("../leaderboard.html")
            //add API call for game finish 
            //AND reset following variables:
            // localStorage.word = null;
            // localStorage.letterBank = "";
            // localStorage.numGuesses = 0;
        }
        display();
    }

    setTimeout(game_loop, 1000/30);
}

game_loop()