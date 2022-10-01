const video = document.querySelector("video");
const playBtn = document.getElementById("playBtn");
const muteBtn = document.getElementById("muteBtn");
const volumeControl = document.getElementById("volumeControl");
const timelineControl = document.getElementById("timelineControl");

video.volume = volumeControl.value;

/**
 * funciton to play or pause the video when the playBtn is clicked
 */
const handlePlayBtn = () => {
  if (video.paused) {
    // when the btn is clicked and the video is NOT being played
    video.play();
    handleVideoPlayed();
  } else {
    // when the btn is clicked and the video is being played
    video.pause();
    handleVideoPaused();
  }
};
/**
 * function to change contents of playBtn when the video is being played
 */
const handleVideoPlayed = () => {
  //when the video gets played
  playBtn.innerText = "Pause";
};
/**
 * function to change contents of playBtn when the video is being paused
 */
const handleVideoPaused = () => {
  //when the video gets paused
  playBtn.innerText = "Play";
};

/**
 * function to muted or unmute the video when the muteBtn is clicked
 */
const handleMuteBtn = () => {
  if (video.muted) {
    // when the muteBtn is clicked while the video is already muted
    video.muted = false;
    handleVideoUnmuted();
    volumeControl.value = video.volume;
  } else {
    // when the muteBtn is clicked while the video is NOT muted
    video.muted = true;
    handleVideoMuted();
    volumeControl.value = 0;
  }
};
/**
 * function to receive the input value of volumeControl and adjust video.volume and muteBtn.innerText
 * @param {Object} event
 */
const handleVolumeControl = (event) => {
  const value = Number(event.target.value);
  video.volume = value;
  value > 0 ? handleVideoUnmuted() : handleVideoMuted();
};

const handleVideoMuted = () => {
  muteBtn.innerText = "Unmute";
};
const handleVideoUnmuted = () => {
  muteBtn.innerText = "Mute";
};

// play or pause the video
playBtn.addEventListener("click", handlePlayBtn);
video.addEventListener("play", handleVideoPlayed);
video.addEventListener("pause", handleVideoPaused);
// mute or unmute the video
muteBtn.addEventListener("click", handleMuteBtn);
//adjust video.volume by using volumeControl
volumeControl.addEventListener("input", handleVolumeControl);
