let thumbnail = document.getElementById('music_thumbnail');
let song = document.getElementById('music_song');

let songArtist = document.getElementById('music_artist');
let songTitle = document.getElementById('music_song_title');
let pPause = document.getElementById('music_song_play_pause');
let nextBtn = document.getElementById('music_song_next');
let previousBtn = document.getElementById('music_song_previous');
let seekBar = document.getElementById('music_song_seek_bar');

// initialize default variables
let playing = true;
let base = 1;
let songData;
let songIndex = 0;

// get the music files
const urlSearchParams = new URLSearchParams(location.search);

fetch('/music/get_files?album=' + urlSearchParams.get('album'))
    .then(response => response.json())
    .then(data => {
            songData = data;
            console.log(songData);
        }
    );

init(function () {

    if (pPause != undefined) {

        setSongData(songIndex);

        setTimeout(function () {
            updateProgressValue();
        }, 100);


        pPause.addEventListener('click', (e) => {
            playPause();
        });

        nextBtn.addEventListener('click', function () {
            nextSong();
        });

        previousBtn.addEventListener('click', function () {
            previousSong();
        });

        seekBar.addEventListener('change', function () {
            song.currentTime = (song.duration / 100 * seekBar.value);
        });
    }
});

// function which play and pause the song
function playPause() {
    let playBtn = pPause.getElementsByTagName('span')[0];
    if (playing) {
        playBtn.innerHTML = 'pause_circle_filled';
        thumbnail.style.transform = "scale(0.9)";

        song.play();
        playing = false;
        updateProgressValue();

    } else {

        thumbnail.style.transform = "scale(1)"
        playBtn.innerHTML = 'play_circle';

        song.pause();
        playing = true;
    }
}

// automatically play the next song at the end of the audio object's duration
song.addEventListener('ended', function () {
    nextSong();
});

// function which gos to the next song
function nextSong() {
    songIndex++;
    if (songIndex >= songData.length) {
        songIndex = 0;
    }
    setSongData(songIndex);

    playing = true;
    playPause();
}

// function which gos to the previous song
function previousSong() {
    songIndex--;
    if (songIndex <= 0) {
        songIndex = 1;
    }

    setSongData(songIndex);
    playing = true;
    playPause();
}

function setSongData(songIndex) {
    console.log(songIndex)
    song.src = songData[songIndex].path;
    // thumbnail.src = thumbnails[songIndex];
    // background.src = thumbnails[songIndex];

    // songArtist.innerHTML = songArtists[songIndex];
    songTitle.innerHTML = songData[songIndex].name;
}

// update progressBar.max to song object's duration, same for progressBar.value, update currentTime/duration DOM
function updateProgressValue() {

    let max = song.duration;
    let value = song.currentTime;
    let progress = Math.floor((100 / max * value));
    let currentTime = formatTime(Math.floor(value));
    let seekBarProgress = (progress < 1 || isNaN(progress) ? 1 : progress);

    document.getElementById('music_max_time').innerHTML = (formatTime(Math.floor(max)));
    document.getElementById('music_current_time').innerHTML = currentTime;
    document.getElementById('music_song_seek_bar').style.background = 'linear-gradient(to right, #BC6C25 0%,#BC6C25 ' + seekBarProgress + '%, #fff ' + seekBarProgress + '%)';


    seekBar.value = seekBarProgress;

    base = (base === 1 ? 0.9 : 1)
    thumbnail.style.transform = "scale(" + base + ")";

    if (!playing) {
        setTimeout(function () {

            updateProgressValue()
        }, 1000);
    }
}

// convert time into MM:SS format
function formatTime(seconds) {

    let min = Math.floor((seconds / 60));
    let sec = Math.floor(seconds - (min * 60));

    if (sec < 10) {
        sec = `0${sec}`;
    }

    if (!isNaN(min) && !isNaN(sec)) {

        return `${min}:${sec}`;
    }

    return '0:00';
}

