// grab all the elements
const songContainer = document.getElementById('song-container');
const controls = document.getElementById('controls');
const playIcon = document.getElementById('play');
const previousIcon = document.getElementById('previous');
const nextIcon = document.getElementById('next');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progress-bar');
const songTitle = document.getElementById('song-title');
const playTime = document.getElementById('play-time');
const totalTime = document.getElementById('total-time');
const songList = document.getElementById('song-list');


// Song titles
const songs = ['Agar Tum Saath Ho - Tamasha', 'Kun Faya Kun - Rockstar',
    'Luka Chuppi - Rang De Basanti', 'Mahahetvali - Aditya Gadhvi',
    'Moj Ma Revu - Aditya Gadhavi', 'Moti veraana - Amit Trivedi | Osman Mir',
    'Namia Girnar', 'Rang Bhini Radha - Aditya Gadhavi',
    'Ranjha –  Shershaah', 'Ya Ali -  Gangster'];

// Render all the elements from the song list
songs.forEach(song => {
    const listItem = document.createElement('li');
    const aTag = document.createElement('a');
    aTag.setAttribute('class', 'list-group-item');
    aTag.setAttribute('draggable', 'true');
    aTag.appendChild(document.createTextNode(song));
    listItem.appendChild(aTag);
    songList.appendChild(listItem);
});

// current song index
let songIndex = 0;

// Initially load first song into player
initSong();

function initSong() {
    const song = songs[songIndex];
    songTitle.innerText = song;
    audio.src = `assets/songs/${song}.mp3`;
    playTime.innerText = (audio.currentTime / 60).toFixed(2);
    totalTime.innerText = (audio.duration / 60).toFixed(2);
    document.querySelectorAll('.list-group-item')[songIndex].classList.add('active');
}

function removePreviousSong() {
    document.querySelectorAll('.list-group-item')[songIndex].classList.remove('active');
}

// Added play, pause event lister on play icon
playIcon.addEventListener('click', () => {
    const isPlaying = playIcon.innerHTML.includes('play');

    if (!isPlaying) {
        pauseSong();
    } else {
        playSong(false);
    }
});

function playSong(setUpDetails = true) {
    if (setUpDetails) {
        initSong();
    }
    playIcon.querySelector('i.bi').classList.remove('bi-play-circle-fill');
    playIcon.querySelector('i.bi').classList.add('bi-pause-circle-fill');
    audio.play();
}

function pauseSong() {
    playIcon.querySelector('i.bi').classList.remove('bi-pause-circle-fill');
    playIcon.querySelector('i.bi').classList.add('bi-play-circle-fill');
    audio.pause();
}

// Added event lister on previous icon to play previous song from list
previousIcon.addEventListener('click', prevSong);
function prevSong() {
    removePreviousSong();
    songIndex = songIndex - 1 < 0 ? songs.length - 1 : songIndex - 1;
    playSong();
}

// Added event lister On end of current song and next icon play next song
audio.addEventListener('ended', nextSong);
nextIcon.addEventListener('click', nextSong);

function nextSong() {
    removePreviousSong();
    songIndex = songIndex + 1 > songs.length - 1 ? 0 : songIndex + 1;
    playSong();
}

// Added event lister on audio time update to update progress bar
audio.addEventListener('timeupdate', updateProgress)

function updateProgress(event) {
    const { duration, currentTime } = event.srcElement;
    progressBar.style.width = `${(currentTime / duration) * 100}%`;
    playTime.innerText = (currentTime / 60).toFixed(2);
    totalTime.innerText = (duration / 60).toFixed(2);
}

// Added event lister On progress bar click to fast forward song
progress.addEventListener('click', fastForwardSong);

function fastForwardSong(event) {
    const width = this.clientWidth;
    const offset = event.offsetX;

    audio.currentTime = (offset / width) * audio.duration;
}


// Added drag event listeners to all list items
document.querySelectorAll('.list-group-item').forEach(function (song) {
    song.addEventListener('dragstart', handleDragStart);
});


function handleDragStart(event) {
    event.dataTransfer.setData('text/html', this.innerHTML);
    return true;
}

// Add drop event listeners on song container
songContainer.addEventListener('dragenter', handleDragEnter);
function handleDragEnter(event) {
    event.preventDefault();
    this.classList.add('over');
}

songContainer.addEventListener('dragleave', handleDragLeave);
function handleDragLeave(event) {
    this.classList.remove('over');
}

songContainer.addEventListener('dragover', handleDragOver);
function handleDragOver(event) {
    event.preventDefault();
    return false;
}

songContainer.addEventListener("drop", handleDrop)
function handleDrop(event) {
    event.stopPropagation();
    const songName = event.dataTransfer.getData('text/html')
    const index = songs.findIndex(name => name === songName);
    if (index !== -1) {
        removePreviousSong();
        songIndex = index;
        playSong();
    }
    this.classList.remove('over');
    return false;
}
