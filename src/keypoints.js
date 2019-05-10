// all functions that deal with key points

var load_csv = function(event) {
    var file = this.files[0];
    var fileURL = createObjectURL(file);

    DataFrame.fromCSV(file).then(df => {
        var ret = DataFrame.sql.registerTable(df, 'tmp', true);
    });
    document.getElementById("vid-input-div").style.display = "inline";
};

function init_annot_array(){
    // initialize
    const frame_num_array = [...Array(frame_count()).keys()];
    const null_array = new Array(frame_count()).fill(null);
    annotations = new DataFrame({
        frame_num: frame_num_array,
        pupil_x: null_array,
        pupil_y: null_array,
        inner_x: null_array,
        inner_y: null_array,
        outer_x: null_array,
        outer_y: null_array,
        eye_state: null_array,
        is_bad: null_array,
        blink: null_array,
    },['frame_num', 'pupil_x', 'pupil_y', 'inner_x', 'inner_y', 'outer_x', 'outer_y', 'eye_state', 'is_bad', 'blink']);
}

function check_if_annot_exists(frame_num){
    var ret_df = annotations.where({frame_num: frame_num});
    if (ret_df.count() == 0){
        return false;
    }
    else{
        return ret_df;
    }
}

function toggleBlinkStatus(){
    if (blink_flag == 1){
        blink_flag = 0;
        blink_status_el.style.visibility = "hidden";
        disp_blink.innerHTML = "null";
        annotations = annotations.setRow(current_frame(), row => row.set("blink", "null"));
    }
    else{
        blink_flag = 1;
        blink_status_el.style.visibility = "visible";
        disp_blink.innerHTML = "1";
        annotations = annotations.setRow(current_frame(), row => row.set("blink", 1));
    }
}

function toggle_is_bad(){
    if (disp_flag_status == 1){
        disp_flag_status = 0;
        disp_flag.innerHTML = "null";
        annotations = annotations.setRow(current_frame(), row => row.set("is_bad", "null"));
    }
    else{
        disp_flag_status = 1;
        disp_flag.innerHTML = "1";
        annotations = annotations.setRow(current_frame(), row => row.set("is_bad", 1));
    }
}

function display_model_predictions(cf) {
    var result = DataFrame.sql.request(`SELECT frame_num, pupil_x, pupil_y, inner_x, inner_y, outer_x, outer_y, eye_state FROM tmp WHERE frame_num < ${cf + 1} AND frame_num >= ${cf} AND if_right_eye = True`);
    var result_array = result.toArray();

    var right_pupil_x = parseFloat(result_array[0][1]); ///parseFloat(aspect_ratio);
    var right_pupil_y = parseFloat(result_array[0][2]); ///parseFloat(aspect_ratio);
    var right_inner_x = parseFloat(result_array[0][3]); ///parseFloat(aspect_ratio);
    var right_inner_y = parseFloat(result_array[0][4]); ///parseFloat(aspect_ratio);
    var right_outer_x = parseFloat(result_array[0][5]); ///parseFloat(aspect_ratio);
    var right_outer_y = parseFloat(result_array[0][6]); ///parseFloat(aspect_ratio);

    // display model predictions
    right_pupil_kp.style.left = right_pupil_x - 2.5 + 'px';
    right_pupil_kp.style.top = right_pupil_y - 2.5 + 'px';
    right_inner_kp.style.left = right_inner_x - 2.5 + 'px';
    right_inner_kp.style.top = right_inner_y - 2.5 + 'px';
    right_outer_kp.style.left = right_outer_x - 2.5 + 'px';
    right_outer_kp.style.top = right_outer_y - 2.5 + 'px';

    var box_w = right_inner_x - 2.5 - right_outer_x - 2.5;

    focus_box_el.style.top = right_pupil_y - box_w*1.5 + 'px';
    focus_box_el.style.left = right_pupil_x - box_w*1.5 + 'px';
    focus_box_el.style.width = box_w*3.5 + 'px';
    focus_box_el.style.height = box_w*2.5 + 'px';

    machine_status_el.style.top = right_pupil_y - box_w*1.5 - 40 + 'px';
    machine_status_el.style.left = right_pupil_x - box_w*1.5 + 'px';

    machine_eye_state_el.style.top = right_pupil_y - box_w*1.5 - 40 + 'px';
    machine_eye_state_el.style.left = right_pupil_x - box_w*1.5 + 90+ 'px';

    annotator_status_el.style.top = right_pupil_y - box_w*1.5 - 20 + 'px';
    annotator_status_el.style.left = right_pupil_x - box_w*1.5 + 'px';

    annotator_eye_state_el.style.top = right_pupil_y - box_w*1.5 - 20 + 'px';
    annotator_eye_state_el.style.left = right_pupil_x - box_w*1.5 + 110+ 'px';

    blink_status_el.style.top = right_pupil_y - box_w*1.5 - 20 + 'px';
    blink_status_el.style.left = right_pupil_x + box_w + 15+ 'px';

    if (result_array[0][7] >= 0.5) {
        machine_eye_state_el.innerHTML = "open";
        document.getElementById("machine_eye_state").style.color = "#2FA5FF";

    } else {
        machine_eye_state_el.innerHTML = "closed";
        document.getElementById("machine_eye_state").style.color = "#C0FF96";
    }
}
function resize_canvas(element) {
    var w = element.offsetWidth;
    var h = element.offsetHeight;
    var cv = document.getElementById("mycanvas");
    cv.width = w;
    cv.height = h;
}

