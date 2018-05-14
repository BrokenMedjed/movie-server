function set_progress() {
	var video     = document.getElementById("video");
	var video_end = video.buffered.end(0);
	var progress  = parseInt((video_end / video.duration) * 100);
	document.getElementById("progress").innerHTML = ">playing " + String(progress) + "%_";
}

function set_ready_status() {
	document.getElementById("progress").innerHTML = ">ready_";
}

function add_events() {
	var video = document.getElementById("video");
	video.addEventListener("progress",       set_progress,     false);
	video.addEventListener("canplaythrough", set_ready_status, false);
}
