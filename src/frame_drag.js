function start_drag() {
    var orig_frame_position = $('video').offset();
    console.log(`orig pos: ${orig_frame_position.left}, ${orig_frame_position.top}`);
    img_ele = this;
    x_img_ele = window.event.clientX - vid.offsetLeft;
    y_img_ele = window.event.clientY - vid.offsetTop;
}

function stop_drag(){
    img_ele = null;
}

function while_drag(){
    var x_cursor = window.event.clientX;
    var y_cursor = window.event.clientY;
    if (img_ele !== null){
        img_ele.style.left = (x_cursor - x_img_ele) + 'px';
        img_ele.style.top = ( window.event.clientY - y_img_ele) + 'px';
        console.log(img_ele.style.left+' - '+img_ele.style.top);
    }
}