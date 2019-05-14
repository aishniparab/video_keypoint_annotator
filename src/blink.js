// all functions that deal with key points

function init_annot_array(){
    // initialize
    const frame_num_array = [...Array(frame_count()).keys()];
    const null_array = new Array(frame_count()).fill(null);
    annotations = new DataFrame({
        frame_num: frame_num_array,
        is_bad: null_array,
        blink_start: null_array,
        blink_end: null_array,
        down_start: null_array,
        down_end: null_array,
    },['frame_num','is_bad', 'blink_start', 'blink_end', 'down_start', 'down_end']);
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

function toggleLookingStartDownStatus() {
    if (looking_down_start_flag == 1){
        looking_down_start_flag = 0;
        looking_down_start_status_el.style.visibility = "hidden";
        disp_looking_down_start.innerHTML = "null";
        annotations = annotations.setRow(current_frame(), row => row.set("down_start", "null"));
    }
    else{
        looking_down_start_flag = 1;
        looking_down_start_status_el.style.visibility = "visible";
        disp_looking_down_start.innerHTML = "1";
        annotations = annotations.setRow(current_frame(), row => row.set("down_start", 1));
    }
}

function toggleLookingEndDownStatus() {
    if (looking_down_end_flag == 1){
        looking_down_end_flag = 0;
        disp_looking_down_end.innerHTML = "null";
        looking_down_end_status_el.style.visibility = "hidden";
        annotations = annotations.setRow(current_frame(), row => row.set("down_end", "null"));
    }
    else{
        looking_down_end_flag = 1;
        disp_looking_down_end.innerHTML = "1";
        looking_down_end_status_el.style.visibility = "visible";
        annotations = annotations.setRow(current_frame(), row => row.set("down_end", 1));
    }
}

function toggleBlinkStartStatus(){
    if (blink_start_flag == 1){
        blink_start_flag = 0;
        blink_start_status_el.style.visibility = "hidden";
        disp_blink_start.innerHTML = "null";
        annotations = annotations.setRow(current_frame(), row => row.set("blink_start", "null"));
    }
    else{
        blink_start_flag = 1;
        blink_start_status_el.style.visibility = "visible";
        disp_blink_start.innerHTML = "1";
        annotations = annotations.setRow(current_frame(), row => row.set("blink_start", 1));
    }
}

function toggleBlinkEndStatus(){
    if (blink_end_flag == 1){
        blink_end_flag = 0;
        blink_end_status_el.style.visibility = "hidden";
        disp_blink_end.innerHTML = "null";
        annotations = annotations.setRow(current_frame(), row => row.set("blink_end", "null"));
    }
    else{
        blink_end_flag = 1;
        blink_end_status_el.style.visibility = "visible";
        disp_blink_end.innerHTML = "1";
        annotations = annotations.setRow(current_frame(), row => row.set("blink_end", 1));
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
    blink_start_status_el.style.top = '20px';
    blink_start_status_el.style.left = '0px';
    blink_end_status_el.style.top = '20px';
    blink_end_status_el.style.left = '0px';

    looking_down_start_status_el.style.top = '10px';
    looking_down_start_status_el.style.left = '0px';
    looking_down_end_status_el.style.top = '10px';
    looking_down_end_status_el.style.left = '0px';

    box_frame_num_el.innerHTML = current_frame();
    box_frame_num_el.style.top = '0px';
    box_frame_num_el.style.left = '0px';
}

function display_annotations(cf){
    var exists_ret = check_if_annot_exists(current_frame());

    if (!exists_ret) {
        // push init annotation if it doesn't already exist
        var init_annot = [current_frame(), null, null, null, null, null];
        annotations = annotations.push(init_annot);

        // update display
        disp_frame_num.innerHTML = current_frame();
        disp_flag.innerHTML = "null";
        blink_start_status_el.style.visibility = "hidden";
        blink_end_status_el.style.visibility = "hidden";
        looking_down_start_status_el.style.visibility = "hidden";
        looking_down_end_status_el.style.visibility = "hidden";
    }
    else {
        var row = exists_ret.find({'frame_num': current_frame()});
        var annot_flag = row.get('is_bad');
        var blink_start_status = row.get('blink_start');
        var blink_end_status = row.get('blink_end');
        var looking_down_start_status = row.get('down_start');
        var looking_down_end_status = row.get('down_end');

        // update display table
        disp_frame_num.innerHTML = current_frame();

        if (annot_flag == 1) {
            disp_flag_status = 1;
            disp_flag.innerHTML = `${annot_flag}`;
        } else {
            disp_flag_status = 0;
            disp_flag.innerHTML = `${annot_flag}`;
        }
        if (blink_start_status == 1) {
            blink_start_flag = 1;
            blink_start_status_el.style.visibility = "visible";
            disp_blink_start.innerHTML = `${blink_start_status}`;
        } else {
            blink_start_flag = 0;
            blink_start_status_el.style.visibility = "hidden";
            disp_blink_start.innerHTML = `${blink_start_status}`;
        }
        if (blink_end_status == 1) {
            blink_end_flag = 1;
            blink_end_status_el.style.visibility = "visible";
            disp_blink_end.innerHTML = `${blink_end_status}`;
        } else {
            blink_end_flag = 0;
            blink_end_status_el.style.visibility = "hidden";
            disp_blink_end.innerHTML = `${blink_end_status}`;
        }
        if (looking_down_start_status == 1) {
            looking_down_start_flag = 1;
            looking_down_start_status_el.style.visibility = "visible";
            disp_looking_down_start.innerHTML = `${looking_down_start_status}`;
        } else {
            looking_down_start_flag = 0;
            looking_down_start_status_el.style.visibility = "hidden";
            disp_looking_down_start.innerHTML = `${looking_down_start_status}`;
        }
        if (looking_down_end_status == 1) {
            looking_down_end_flag = 1;
            looking_down_end_status_el.style.visibility = "visible";
            disp_looking_down_end.innerHTML = `${looking_down_end_status}`;
        } else {
            looking_down_end_flag = 0;
            looking_down_end_status_el.style.visibility = "hidden";
            disp_looking_down_end.innerHTML = `${looking_down_end_status}`;
        }
    }
}

function clear_annotations(){
    annotations = annotations.setRow(current_frame(), row => row.set("is_bad", null));
    annotations = annotations.setRow(current_frame(), row => row.set("blink_start", null));
    annotations = annotations.setRow(current_frame(), row => row.set("blink_end", null));
    annotations = annotations.setRow(current_frame(), row => row.set("down_start", null));
    annotations = annotations.setRow(current_frame(), row => row.set("down_end", null));
}

function clear_display(){
    disp_frame_num.innerHTML = current_frame();
    disp_flag.innerHTML = "null";
    disp_blink_start.innerHTML = "null";
    disp_blink_end.innerHTML = "null";
    disp_looking_down_start.innerHTML = "null";
    disp_looking_down_end.innerHTML = "null";
    blink_start_status_el.style.visibility = "hidden";
    blink_end_status_el.style.visibility = "hidden";
    looking_down_start_status_el.style.visibility = "hidden";
    looking_down_end_status_el.style.visibility = "hidden";
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