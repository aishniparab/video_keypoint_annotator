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