function get_click_position(event){
    var rect = mycanvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    return [x, y];
}

function draw_point(x,y, color){
    var ctx = document.getElementById("mycanvas").getContext("2d");
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2, true);
    ctx.fill();
}

function clear_point(x, y){
    var ctx = document.getElementById("mycanvas").getContext("2d");
    ctx.beginPath();
    ctx.clearRect(x-3-1, y - 3-1, 3*2+2, 3 * 2 + 2);
    ctx.closePath();
}

function clear_all_points(){
    var ctx = document.getElementById("mycanvas").getContext("2d");
    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
}

function display_annotations(cf){
    var exists_ret = check_if_annot_exists(current_frame());
    if (!exists_ret) {
        // push init annotation if it doesn't already exist
        var init_annot = [current_frame(), null, null, null, null, null, null, null, null, null];
        annotations = annotations.push(init_annot);

        // update display
        disp_frame_num.innerHTML = current_frame();
        disp_ro.innerHTML = "null, null";
        disp_rp.innerHTML = "null, null";
        disp_ri.innerHTML = "null, null";
        eye_state.innerHTML = "null";
        annotator_eye_state_el.innerHTML = "null";
        machine_eye_state_el.innerHTML = "null";
        disp_flag.innerHTML = "null";
        blink_status_el.style.visibility = "hidden";
    }
    else {
        // redraw points
        var row = exists_ret.find({'frame_num': current_frame()});
        var annot_outer_x = row.get('outer_x');
        var annot_outer_y = row.get('outer_y');
        var annot_pupil_x = row.get('pupil_x');
        var annot_pupil_y = row.get('pupil_y');
        var annot_inner_x = row.get('inner_x');
        var annot_inner_y = row.get('inner_y');
        var annot_eye_state = row.get('eye_state');
        var annot_flag = row.get('is_bad');
        var blink_status = row.get('blink');
        draw_point(annot_outer_x,annot_outer_y, "#2FA5FF");
        draw_point(annot_pupil_x, annot_pupil_y, "#FF3521");
        draw_point(annot_inner_x, annot_inner_y, "#C0FF96");

        // update display table
        disp_frame_num.innerHTML = current_frame();
        disp_ro.innerHTML = `${annot_outer_x}, ${annot_outer_y}`;
        disp_rp.innerHTML = `${annot_pupil_x}, ${annot_pupil_y}`;
        disp_ri.innerHTML = `${annot_inner_x}, ${annot_inner_y}`;
        if (annot_eye_state === 1) {
            eye_state.innerHTML = "open";
            annotator_eye_state_el.innerHTML = "open";
            document.getElementById("annotator_eye_state").style.color = "#2FA5FF";
        }
        else if (annot_eye_state === 0) {
            eye_state.innerHTML = "closed";
            annotator_eye_state_el.innerHTML = "closed";
            document.getElementById("annotator_eye_state").style.color = "#C0FF96";
        }
        else {
            eye_state.innerHTML = "null";
            annotator_eye_state_el.innerHTML = "null";
            document.getElementById("annotator_eye_state").style.color = "black";
        }
        if (annot_flag == 1){
            disp_flag_status = 1;
            disp_flag.innerHTML = `${annot_flag}`;
        }
        else{
            disp_flag_status = 0;
            disp_flag.innerHTML = `${annot_flag}`;
        }
        if (blink_status == 1){
            blink_flag = 1;
            blink_status_el.style.visibility = "visible";
            disp_blink.innerHTML = `${blink_status}`;
        }
        else{
            blink_flag = 0;
            blink_status_el.style.visibility = "hidden";
            disp_blink.innerHTML = `${blink_status}`;
        }
    }
}

