// all functions used by the video_player
var playSelectedFile = function (event) {
    var file = this.files[0];
    var type = file.type;
    var canPlay = vid.canPlayType(type);
    if (canPlay === '') canPlay = 'no';
    console.assert(canPlay);

    var fileURL = createObjectURL(file);
    vid.src = fileURL;
};

function playVidServer(path) {
    vid.src = path;
}

function updateCurrentState() {
    divFrameId.innerHTML = currentFrame();
    var ct = vid.currentTime - smallDelta;
    divFrameTs.innerHTML = ct.toFixed(3);
}

function frameCount() {
    return Math.round(vid.duration * fps);
}

function jump(frameId) {
    if (frameId < 0) {
        frameId = frameCount() + frameId;
    }
    var ct = frameId / fps;
    console.assert(ct >= 0 && ct <= vid.duration);
    ct += smallDelta;
    if (vid.currentTime !== ct) {
        vid.currentTime = ct;
        updateCurrentState();
    }
    //updateCurrentAnn();
}

function currentFrame() {
    var cf = Math.round(vid.currentTime * fps);
    cf = Math.min(cf, frameCount() - 1);
    return cf;
}

var fadeTimer = null;
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

function takeStep(mag) {
    if (!vid.paused) vid.pause();

    var cf = currentFrame() + mag;
    cf = Math.max(0, cf);
    cf = Math.min(cf, frameCount() -1 );
    jump(cf);
}

function togglePlay() {
    if (vid.paused) {
        fadeCmd('Play');
        vid.playbackRate = playbackSpeed;
        vid.play();
    } else {
        fadeCmd('Pause');
        vid.pause();
        jump(currentFrame());
    }
}

function displayAnnotations() {
    // do nothing yet
}

