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
        localStorage.word = JSON.parse(result).body.word;
    }).catch(error => console.log('error', error));
}

function draw_board(){
    ctx.fillStyle = "black";
    rendered_word = "";
    for(letter in localStorage.word){
        if (localStorage.letterBank.includes(localStorage.word[letter])){
            rendered_word = rendered_word + " " + localStorage.word[letter];
        } else{
            rendered_word = rendered_word + " _ ";
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

var keys_pressed = {};

function game_loop(){
    if (localStorage.word == null){
        generate_word()
    }
    display()

    setTimeout(game_loop, 1000/30);
}

game_loop()