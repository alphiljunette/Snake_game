document.addEventListener("DOMContentLoaded", () => {
    // Gestion du son effet
    const soundIcon = document.getElementById("sound");
    let soundEnabled = localStorage.getItem("soundEnabled");
    if (soundEnabled === null) soundEnabled = "true"; // Par défaut activé

    function updateSoundIcon() {
        if (soundEnabled === "true") {
            soundIcon.src = "./icone/volume-du-haut-parleur (2).png";
        } else {
            soundIcon.src = "./icone/mute.png";
        }
    }
    updateSoundIcon();

    soundIcon.addEventListener("click", () => {
        soundEnabled = (soundEnabled === "true") ? "false" : "true";
        localStorage.setItem("soundEnabled", soundEnabled);
        updateSoundIcon();
    });

    // Gestion de la musique de fond (même logique que le son)
    const musicIcon = document.getElementById("key");
    let musicEnabled = localStorage.getItem("musicEnabled");
    if (musicEnabled === null) musicEnabled = "true"; // Par défaut activé

    function updateMusicIcon() {
        if (musicEnabled === "true") {
            musicIcon.src = "../asset/icone/note-de-musique.png";
        } else {
            musicIcon.src = "../asset/icone/mute-music.png"; // Mets une icône muette pour la musique
        }
    }
    updateMusicIcon();

    musicIcon.addEventListener("click", () => {
        musicEnabled = (musicEnabled === "true") ? "false" : "true";
        localStorage.setItem("musicEnabled", musicEnabled);
        updateMusicIcon();
    });

    // Appliquer la dernière sélection de fond
    const lastBg = localStorage.getItem("selectedBackground");
    if (lastBg) {
        document.querySelectorAll(".tex").forEach(tex => {
            if (tex.src.endsWith(lastBg.split('/').pop())) {
                tex.classList.add("selected");
            } else {
                tex.classList.remove("selected");
            }
        });
    }

    // Appliquer la dernière sélection de couleur serpent
    const lastSerp = localStorage.getItem("selectedSnakeColor");
    if (lastSerp) {
        document.querySelectorAll(".serp").forEach(serp => {
            if (serp.getAttribute("data-color") === lastSerp) {
                serp.classList.add("selected");
            } else {
                serp.classList.remove("selected");
            }
        });
    }

    // Changer fond
    document.querySelectorAll(".tex").forEach((texture) => {
        texture.addEventListener("click", (event) => {
            document.querySelectorAll(".tex").forEach(tex => tex.classList.remove("selected"));
            event.target.classList.add("selected");
            const selectedBackground = event.target.src;
            localStorage.setItem("selectedBackground", selectedBackground);
        });
    });

    // Changer couleur du serpent
    document.querySelectorAll(".serp").forEach((serpent) => {
        serpent.addEventListener("click", (event) => {
            document.querySelectorAll(".serp").forEach(serp => serp.classList.remove("selected"));
            event.target.classList.add("selected");
            const selectedSnakeColor = event.target.getAttribute("data-color") || "black";
            localStorage.setItem("selectedSnakeColor", selectedSnakeColor);
        });
    });
    function updateSoundIcon() {
    // Toujours la même image
        soundIcon.src = "./icone/volume-du-haut-parleur (2).png";
        const soundWrapper = document.getElementById("sound-wrapper");
        if (soundEnabled === "true") {
            soundWrapper.classList.remove("muted");
        } else {
            soundWrapper.classList.add("muted");
        }
    }
    function updateMusicIcon() {
    const musicWrapper = document.getElementById("music-wrapper");
    if (musicEnabled === "true") {
        musicWrapper.classList.remove("muted");
    } else {
        musicWrapper.classList.add("muted");
    }
}
});