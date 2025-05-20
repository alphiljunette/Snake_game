document.getElementById("haut")?.addEventListener("click", () => simulateKey(38));
document.getElementById("bas")?.addEventListener("click", () => simulateKey(40));
document.getElementById("gauche")?.addEventListener("click", () => simulateKey(37));
document.getElementById("droite")?.addEventListener("click", () => simulateKey(39));

document.querySelector(".bouton-pause")?.addEventListener("click", togglePause);

document.querySelectorAll(".backArrow").forEach(arrow => {
    arrow.addEventListener("click", (event) => {
        event.preventDefault();

        // Récupérer le score affiché si la variable score n'est pas fiable
        let scoreToSave = typeof score !== "undefined" ? score : 0;
        if (scoreToSave === 0 || isNaN(scoreToSave)) {
            const scoreEl = document.querySelector(".scores");
            if (scoreEl) scoreToSave = parseInt(scoreEl.textContent, 10) || 0;
        }
        localStorage.setItem("lastScore", scoreToSave);
        // Récupérer la vitesse de déplacement si la variable moveEvery n'est pas fiable
        if (typeof moveEvery !== "undefined") {
            localStorage.setItem("lastSpeed", moveEvery);
        }

        // Réinitialisation du serpent 
        if (typeof xVelocity !== "undefined" && typeof unitSize !== "undefined") xVelocity = unitSize;
        if (typeof yVelocity !== "undefined") yVelocity = 0;
        if (typeof snake !== "undefined" && typeof unitSize !== "undefined") {
            snake = [
                {x: unitSize * 4, y: 0},
                {x: unitSize * 3, y: 0},
                {x: unitSize * 2, y: 0},
                {x: unitSize, y: 0},
                {x: 0, y: 0}
            ];
        }

        // Redirection selon la flèche cliquée
        const target = arrow.getAttribute("data-target");
        if (target) {
            window.location.href = target;
        }
    });
});

window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        togglePause();
    }
});

function simulateKey(keyCode) {
    changeDirection({ keyCode });
}