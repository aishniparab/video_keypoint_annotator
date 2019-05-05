// all functions that deal with keypoints
var load_csv = function(event) {
    var file = this.files[0];
    var fileURL = createObjectURL(file);
    DataFrame.fromCSV(file).then(df => {
        var ret = DataFrame.sql.registerTable(df, 'tmp', true);
    });
};

var coordinates = function(element) {
    element = $(element);
    var top = element.position().top;
    var left = element.position().left;
    $('#results').text('X: ' + left + ' ' + 'Y: ' + top);
}

var get_pos = function(element) {
    element = $(element);
    var top = element.position().top;
    var left = element.position().left;
    return [left, top];
}

function resize_canvas(element) {
    var w = element.offsetWidth;
    var h = element.offsetHeight;
    var cv = document.getElementById("mycanvas");
    cv.width = w;
    cv.height = h;
}

function getClickPosition(event){
    var rect = mycanvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    return [x, y];
}

function drawPoint(x,y){
    var ctx = document.getElementById("mycanvas").getContext("2d");

    ctx.fillStyle = "#ff2626"; // Red color

    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2, true);
    ctx.fill();
}

function clearPoint(x,y){

}