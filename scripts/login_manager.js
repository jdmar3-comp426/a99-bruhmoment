var login = (username, password) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({"username":username, "password":password});
    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    //stores username in local storage for use in score
    localStorage.setItem("username", username);
    fetch("https://bjpskapus9.execute-api.us-east-1.amazonaws.com/dev/app/user/login", requestOptions)
    .then(response => response.text())
    .then(result => {
        // indicate whether the user was successfully logged in
        // store username as global variable
        console.log(result);
        console.log(JSON.parse(result).body.success);
    }).catch(error => console.log('error', error));
}

var create_score = (username)=>{
    // instantiate a headers object
    var myHeaders = new Headers();
    // add content type header to object
    myHeaders.append("Content-Type", "application/json");
    // using built in JSON utility package turn object to string and store in a variable
    var raw = JSON.stringify({"username":username});
    // create a JSON object with parameters for API call and store in a variable
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    // make API call with parameters and use promises to get response
    fetch("https://bjpskapus9.execute-api.us-east-1.amazonaws.com/dev/app/score/new", requestOptions)
    .then(response => response.text())
    .then(result => {
        // indicate success or failure to front-end
        console.log(result);
        console.log(JSON.parse(result).body.success);
    }).catch(error => console.log('error', error));
}