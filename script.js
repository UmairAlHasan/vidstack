import { VidstackPlayer, VidstackPlayerLayout } from 'https://cdn.vidstack.io/player';       

// ✅ Generate Episodes Array from Data
const episodes = videoUrls.map((url, index) => ({
    title: titles[index],
    videoSrc: url,
    poster: posters[index],
    englishSubtitleSrc: subtitles[index],
    chapterTrackSrc: chapters[index]
}));

let currentPlayer;

async function createPlayer(episode) {
    const player = document.getElementById("player");
    player.innerHTML = ""; // Remove previous player
    
       if (!episode.videoSrc) {
        player.innerHTML = `<div class="no-video-message">This episode is currently uploading...</div>`;
        return;
    }

    currentPlayer = await VidstackPlayer.create({
        target: "#player",
        title: episode.title,
        src: episode.videoSrc,
        poster: episode.poster,
        layout: new VidstackPlayerLayout({
            thumbnails: "https://example.com/thumbnails.vtt"
        }),
        playsinline: true,
        fullscreen: { enabled: false },
        tracks: [
            { kind: "subtitles", label: "English", src: episode.englishSubtitleSrc, srclang: "en", default: true },
            { src: episode.chapterTrackSrc, language: "en-US", kind: "chapters", type: "vtt", default: true }
        ]
    });
}

function generatePlaylist() {
    const playlistContainer = document.getElementById("playlistContainer");
    playlistContainer.innerHTML = "";

    episodes.forEach((episode, index) => {
        const episodeItem = document.createElement("div");
        episodeItem.classList.add("playlist-item");
        episodeItem.textContent = index + 1;

        const ccBadge = document.createElement("div");
        ccBadge.classList.add("cc-badge");
        ccBadge.innerHTML = '<i class="fa-solid fa-microphone-lines"></i>';
        episodeItem.appendChild(ccBadge);

        episodeItem.addEventListener("click", () => {
            document.querySelectorAll(".playlist-item").forEach(item => item.classList.remove("active"));
            episodeItem.classList.add("active");
            createPlayer(episode);
        });

        playlistContainer.appendChild(episodeItem);

        if (index === 0) {
            episodeItem.classList.add("active");
        }
    });
}

generatePlaylist();

// ✅ Disable Right Click & Developer Shortcuts
document.addEventListener("contextmenu", (event) => event.preventDefault());
document.addEventListener("keydown", (event) => { 
    if (event.ctrlKey && (event.key === "s" || event.key === "u" || event.key === "p")) { 
        event.preventDefault();
    } 
});

// ✅ Loading Screen Setup
const playerContainer = document.querySelector(".playerContainer");

const loadingScreen = document.createElement("div");
loadingScreen.classList.add("loading-screen");
loadingScreen.innerHTML = `
    <div class="loading-content">
        <p>Powered by <strong>ARCloud Api</strong></p>
        <div class="loading-line"></div>
    </div>
`;

playerContainer.appendChild(loadingScreen);

// ✅ Ensure Player Shows After Loading and First Episode Plays
setTimeout(() => {
    loadingScreen.remove(); // Remove Loading Screen
    document.querySelector("#player").style.display = "block"; // Show Player

    // ✅ First episode dobara load karna after loading screen
    if (episodes.length > 0) {
        createPlayer(episodes[0]); // First episode ko load karega
        document.querySelectorAll(".playlist-item")[0].classList.add("active"); // First episode ko active karega
    }
}, 3000);
