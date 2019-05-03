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