// Fonction pour ouvrir l'application
const ouvrirApplication = () => {
    const lienVersApplication = "https://e-rh-st-andre.kelio.io/open/login";
    window.open(lienVersApplication, "_blank");
};

// Fonction pour gérer l'événement de pression de la touche "K"
const gestionnaireClicToucheK = (event) => {
    if (event.key === "k" || event.key === "K") {
        ouvrirApplication();
    }
};

/* === SIDEBAR === */
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuBtn.addEventListener("click", toggleSidebar);
overlay.addEventListener("click", toggleSidebar);

function toggleSidebar() {
  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
}

/* === TICKER ACTUALITÉS === */
fetch("http://intranet2.saint-andre.re/wp-json/wp/v2/posts")
  .then(res => res.json())
  .then(data => {
    const ticker = document.getElementById("ticker-content");
    if (!ticker) return;

    if (data.length > 0) {
      const items = data.slice(0, 4);
      ticker.innerHTML = `<span class="ticker-label">Actualités : </span>` +
        items.map((item, i) => {
          const title = item.title.rendered.replace(/<[^>]*>/g, '');
          return `<a href="${item.link}" target="_blank">${title}</a>${i < items.length - 1 ? ' • ' : ''}`;
        }).join('');
      ticker.innerHTML += '&nbsp;&nbsp;' + ticker.innerHTML;

      requestAnimationFrame(() => {
        const contentWidth = ticker.scrollWidth / 2;
        const speed = 100; // pixels/s
        const duration = contentWidth / speed;

        ticker.style.minWidth = (contentWidth * 2) + "px";

        const styleTag = document.createElement("style");
        styleTag.textContent = `
          #ticker-content {
            display: inline-block;
            white-space: nowrap;
            animation-name: scroll-left-dynamic;
            animation-duration: ${duration}s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            padding-left: 0;
          }
          @keyframes scroll-left-dynamic {
            0% { transform: translateX(0); }
            100% { transform: translateX(-${contentWidth}px); }
          }
        `;
        document.head.appendChild(styleTag);

        // Ralentissement au survol
        const links = ticker.querySelectorAll("a");
        links.forEach(link => {
          link.addEventListener("mouseover", () => {
            ticker.style.animationPlayState = "paused";
          });
          link.addEventListener("mouseout", () => {
            ticker.style.animationPlayState = "running";
          });
        });
      });
    } else {
      ticker.textContent = "Aucune actualité trouvée.";
    }
  })
  .catch(err => {
    console.error(err);
    const ticker = document.getElementById("ticker-content");
    if (ticker) ticker.textContent = "Erreur de chargement.";
  });

  // Écouteur d'événement pour toute la page
document.addEventListener("keydown", gestionnaireClicToucheK);