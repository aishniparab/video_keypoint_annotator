// all functions that deal with key points

var load_csv = function(event) {
    var file = this.files[0];
    var fileURL = createObjectURL(file);

    DataFrame.fromCSV(file).then(df => {
        var ret = DataFrame.sql.registerTable(df, 'tmp', true);
    });
    document.getElementById("vid-input-div").style.display = "inline";
};

function export_csv(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
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

function check_if_annot_exists(frame_num){
    var ret_df = annotations.where({frame_num: frame_num});
    if (ret_df.count() == 0){
        return false;
    }
    else{
        return ret_df;
    }
}

function clear_all_points(){
    var ctx = document.getElementById("mycanvas").getContext("2d");
    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
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
    if (result_array[0][7] >= 0.5) {
        disp_model_eye_state.innerHTML = "open";
        document.getElementById("model-eye-state-box").style.borderColor = "#2FA5FF";
    } else {
        disp_model_eye_state.innerHTML = "closed";
        document.getElementById("model-eye-state-box").style.borderColor = "#C0FF96";
    }
}

function display_annotations(cf){
    var exists_ret = check_if_annot_exists(current_frame());
    if (!exists_ret) {
        // push init annotation if it doesn't already exist
        var init_annot = [current_frame(), null, null, null, null, null, null, null, null];
        annotations = annotations.push(init_annot);

        // update display
        disp_frame_num.innerHTML = current_frame();
        disp_ro.innerHTML = "null, null";
        disp_rp.innerHTML = "null, null";
        disp_ri.innerHTML = "null, null";
        disp_eye_state.innerHTML = "null";
        eye_state.innerHTML = "null";
        disp_flag.innerHTML = "null";
        document.getElementById("annot-eye-state-box").style.borderColor = "black";
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
        var annot_flag = row.get('flag');
        draw_point(annot_outer_x,annot_outer_y, "#2FA5FF");
        draw_point(annot_pupil_x, annot_pupil_y, "#C0FF96");
        draw_point(annot_inner_x, annot_inner_y, "#FF3521");

        // update display table
        disp_frame_num.innerHTML = current_frame();
        disp_ro.innerHTML = `${annot_outer_x}, ${annot_outer_y}`;
        disp_rp.innerHTML = `${annot_pupil_x}, ${annot_pupil_y}`;
        disp_ri.innerHTML = `${annot_inner_x}, ${annot_inner_y}`;
        if (annot_eye_state === 1) {
            disp_eye_state.innerHTML = "open";
            eye_state.innerHTML = "open";
            document.getElementById("annot-eye-state-box").style.borderColor = "#2FA5FF";
        }
        else if (annot_eye_state === 0) {
            disp_eye_state.innerHTML = "closed";
            eye_state.innerHTML = "closed";
            document.getElementById("annot-eye-state-box").style.borderColor = "#C0FF96";
        }
        else {
            disp_eye_state.innerHTML = "null";
            eye_state.innerHTML = "null";
            document.getElementById("annot-eye-state-box").style.borderColor = "black";
        }
        disp_flag.innerHTML = `${annot_flag}`;
    }
}