function clear_annotations(){
    annotations = annotations.setRow(current_frame(), row => row.set("pupil_x", null));
    annotations = annotations.setRow(current_frame(), row => row.set("pupil_y", null));
    annotations = annotations.setRow(current_frame(), row => row.set("inner_x", null));
    annotations = annotations.setRow(current_frame(), row => row.set("inner_y", null));
    annotations = annotations.setRow(current_frame(), row => row.set("outer_x", null));
    annotations = annotations.setRow(current_frame(), row => row.set("outer_y", null));
    annotations = annotations.setRow(current_frame(), row => row.set("eye_state", null));
    annotations = annotations.setRow(current_frame(), row => row.set("is_bad", null));
    annotations = annotations.setRow(current_frame(), row => row.set("blink", null));
}

function clear_display(){
    disp_frame_num.innerHTML = current_frame();
    disp_ro.innerHTML = "null, null";
    disp_rp.innerHTML = "null, null";
    disp_ri.innerHTML = "null, null";
    annotator_eye_state_el.innerHTML = "null";
    eye_state.innerHTML = "null";
    disp_flag.innerHTML = "null";
    disp_blink.innerHTML = "null";
    blink_status_el.style.visibility = "hidden";
}

function move_kp(current_pos, direction, kp, pos){
    var current_x = pos[0];
    var current_y = pos[1];
    if (direction == "up"){
        //sub delta to kp_y
        var new_x = current_x;
        var new_y = current_y - 1;
    }
    if (direction == "down"){
        //add delta to kp_y
        var new_x = current_x;
        var new_y = current_y + 1;
    }
    if (direction=="left"){
        //sub delta to kp_x
        var new_x = current_x - 1;
        var new_y = current_y;
    }
    if (direction == "right"){
        //add delta to kp_x
        var new_x = current_x + 1;
        var new_y = current_y;
    }
    current_click_pos = [new_x, new_y]
    clear_point(current_x, current_y);
    draw_point(new_x, new_y);

    if (kp == 'outer'){
        var kp_prev_outer_pos = pos;
        disp_ro.innerHTML = `${new_x}, ${new_y}`;
    }
    if (kp == 'pupil'){
        var kp_prev_pupil_pos = pos;
        disp_rp.innerHTML = `${new_x}, ${new_y}`;
    }
    if (kp == 'inner'){
        var kp_prev_inner_pos = pos;
        disp_ri.innerHTML = `${new_x}, ${new_y}`;
    }
    annotations = annotations.setRow(current_frame(), row => row.set(kp+'_x', new_x));
    annotations = annotations.setRow(current_frame(), row => row.set(kp+'_y', new_y));
}

function draw_kp(click_pos, kp){
    console.log("in here");
    current_click_pos = click_pos;
    if (kp == 'outer'){
        if (click_count == 0){
            click_count = 1;
            if (kp_outer_selection_count == 1) {
                clear_point(kp_prev_outer_pos[0], kp_prev_outer_pos[1]);
                kp_outer_selection_count = 0
            }
            kp_selection = "outer";
            kp_outer_selection_count = 1;
            kp_prev_outer_pos = [click_pos[0], click_pos[1]];
            disp_ro.innerHTML = `${click_pos[0]}, ${click_pos[1]}`; // update table display
            draw_point(click_pos[0], click_pos[1], "#2FA5FF");
        }
    }
    if (kp == 'pupil'){
        if (click_count == 0){
            click_count = 1;
            if (kp_pupil_selection_count == 1){
                clear_point(kp_prev_pupil_pos[0], kp_prev_pupil_pos[1]);
                kp_pupil_selection_count = 0;
            }
            kp_selection = kp;
            kp_pupil_selection_count = 1;
            kp_prev_pupil_pos = [click_pos[0], click_pos[1]];
            disp_rp.innerHTML = `${click_pos[0]}, ${click_pos[1]}`; // update table display
            draw_point(click_pos[0], click_pos[1], "#FF3521");
        }
    }
    if (kp == 'inner'){
        if (click_count == 0){
            click_count = 1;
            if (kp_inner_selection_count == 1){
                clear_point(kp_prev_inner_pos[0], kp_prev_inner_pos[1]);
                kp_inner_selection_count = 0;
            }
            kp_selection = kp;
            kp_inner_selection_count = 1;
            kp_prev_inner_pos = [click_pos[0], click_pos[1]];
            disp_ri.innerHTML = `${click_pos[0]}, ${click_pos[1]}`; // update table display
            draw_point(click_pos[0], click_pos[1], "#C0FF96");
        }
    }
    annotations = annotations.setRow(current_frame(), row => row.set(kp+"_x", click_pos[0]));
    annotations = annotations.setRow(current_frame(), row => row.set(kp+"_y", click_pos[1]));
}

function export_csv(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}