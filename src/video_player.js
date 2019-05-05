// all functions used by the video_player
var play_selected_file = function (event) {
    var file = this.files[0];
    var type = file.type;
    var canPlay = vid.canPlayType(type);
    if (canPlay === '') canPlay = 'no';
    console.assert(canPlay);

    var fileURL = createObjectURL(file);
    vid.src = fileURL;
};

function play_vid_server(path) {
    vid.src = path;
}

function update_current_state() {
    divFrameId.innerHTML = current_frame();
    var ct = vid.currentTime - smallDelta;
    divFrameTs.innerHTML = ct.toFixed(3);
}

function frame_count() {
    return Math.round(vid.duration * fps);
}

function jump(frameId) {
    if (frameId < 0) {
        frameId = frame_count() + frameId;
    }
    var ct = frameId / fps;
    console.assert(ct >= 0 && ct <= vid.duration);
    ct += smallDelta;
    if (vid.currentTime !== ct) {
        vid.currentTime = ct;
        update_current_state();
    }
}

function current_frame() {
    var cf = Math.round(vid.currentTime * fps);
    cf = Math.min(cf, frame_count() - 1);
    return cf;
}

var fade_timer = null;
function fadeCmd(cmdText) {
    if (fadeTimer) clearInterval(fadeTimer);
    var op = 1;
    divCmdStatus.style.display = 'inline';
    divCmdStatus.innerHTML = cmdText;
    fadeTimer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(fadeTimer);
            divCmdStatus.style.display = 'none';
        }
        divCmdStatus.style.opacity = op;
        divCmdStatus.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 50);
}

function take_step(mag) {
    if (!vid.paused) vid.pause();

    var cf = current_frame() + mag;
    cf = Math.max(0, cf);
    cf = Math.min(cf, frame_count() -1 );
    jump(cf);
}

function toggle_play() {
    if (vid.paused) {
        fade_cmd('Play');
        vid.playbackRate = playbackSpeed;
        vid.play();
    } else {
        fade_cmd('Pause');
        vid.pause();
        jump(current_frame());
    }
}
