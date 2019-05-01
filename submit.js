// start util functions //
function post(url, data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function() {
        if(this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            console.log(xhr.response);
            //callback();
        }
    }
    xhr.send(data);
}

function submit(output) {
    console.log(output);
    post("./index.php", output);
}
// end util functions //