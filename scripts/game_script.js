var canvas = document.getElementById("gamecanvas");
var ctx = canvas.getContext("2d", {alpha: false});
canvas.width = canvas.getBoundingClientRect().width;
canvas.height = canvas.getBoundingClientRect().height;
ctx.textAlign = "center";


//geneate word function
async function generate_word(){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    }
    await fetch("https://bjpskapus9.execute-api.us-east-1.amazonaws.com/dev/app/generator", requestOptions)
    .then(response => response.text())
    .then(result => find_new_word(result)).catch(error => console.log('error', error));
}

async function find_new_word(result){
    if(JSON.parse(result).body.word.length <= 9){
        localStorage.setItem("letterBank", "");
        localStorage.numGuesses = 0;
        localStorage.setItem("word", JSON.parse(result).body.word);
        return true;
    }else{
        await generate_word()
    }
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

    if(!(localStorage.getItem("letterBank").includes(text_input)) && text_input !== null){
        localStorage.setItem("letterBank", localStorage.getItem("letterBank") + text_input);
    }
    localStorage.numGuesses = parseInt(localStorage.numGuesses) + 1
    document.getElementById("guess_text").value = "";
}

async function reset_board(){
    await generate_word();
}

function draw_board(){
    if(localStorage.getItem("word") !== null){
        ctx.fillStyle = "black";
        rendered_word = "";
        for(letter in localStorage.getItem("word")){
            if (localStorage.letterBank.includes(localStorage.getItem("word")[letter])){
                rendered_word = rendered_word + " " + localStorage.getItem("word")[letter];
            } else{
                rendered_word = rendered_word + " _ ";
            }
        }
        ctx.font = '3rem Arial';
        ctx.fillText(`guesses: ${localStorage.numGuesses}`, canvas.width/2, 0+canvas.height/3.25);
        ctx.font = '6rem Arial';
        ctx.fillText(rendered_word, canvas.width/2, 0+canvas.height/1.25);
    }
}

function display(){
    //draw background
    ctx.fillStyle = "#796D8B";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //draw board
    draw_board();
}

function findUnique(str){
    return [...str].reduce((acc, curr)=>{
      return acc.includes(curr) ?  acc  :  acc + curr;
    }, "")
  }

async function game_loop(){
    if (localStorage.getItem("word") === null){
        await generate_word()
    }

    if(localStorage.getItem("word") !== null){
        unique_letters = findUnique(localStorage.getItem("word"));
        numletters = unique_letters.length;

        for(letter in unique_letters){
            if(localStorage.letterBank.includes(unique_letters[letter])){
                numletters -= 1;
            }
        }
        if(numletters == 0){
            update_score(localStorage.getItem("username"), (unique_letters.length/localStorage.numguesses)*Math.pow(unique_letters.length, 1.3), localStorage.getItem("word"));
            window.location.replace("../leaderboard.html")
            //AND reset following variables:
            // localStorage.word = null;
            // localStorage.letterBank = "";
            // localStorage.numGuesses = 0;
        }
    }
    display();

    setTimeout(game_loop, 1000/30);
}

if(localStorage.getItem("username") === null){
    window.location.href = "../index.html";
}else{
    game_loop()
}
